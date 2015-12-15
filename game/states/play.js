'use strict';

import settings from '../settings';
import maps from '../maps';
import _ from 'lodash';
import OutcomeManager from '../utils/outcomeManager';
import {generateTeam} from '../utils/playerGenerator';

import {
  Field,
  Goal,
  Minimap,
  Team,
  Player,
  Arrow,
  Ball
} from '../prefabs';

import Bar from '../ui/bar';

const camSize = {
  width: 800,
  height: 600
};

const transitionTime = 3000; // ms

export default class Play {

  create() {
    let game = this.game;
    game.__state = '';
    game.currentMapIndex = game.gd.get('nextLevel');
    game.gd.set('currentLevel', game.currentMapIndex);

    this.initPhysics();
    this.createField();
    this.createArrow();
    this.createBall();
    this.createTeams();
    this.createMinimap();
    this.createHUDBars();

    game.i.A._rawOnDown.add(this.__onDownA, this);
    game.i.A.onUp.add(this.__onUpA, this);
    game.i.B._rawOnDown.add(this.__onDownB, this);
    game.i.B.onUp.add(this.__onUpB, this);

    this.game.setGameState = this.setGameState.bind(this);

    this.timerGameState = null;
    this.setGameState('starting');
  }

  __onDownA(){
    this.game.teams.a.onShootDown();
  }
  __onUpA(){
    this.game.teams.a.onShootUp();
  }
  __onDownB(){
    this.game.teams.a.onCallDown();
  }
  __onUpB(){
    this.game.teams.a.onCallUp();
  }

  setGameState(type, time) {
    if (!this.timerGameState){ // if there is not a state running already

      switch (type) {
        case 'starting':
          this.game.__state = 'starting';
          this.showMsg('ready', 100);
          time = 2000;
          break;
        case 'goal':
          this.game.__state = 'end:win';
          this.showMsg('goal', 450);
          break;
        case 'outside':
        case 'lostball':
          this.game.__state = 'end:loose';
          this.showMsg('loose', 250);
          break;
      }

      this.timerGameState = setTimeout(() => this.moveNextState(), time || transitionTime);
    }
  }

  moveNextState() {
    let state = this.game.__state;
    this.game.__state = '';

    clearTimeout(this.timerGameState);
    this.timerGameState = null;
    this.hideCurrentMsg();

    switch(state){
      case 'starting':
        this.game.__state = ''; // clear state
        break;
      case 'end:win':
        OutcomeManager.win(this.game);
        this.game.state.start('inbetween');
        break;
      case 'end:loose':
        OutcomeManager.lose(this.game);
        this.game.state.start('inbetween');
        break;
    }
  }

  showMsg(type, y){
    this.currentMsg = this.game.add.sprite(100, y || 450, 'msg_' + type);
    this.currentMsg.fixedToCamera = true;
  }

  hideCurrentMsg(){
    if (this.currentMsg && this.currentMsg.destroy){
      this.currentMsg.destroy();
      this.currentMsg = null;
    }
  }

  initPhysics() {
    let game = this.game;

    game.physics.startSystem(Phaser.Physics.P2JS);
    let physics = game.physics.p2;

    physics.setImpactEvents(true);
    physics.defaultRestitution = 0.8;
    physics.gravity.y = settings.gravity;

    game.collisionGroups = {
      teamA: physics.createCollisionGroup(),
      teamB: physics.createCollisionGroup(),
      ball: physics.createCollisionGroup(),
      goal: physics.createCollisionGroup(),
    };

    physics.updateBoundsCollisionGroup();
  }

  createArrow() {
    this.game.arrow = new Arrow(this.game);
    this.game.add.existing(this.game.arrow);
  }

  createBall() {
    let game = this.game;
    let map = maps[game.currentMapIndex];

    game.ball = new Ball(this.game, map.ball.pos.x, map.ball.pos.y);
    game.add.existing(game.ball);

    game.camera.follow(game.ball);
  }

  createTeams(){
    let game = this.game;
    let map = maps[game.currentMapIndex];
    let myStats = game.gd.get('team');
    let opStats = generateTeam(map.teamB.players.length, game.currentMapIndex);

    game.teams = {
      a: new Team(game, map.teamA, myStats, {
        own: game.collisionGroups.teamA,
        opposite: game.collisionGroups.teamB,
        ball: game.collisionGroups.ball
      }, true),
      b: new Team(game, map.teamB, opStats, {
        own: game.collisionGroups.teamB,
        opposite: game.collisionGroups.teamA,
        ball: game.collisionGroups.ball
      }, false)
    };

    game.add.existing(game.teams.a);
    game.add.existing(game.teams.b);
  }

  createField() {
    let game = this.game;
    var map = maps[this.game.currentMapIndex];

    game.field = new Field(game, map.fieldSize);
    game.add.existing(game.field);

    let fieldSize = game.field.totalSize;
    game.world.setBounds(0, 0, fieldSize.width, fieldSize.height);

    this.game.goalTop = new Goal(game, 700, 55);
    game.add.existing(this.game.goalTop);
  }

  createMinimap(){
    this.minimap = new Minimap(this.game, camSize);
    this.game.add.existing(this.minimap);
  }

  createHUDBars(){
    let game = this.game;

    game.shootBar = new Bar(game, {
      value: 0,
      width: 140,
      height: 20,
      leftMargin: 0,
      innerColor: '#3C3C3C',
      outerColor: '#FFFFFF',
      fullColor: 0x3CAA3C,
      fullThreshold: 0.8,
      x: this.minimap.x,
      y: this.minimap.y-22
    });

    game.callBar = new Bar(game, {
      value: 0,
      width: 140,
      height: 20,
      leftMargin: 0,
      innerColor: '#3C3C3C',
      outerColor: '#FFFFFF',
      fullColor: 0x3CAA3C,
      fullThreshold: 0.8,
      x: this.minimap.x,
      y: this.minimap.y-45
    });

    game.shootBar.fixedToCamera = true;
    game.callBar.fixedToCamera = true;
    game.add.existing(game.shootBar);
    game.add.existing(game.callBar);
  }

  update () {
    this.visibleBars = this.game.teams.a.getActivePlayer();
    this.game.shootBar.visible = this.visibleBars;
    this.game.callBar.visible = this.visibleBars;
  }

  destroy(){
    game.i.A._rawOnDown.remove(this.__onDownA, this);
    game.i.A.onUp.remove(this.__onUpA, this);
    game.i.B._rawOnDown.remove(this.__onDownB, this);
    game.i.B.onUp.remove(this.__onUpB, this);
    super.destroy();
  }

};

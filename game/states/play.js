'use strict';

import settings from '../settings';
import maps from '../maps';
import _ from 'lodash';
import OutcomeManager from '../utils/outcomeManager';

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

const transitionTime = 5000; // ms

export default class Play {

  create() {
    let game = this.game;
    game.__state = '';
    game.currentMapIndex = 0;

    this.initPhysics();
    this.createField();
    this.createArrow();
    this.createBall();
    this.createTeams();
    this.createMinimap();
    this.createHUDBars();

    game.i.A._rawOnDown.add(() => game.teams.a.onShootDown());
    game.i.A.onUp.add(() => game.teams.a.onShootUp());
    game.i.B._rawOnDown.add(() => game.teams.a.onCallDown());
    game.i.B.onUp.add(() => game.teams.a.onCallUp());

    this.game.setGameState = this.setGameState.bind(this);

    this.timerGameState = null;
    this.setGameState('starting');
  }

  setGameState(type, time) {
    if (!this.timerGameState){ // if there is not a state running already

      switch (type) {
        case 'starting':
          this.game.__state = 'starting';
          time = 3000;
          break;
        case 'goal':
          this.game.__state = 'end:win';
          break;
        case 'outside':
        case 'lostball':
          this.game.__state = 'end:loose';
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
    let opStats = []; // map.teamB.length

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
    this.game.i.A.onDown.remove(this._rawOnDown, this);
    this.game.i.A.onUp.remove(this.onAUp, this);
    this.game.i.B.onDown.remove(this._rawOnDown, this);
    this.game.i.B.onUp.remove(this.onAUp, this);
    super.destroy();
  }

};

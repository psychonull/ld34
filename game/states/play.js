'use strict';

import settings from '../settings';
import maps from '../maps';
import _ from 'lodash';

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

export default class Play {

  create() {
    this.game.currentMapIndex = 0;

    this.initPhysics();
    this.createField();
    this.createArrow();
    this.createBall();
    this.createTeams();
    this.createMinimap();
    this.createShootBar();

    this.game.i.A.onDown.add(this.onADown, this);
    this.game.i.A.onUp.add(this.onAUp, this);
  }

  onADown(){
    this.game.teams.a.onShootDown();

    // since team A is the controlled team, shouldn't fire control events on team B
    //this.game.teams.b.onShootDown();
  }

  onAUp(){
    this.game.teams.a.onShootUp();

    // since team A is the controlled team, shouldn't fire control events on team B
    //this.game.teams.b.onShootUp();
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

    game.teams = {
      a: new Team(game, map.teamA, {
        own: game.collisionGroups.teamA,
        opposite: game.collisionGroups.teamB,
        ball: game.collisionGroups.ball
      }, true),
      b: new Team(game, map.teamB, {
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

    this.game.goalTop = new Goal(game, 700, 75);

    game.add.existing(this.game.goalTop);
  }

  createMinimap(){
    this.minimap = new Minimap(this.game, camSize);
    this.game.add.existing(this.minimap);
  }

  createShootBar(){
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

    game.shootBar.fixedToCamera = true;
    game.add.existing(game.shootBar);
  }

  update () {

  }

  destroy(){
    this.game.i.A.onDown.remove(this.onADown, this);
    this.game.i.A.onUp.remove(this.onAUp, this);
    super.destroy();
  }

};

'use strict';

import settings from '../settings';
import maps from '../maps';
import _ from 'lodash';

import {
  Field,
  Minimap,
  Team,
  Player,
  Ball
} from '../prefabs';

const camSize = {
  width: 800,
  height: 600
};

export default class Play {

  create() {
    this.game.currentMapIndex = 0;

    this.initPhysics();
    this.createField();
    this.createBall();
    this.createTeams();
    this.createMinimap();

    // For test camera
    //this.cursors = this.game.input.keyboard.createCursorKeys();
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
      ball: physics.createCollisionGroup()
    };

    physics.updateBoundsCollisionGroup();
  }

  createBall() {
    let game = this.game;
    let map = maps[game.currentMapIndex];

    this.ball = new Ball(this.game, map.ball.pos.x, map.ball.pos.y);
    this.ball.body.setCollisionGroup(game.collisionGroups.ball);
    this.ball.body.collides([game.collisionGroups.teamA, game.collisionGroups.teamB]);

    game.add.existing(this.ball);
    game.camera.follow(this.ball);

    this.game.ball = this.ball;
  }

  createTeams(){
    let game = this.game;
    let map = maps[game.currentMapIndex];

    game.teams = {
      a: new Team(game, map.teamA, {
        own: game.collisionGroups.teamA,
        opposite: game.collisionGroups.teamB,
        ball: game.collisionGroups.ball
      }),
      b: new Team(game, map.teamB, {
        own: game.collisionGroups.teamB,
        opposite: game.collisionGroups.teamA,
        ball: game.collisionGroups.ball
      })
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
  }

  createMinimap(){
    this.minimap = new Minimap(this.game, camSize);
    this.game.add.existing(this.game.field);
  }

  update () {
    //this.moveCamera();
  }
/*
  moveCamera() {

    if (this.cursors.left.isDown) {
      this.game.camera.x -= 8;
    } else if (this.cursors.right.isDown) {
      this.game.camera.x += 8;
    }

    if (this.cursors.up.isDown) {
      this.game.camera.y -= 8;
    } else if (this.cursors.down.isDown) {
      this.game.camera.y += 8;
    }
  }
*/
};

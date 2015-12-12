'use strict';

import settings from '../settings';
import maps from '../maps';
import _ from 'lodash';

import {
  Field,
  Team,
  Player,
  Ball
} from '../prefabs';

export default class Play {

  create() {
    this.game.currentMapIndex = 0;

    this.initPhysics();
    this.createField();
    this.createEntities();

    this.createTeams();

    // For test camera
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  initPhysics() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.defaultRestitution = 0.8;
    this.game.physics.p2.gravity.y = settings.gravity;
  }

  createEntities() {
    this.ball = new Ball(this.game, 200, 270);
    this.player = new Player(this.game, 200, 300);

    this.game.add.existing(this.ball);
    this.game.add.existing(this.player);

    //game.camera.follow(this.ball);
  }

  createTeams(){
    var map = maps[this.game.currentMapIndex];

    this.teamA = new Team(this.game, map.teamA);
    this.teamB = new Team(this.game, map.teamB);

    this.game.add.existing(this.teamA);
    this.game.add.existing(this.teamB);
  }

  createField() {
    var map = maps[this.game.currentMapIndex];

    this.field = new Field(this.game, map.fieldSize);
    this.game.add.existing(this.field);

    let fieldSize = this.field.totalSize;
    this.game.world.setBounds(0, 0, fieldSize.width, fieldSize.height);
  }

  update () {
    this.moveCamera();
  }

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

};

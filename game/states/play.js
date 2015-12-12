'use strict';

import settings from '../settings';
import _ from 'lodash';

import {
  Field,
  Player,
  Ball
} from '../prefabs';

export default class Play {

  create() {
    this.initPhysics();
    this.createField();
    this.createEntities();
    
    this.playersCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.ballCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.player.body.setCollisionGroup(this.playersCollisionGroup);
    this.ball.body.setCollisionGroup(this.ballCollisionGroup);

    this.player.body.collides(this.ballCollisionGroup, this.hitBall, this); 

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

  createField() {
    this.field = new Field(this.game, 5);
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

  hitBall(player, ball){
  	ball.velocity.y = 100;
  }

};

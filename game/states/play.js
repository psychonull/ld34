'use strict';

import settings from '../settings';
import _ from 'lodash';
import Field from '../prefabs/Field';

var Player = require('../prefabs/player');
var Ball = require('../prefabs/ball');


export default class Play {
  create() {
    var game = this.game;
    //var ws = settings.worldSize;

    this.startingSetting = _.cloneDeep(settings);

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0.8;
    game.physics.p2.gravity.y = settings.gravity;
    this.ball = new Ball(game, 200, 270);
    this.player = new Player(game, 200, 300);

    this.playersCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.ballCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.player.body.setCollisionGroup(this.playersCollisionGroup);
    this.ball.body.setCollisionGroup(this.ballCollisionGroup);

    this.player.body.collides(this.ballCollisionGroup, this.hitBall, this);  

    //game.camera.follow(this.player);
    this.createField();
    game.add.existing(this.ball);
    game.add.existing(this.player);

    //game.camera.follow(this.player);




    // For test camera
    this.cursors = game.input.keyboard.createCursorKeys();
  }

  createField() {
    var game = this.game;
    
    this.field = new Field(game, 5);
    game.add.existing(this.field);

    let fieldSize = this.field.totalSize;
    game.world.setBounds(0, 0, fieldSize.width, fieldSize.height);

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

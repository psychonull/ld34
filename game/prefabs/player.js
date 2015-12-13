'use strict';

import { debug, player as _player } from '../settings';

const intervalRun = 250; // ms
const runThrust = 50;

export default class Player extends Phaser.Sprite {

  constructor(game, x, y, asset, frame) {
    super(game, x, y, asset || 'player1', frame);

    game.physics.p2.enable(this, debug);

    this.body.fixedRotation = true;
    this.body.angularVelocity = 0;
    this.body.data.gravityScale = 0;
    this.body.mass = _player.mass;
    //this.body.collideWorldBounds = true;

    this.physicShape = this.body.setCircle(20);

    this.scale.x = 0.4;
    this.scale.y = 0.4;
    //this.anchor.set(0.7,0.5);

    this.timer = null;
    this.body.setZeroVelocity();
  }

  setControlled(controlling){
    if (controlling && !this.timer){
      this.timer = this.game.time.create(false);
      this.timer.loop(intervalRun, () => this.body.moveUp(runThrust));
      this.timer.start();
    }
    else if (!controlling && this.timer){
      this.timer.stop();
    }

    this.body.setZeroVelocity();
  }

  kick(){
    this.body.setZeroVelocity();
  }

  update(){

  }

  accelerateToBall() { //not used yet
    let ball = this.game.ball;
    var angle = Math.atan2(ball.y - this.y, ball.x - this.x);

    this.body.rotation = angle + this.game.math.degToRad(90);
    this.body.force.x = Math.cos(angle) * runThrust;
    this.body.force.y = Math.sin(angle) * runThrust;
  }

};

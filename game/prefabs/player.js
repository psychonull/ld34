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
    this.shootForce = 0;
    //this.body.collideWorldBounds = true;

    this.physicShape = this.body.setCircle(10);

    this.scale.setTo(1.5);
    this.anchor.set(0.5,0.75);

    this.timer = null;
    this.body.setZeroVelocity();
    this.initAnimations();

    this.game.i.A.onDown.add(this.onShootDown, this);
    this.game.i.A.onUp.add(this.onShootUp, this);
  }

  onShootDown(){
      this.shootForce += -200;
    }

  onShootUp(){
    this.shootForce *= (Date.now() - this.game.i.A.keyList[1].timeDown)/100;
    let ball = this.game.ball;
    ball.shoot(90, this.shootForce);
    this.shootForce = 0;
  }

  initAnimations(){
    this.animations.add('run:left', [0, 1, 2]);
    this.animations.add('run:right', [9, 10, 11]);
    this.animations.add('run:up', [18, 19, 20]);
    this.animations.add('run:down', [21, 22, 23]);

    this.animations.add('idle:left', [1]);
    this.animations.add('idle:right', [10]);
    this.animations.add('idle:up', [19]);
    this.animations.add('idle:down', [22]);

    this.animations.play('idle:up', 1, true);
  }

  setControlled(controlling){
    if (controlling && !this.timer){
      this.timer = this.game.time.create(false);
      this.timer.loop(intervalRun, () => this.body.moveUp(runThrust));
      this.timer.start();
      this.animations.play('run:up', 10, true);
    }
    else if (!controlling && this.timer){
      this.timer.stop();
      this.animations.play('idle:up', 1, true);
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

  destroy(){
    this.game.i.A.onDown.remove(this.onShootDown, this);
    this.game.i.A.onUp.remove(this.onShootUp, this);
    super.destroy();
  }

};

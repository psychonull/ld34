'use strict';

import { debug, player as _player } from '../settings';
import {generate as genId} from 'shortid';

const intervalRun = 250; // ms
const runThrust = 50;

export default class Player extends Phaser.Sprite {

  constructor(game, x, y, asset, frame) {
    super(game, x, y, asset || 'player1', frame);

    game.physics.p2.enable(this, debug);
    this.__id = genId();
    this.body.fixedRotation = true;
    this.body.angularVelocity = 0;
    this.body.data.gravityScale = 0;
    this.body.mass = _player.mass;
    this.kickForce = -13000;
    //this.body.collideWorldBounds = true;

    this.body.setCircle(10);

    this.scale.setTo(1.5);
    this.anchor.set(0.5,0.75);

    this.timer = null;
    this.controlling = false;
    this.body.setZeroVelocity();
    this.initAnimations();
  }

  onShootDown(){
    this.shoot = true;
    this.game.arrow.resumeMove();
  }

  onShootUp(){
    this.game.arrow.stopMove();
  }

  onShoot(){
    if (!this.controlling){
      return; // I lost the ball
    }

    let secondsHold = (Date.now() - this.game.i.A.keyList[1].timeDown)/1000;
    secondsHold = secondsHold < 1 ? 1 : secondsHold;
    this.shootForce = this.kickForce * secondsHold;

    this.game.ball.shoot(this.game.arrow.getAngle(), this.shootForce);
    this.game.arrow.resumeMove();
    this.setControlled(false);
  }

  initAnimations(){
    this.animations.add('run:left', [0, 1, 2]);
    this.animations.add('run:left:up', [3, 4, 5]);
    this.animations.add('run:left:down', [6, 7, 8]);

    this.animations.add('run:right', [9, 10, 11]);
    this.animations.add('run:right:up', [12, 13, 14]);
    this.animations.add('run:right:down', [15, 16, 17]);

    this.animations.add('idle:left', [1]);
    this.animations.add('idle:left:up', [4]);
    this.animations.add('idle:left:down', [7]);

    this.animations.add('idle:right', [10]);
    this.animations.add('idle:right:up', [13]);
    this.animations.add('idle:right:down', [16]);

    this.animations.add('run:up', [18, 19, 20]);
    this.animations.add('run:down', [21, 22, 23]);

    this.animations.add('idle:up', [19]);
    this.animations.add('idle:down', [22]);

    this.animations.play('idle:up', 1, true);
  }

  isControlled() {
    return this.controlling;
  }

  setControlled(controlling){
    if (controlling && !this.controlling){
      this.timer = this.game.time.create(false);
      this.timer.loop(intervalRun, () => this.body.moveUp(runThrust));
      this.timer.start();
      //this.animations.play('run:up', 10, true);
      this.game.arrow.setPlayer(this);
      this.game.ball.hasNewPlayer(this);
    }
    else if (!controlling && this.controlling){
      this.game.arrow.clearPlayer();
      this.timer.stop();
      this.timer = null;
      //this.animations.play('idle:up', 1, true);
    }

    this.controlling = controlling;
    this.body.setZeroVelocity();
  }

  kick(){
    if (!this.controlling){
      return;
    }

    if (this.shoot && !this.game.i.A.keyList[1].isDown) {
      this.shoot = false;
      this.onShoot();
    } else {
      this.game.ball.body.x = this.x;
      this.body.setZeroVelocity();
    }
  }

  update(){
    this.calculateAnimation();
  }

  calculateAnimation(){
    let bVel = this.body.velocity;
    let v = Phaser.Point.normalize(new Phaser.Point(bVel.x, bVel.y));

    let type = 'run', anim, hor, ver;
    let name = this.animations.currentAnim.name;

    if (v.x === 0 && v.y === 0){ //idle
      type = 'idle';
      // replace velocity vector with a direction vector between the player & the ball
      v = this.getVectorToBall().normalize();
    }

    let getVertical = () => {
      if (v.y > 0 && v.y < 1){
        return 'down';
      }

      if (v.y < 0 && v.y > -1){
        return 'up';
      }
    };

    if (v.x < 0.1 && v.x > -0.1){ // is straight up or down
      hor = getVertical();
    }
    else {
      if (v.x > 0.1 && v.x <= 1){
        hor = 'right';
      }
      else if (v.x <= 0.1 && v.x >= -1){
        hor = 'left';
      }

      if (v.y !== 0){ // is not straight left or right
        ver = getVertical();
      }
    }

    anim = type + ':' + hor;
    if (ver){
      anim += ':' + ver;
    }

    if (name !== anim){ //set play only if animation changed
      this.animations.play(anim, 10, true);
    }
  }

  accelerateToBall() {
    let ball = this.game.ball;
    var angle = Math.atan2(ball.y - this.y, ball.x - this.x);

    this.body.rotation = angle + this.game.math.degToRad(90);
    this.body.velocity.x = Math.cos(angle) * runThrust;
    this.body.velocity.y = Math.sin(angle) * runThrust;
  }

  getVectorToBall(){
    return Phaser.Point.subtract(this.game.ball.position, this.position);
  }

};

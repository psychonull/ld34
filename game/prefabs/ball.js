'use strict';

import { debug, ball as _ball } from '../settings';

const kickHoldInterval = 500; // ms
const kickHoldThrust = 1000;

export default class Ball extends Phaser.Sprite {

  constructor(game, x, y, frame) {
    super(game, x, y, 'ball', frame);

    game.physics.p2.enable(this, debug);

    this.body.fixedRotation = true;
    this.body.data.gravityScale = 0;
    this.body.angularVelocity = 0;
    this.body.mass = _ball.mass;
    this.physicShape = this.body.setCircle(10);

    this.anchor.setTo(0.5);
    this.scale.setTo(0.5);

    this.initAnimations();
  }

  initAnimations(){
    this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7]);
    this.animations.add('idle', [0]);

    this.animations.play('idle', 1, true);
  }

  forward() {
    this.body.thrust(kickHoldThrust);
    this.animations.play('move', 10, true);

    this.game.time.events.add(kickHoldInterval, () => {
      this.body.setZeroVelocity();
      this.animations.play('idle', 1, true);
    });
  }

  shoot(angle, force, interval) {
    this.body.force.x = Math.cos(this.game.math.degToRad(angle)) * force;
    this.body.force.y = Math.sin(this.game.math.degToRad(angle)) * force;
    //this.body.thrust(kickHoldThrust);
    this.animations.play('move', 10, true);
  }

  update(){

  }
};

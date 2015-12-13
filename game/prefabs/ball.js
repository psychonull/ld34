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
    //this.anchor.set(0.7,0.5);
  }

  forward() {
    this.body.thrust(kickHoldThrust);
    this.game.time.events.add(kickHoldInterval, () => this.body.setZeroVelocity());
  }

  update(){

  }
};

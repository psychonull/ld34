'use strict';

import { debug } from '../settings';

export default class Goal extends Phaser.Sprite {

  constructor(game, x, y, asset, frame) {
    super(game, x, y, asset, frame);

    game.physics.p2.enable(this, debug);

    this.body.static = true;
    this.body.fixedRotation = true;
    this.body.setRectangle(184, 60, 0, 0);

    this.body.setCollisionGroup(game.collisionGroups.goal);
    this.body.collides(game.collisionGroups.ball, this.hitBall, this);

    this.anchor.setTo(0.5);
  }

  hitBall(goalBody, ballBody){
    //console.log('GOOOOOOAAAAALLLLL!!!');
    this.game.state.start('win');
  }

  update(){

  }

};

'use strict';

export default class Ball extends Phaser.Sprite {

  constructor(game, x, y, frame) {
    super(game, x, y, 'ball', frame);

    game.physics.p2.enable(this, false);

    this.body.data.gravityScale = 1;
    this.body.angularVelocity = 0;
    this.physicShape = this.body.setCircle(28);
    //this.anchor.set(0.7,0.5);
  }

  update(){
    this.body.velocity.y = 0;
  }
};

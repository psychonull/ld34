'use strict';

export default class Player extends Phaser.Sprite {

  constructor(game, x, y, asset, frame) {
    super(game, x, y, asset || 'player1', frame);

    game.physics.p2.enable(this, false);

    this.scale.x = 0.4;
    this.scale.y = 0.4;

    this.body.data.gravityScale = 1;
    this.body.angularVelocity = 0;
    this.physicShape = this.body.setCircle(28);
    //this.anchor.set(0.7,0.5);
  }

  update(){
    this.body.velocity.y = 0;
  }
};

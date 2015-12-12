'use strict';

export default class Player extends Phaser.Sprite {

  constructor(game, x, y, asset, frame) {
    super(game, x, y, asset || 'player1', frame);

    game.physics.p2.enable(this, false);
    this.body.fixedRotation = true;
    this.body.angularVelocity = 0;
    this.body.data.gravityScale = 1;

    this.physicShape = this.body.setCircle(28);

    this.scale.x = 0.4;
    this.scale.y = 0.4;
    //this.anchor.set(0.7,0.5);

    this.controlling = false;
  }

  update(){
    this.body.setZeroVelocity();
    if (this.controlling){
      this.move();
    }
  }

  move() {
    let game = this.game;

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      this.body.moveLeft(100);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      this.body.moveRight(100);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      this.body.moveUp(100);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      this.body.moveDown(100);
    }
  }
};

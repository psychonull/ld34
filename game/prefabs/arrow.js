'use strict';

const minAngle = -90;
const maxAngle = 90;

export default class Arrow extends Phaser.Sprite {

  constructor(game, x, y, asset, frame) {
    super(game, x, y, asset || 'arrow', frame);

    this.pivot.y = 30;
    this.anchor.set(0.5);

    this.activePlayer = null;
    this.stopped = false;
    this.dir = 1;

    this.speed = 2;
  }

  setPlayer(player, speed){
    this.activePlayer = player;
    this.stopped = false;
    this.speed = speed;
  }

  clearPlayer(){
    this.activePlayer = null;
  }

  stopMove() {
    this.stopped = true;
  }

  resumeMove() {
    this.stopped = false;
  }

  getAngle() {
    return (this.angle + 90);
  }

  update(){
    if (this.activePlayer){
      this.visible = true;
      this.x = this.activePlayer.x;
      this.y = this.activePlayer.y + 5;

      if (!this.stopped){
        this.rotation += this.game.math.degToRad(this.speed*this.dir);

        if (this.angle < minAngle || this.angle > maxAngle){
          this.dir *= -1;
        }
      }
    }
    else {
      this.visible = false;
    }
  }

};

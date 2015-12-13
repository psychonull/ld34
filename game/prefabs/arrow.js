'use strict';

const angleMoveRate = 2;
const minAngle = -90;
const maxAngle = 90;

export default class Arrow extends Phaser.Sprite {

  constructor(game, x, y, asset, frame) {
    super(game, x, y, asset || 'arrow', frame);
    this.activePlayer = null;
    this.dir = 1;
  }

  setPlayer(player){
    this.activePlayer = player;
  }

  clearPlayer(){
    this.activePlayer = null;
  }

  update(){
    if (this.activePlayer){
      this.x = this.activePlayer.x;
      this.y = this.activePlayer.y + 5;

      this.pivot.y = 30;
      this.anchor.set(0.5);
      this.rotation += this.game.math.degToRad(angleMoveRate*this.dir);

      if (this.angle < minAngle || this.angle > maxAngle){
        this.dir *= -1;
      }
    }
  }

};

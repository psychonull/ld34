
'use strict';

export default class GameOver {
  preload() {

  }

  create() {
    this.titleText = this.game.add.bitmapText(400,100, 'p2', 'Game Over!', 42);
    this.titleText.anchor.setTo(0.5, 0.5);
  }

  update () {

  }
};

'use strict';

export default class Win {

  create() {
    this.titleText = this.game.add.bitmapText(400,100, 'p2', 'Win!', 42);
    this.titleText.anchor.setTo(0.5, 0.5);

  }

  update() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }

};

'use strict';

export default class Win {

  create() {
    this.titleText = this.game.add.bitmapText(400,100, 'p2', 'You Win!', 42);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.bitmapText(300,300, 'p2', 'Good Game', 60);
    this.titleText.anchor.setTo(0.5, 0.5);
  }

  update() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play', true);    
    }
  }

};

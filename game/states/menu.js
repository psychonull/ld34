
'use strict';
import _ from 'lodash';

export default class Menu {
  preload() {

  }

  create() {
    this.titleText = this.game.add.bitmapText(400,100, 'p2', 'Menu!', 42);
    this.titleText.anchor.setTo(0.5, 0.5);
    this.eKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
  }

  update () {
    if(this.game.input.activePointer.justPressed()) {
      this.passToNextState();
    }
    else if(this.eKey.isDown){
      this.passToEditionState();
    }
  }

  passToNextState (e) {
    this.game.input.keyboard.onDownCallback = function(){};
    this.game.state.start('play');
  }

  passToEditionState(e){
    this.game.input.keyboard.onDownCallback = function(){};
    this.game.state.start('edition');
  }
};


'use strict';
import _ from 'lodash';

export default class Menu {
  preload() {

  }

  create() {
    this.titleText = this.game.add.bitmapText(400,100, 'p2', 'Menu!', 42);
    this.titleText = this.game.add.bitmapText(400,300, 'pixelade', 'press A + B to continue', 42);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.game.i.AB.onDown.add(this.passToNextState, this);
  }

  update () {

  }

  passToNextState() {
    this.game.state.start('play');
  }
};

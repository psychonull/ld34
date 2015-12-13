
'use strict';

import _ from 'lodash';
import Menu from '../ui/menu';

export default class MenuState {
  preload() {

  }

  create() {
    this.titleText = this.game.add.bitmapText(400,100, 'p2', 'Menu!', 42);
    // this.titleText = this.game.add.bitmapText(400,300, 'pixelade', 'press A + B to continue', 42);
    // this.titleText.anchor.setTo(0.5, 0.5);

    this.menu = new Menu(this.game, {
      options: [
        {
          id: 'start',
          text: 'START GAME',
          onSelected: () => {
            this.game.state.start('play');
          }
        },
        {
          id: 'instructions',
          text: 'INSTRUCTIONS',
          onSelected: () => {
            this.game.state.start('instructions');
          }
        }
      ],
      signals: {
        next: this.game.i.B.onDown,
        prev: this.game.i.A.onDown,
        select: this.game.i.AB.onDown
      }
    });

    this.game.add.existing(this.menu);

    //this.game.i.AB.onDown.add(this.passToNextState, this);
  }

  update () {

  }

  passToNextState() {
    this.game.state.start('play');
  }
};

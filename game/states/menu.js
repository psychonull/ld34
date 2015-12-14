
'use strict';

import _ from 'lodash';
import Menu from '../ui/menu';
import Popup from '../prefabs/ui/genericPopup';

export default class MenuState {
  preload() {

  }

  create() {
    this.titleText = this.game.add.bitmapText(this.game.world.centerX, 200, 'p2', this.game.gd.settings.gameName, 38);
    this.titleText.anchor.setTo(0.5, 0.5);
    this.eKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
    // this.titleText = this.game.add.bitmapText(400,300, 'pixelade', 'press A + B to continue', 42);
    // this.titleText.anchor.setTo(0.5, 0.5)

    var menu = new Menu(this.game, {
      x: 10,
      y: 10,
      options: [
        {
          id: 'start',
          text: 'NEW GAME',
          onSelected: () => {
            this.passToNextState();
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

    this.menuFrame = new Popup(this.game, {
      x:300,
      y:350,
      content: menu
    });

    this.game.add.existing(this.menuFrame);

  }

  update () {
    if(this.eKey.isDown){
      this.passToEditionState();
    }
  }

  passToNextState() {
    this.game.gd.clear();
    if(this.game.gd._internals.firstTimePlayed){
      this.game.state.start('intro');
    }
    else {
      // skip intro
      this.game.state.start('playerSelection');
    }
  }

  passToEditionState(e){
    this.game.state.start('edition');
  }
};

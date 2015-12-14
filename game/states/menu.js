
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

    this.opponentSprite = this.game.add.sprite(200, 250, 'player_red');
    this.youSprite = this.game.add.sprite(250, 300, 'player_blue');

    this.opponentSprite.scale.setTo(3,3);
    this.youSprite.scale.setTo(4,4);

    this.opponentSprite.animations.add('idle', [22]);
    this.youSprite.animations.add('idle', [19]);

    this.opponentSprite.animations.play('idle', 1, true);
    this.youSprite.animations.play('idle', 1, true);


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
      x:400,
      y:250,
      content: menu
    });

    this.game.add.existing(this.menuFrame);

    this.helpText = this.game.add.bitmapText(200, 570, 'pixelade', '<< Z = UP >> << X = DOWN >> << Z + X  = SELECT >>', 20);
    this.helpText.anchor.setTo(0.5, 0.5);

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

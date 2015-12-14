'use strict';

import Menu from '../ui/menu';
import Popup from '../prefabs/ui/genericPopup';
import BottomSpeech from '../prefabs/ui/bottomSpeech';

export default class Win {

  create() {

    var menu = new Menu(this.game, {
      x: 10,
      y: 10,
      options: [
        {
          id: 'next',
          text: 'Play next match',
          onSelected: () => {
            this.game.state.start('play');
          }
        },
        {
          id: 'roster',
          text: 'My roster',
          onSelected: () => {
            this.game.state.start('instructions');
          }
        },
        {
          id: 'stats',
          text: 'Stats',
          onSelected: () => {
            this.game.state.start('stats');
          }
        },
        {
          id: 'restart',
          text: 'Restart (lose all progress)'
        }
      ],
      signals: {
        next: this.game.i.B.onDown,
        prev: this.game.i.A.onDown,
        select: this.game.i.AB.onDown
      }
    });

    this.menuFrame = new Popup(this.game, {
      x:150,
      y:100,
      width: 500,
      height: 250,
      content: menu
    });

    this.game.add.existing(this.menuFrame);

    if(false){
      this.speech = new BottomSpeech(this.game, {
        value: ['ohhh no. You did it again. \nMorale is always important.', 'NEVER FORGET']
      });
      this.game.add.existing(this.speech);
    }
  }

  update() {

  }

};

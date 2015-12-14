'use strict';

import MultiSelectMenu from '../ui/multiselectMenu';

export default class PlayerSelection {

  create() {
    this.titleText = this.game.add.bitmapText(this.game.world.centerX ,15, 'p2', 'Choose your players', 18);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.menu = new MultiSelectMenu(this.game, {
      options: []
    });

  }

  update() {

  }

  _getDummyData(){
    
  }

};

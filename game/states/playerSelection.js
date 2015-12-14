'use strict';

import MultiSelectMenu from '../ui/multiSelectMenu';
import PlayerSelectionItem from '../prefabs/ui/playerSelectionItem';
import { generate } from '../utils/playerGenerator';

var DUMMY_MAX = '5';

export default class PlayerSelection {

  create() {
    this.titleText = this.game.add.bitmapText(this.game.world.centerX ,15, 'p2', 'Choose your players', 18);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.menu = new MultiSelectMenu(this.game, {
      x: 20,
      options: this._getDummyData(10),
      itemHeight: 45,
      menuItemClass: PlayerSelectionItem,
      signals: {
        next: this.game.i.B.onDown,
        prev: this.game.i.A.onDown,
        check: this.game.i.AB.onDown
      }
    });

    this.selectedCount = this.game.add.bitmapText(this.game.world.centerX , 500, 'p2', '0', 18);
    this.selectedCountSep = this.game.add.bitmapText(this.game.world.centerX + 10 , 500, 'p2', '/', 18);
    this.maxSelectedCount = this.game.add.bitmapText(this.game.world.centerX + 30 , 500, 'p2', DUMMY_MAX, 18);

    this.menu.onToggleCheck.add(this._onToggleItem, this);
    this.menu.onSelect.addOnce((btn, options) => {
      if(btn._config.text.match(/ok/i)){
        this._onConfirm(options.map((o)=>o._config.player));
      }
      else {
        this._onCancel();
      }
    });

    this.game.add.existing(this.menu);

  }

  update() {

  }

  _onToggleItem(clicked, options, menu){
    this.selectedCount.setText(options.length);
  }

  _onConfirm(players){
    console.log(players);
  }

  _onCancel(){
    console.log('cancel');
  }

  _getDummyData(max){
    var dummy = [];
    for(let i = 0; i < max; i++){
      dummy.push({
        player: generate()
      });
    }
    return dummy;
  }

  destroy(){
    this.menu.onToggleCheck.remove(this._onToggleItem, this);
    super.destroy();
  }

};

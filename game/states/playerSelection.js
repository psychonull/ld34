'use strict';

import MultiSelectMenu from '../ui/multiSelectMenu';
import PlayerSelectionItem from '../prefabs/ui/playerSelectionItem';
import PlayerSelectionButton from '../prefabs/ui/playerSelectionButton';
import { generate } from '../utils/playerGenerator';

var DUMMY_MAX = '5';

export default class PlayerSelection {

  create() {
    this.titleText = this.game.add.bitmapText(this.game.world.centerX ,15, 'p2', 'Choose your players', 18);
    this.titleText.anchor.setTo(0.5, 0.5);

    this._initTitles();
    this.menu = new MultiSelectMenu(this.game, {
      x: 20,
      y: 70,
      options: this._getDummyData(3),
      itemHeight: 35,
      menuItemClass: PlayerSelectionItem,
      buttonClass: PlayerSelectionButton,
      signals: {
        next: this.game.i.B.onDown,
        prev: this.game.i.A.onDown,
        check: this.game.i.AB.onDown
      }
    });

    this.selectedCount = this.game.add.bitmapText(675, 550, 'p2', '0', 18);
    this.selectedCountSep = this.game.add.bitmapText(675 + 12 , 550, 'p2', '/', 18);
    this.maxSelectedCount = this.game.add.bitmapText(675 + 34 , 550, 'p2', DUMMY_MAX, 18);

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
    console.log('menu', this.menu.x, this.menu.y);
  }

  _initTitles(){
    const SPACE = 80;
    this.nameLabel = this.game.add.bitmapText(40, 50, 'p2', 'Full Name', 10);
    this.moraleLabel = this.game.add.bitmapText(20 + 300, 50, 'p2', 'Morale', 10);
    this.speedLabel = this.game.add.bitmapText(this.moraleLabel.x + SPACE, 50, 'p2', 'Speed', 10);
    this.shootLabel = this.game.add.bitmapText(this.speedLabel.x + SPACE, 50, 'p2', 'Power', 10);
    this.accLabel = this.game.add.bitmapText(this.shootLabel.x + SPACE, 50, 'p2', 'Accuracy', 9);
    this.controlLabel = this.game.add.bitmapText(this.accLabel.x + SPACE, 50, 'p2', 'Control', 10);
    this.avgLabel = this.game.add.bitmapText(this.controlLabel.x + SPACE, 50, 'p2', 'AVG.', 10);
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

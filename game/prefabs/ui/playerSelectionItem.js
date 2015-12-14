'use strict';

import _ from 'lodash';
import MultiSelectMenuItem from '../../ui/multiSelectMenuItem';
import StatBar from './statBar';

const defaultOptions = {
  style: {
    width: 700,
    height: 45,
    x: 20,
    y: 20,
    font: 'pixelade',
    fontSize: 24,
    fontColor: 0xFFFFFF,
    backgroundColor: 0x000000
  },
  checkedStyle: {
    backgroundColor: 0xFFFFFF,
    fontColor: 0x000000
  },
  checked: false,
  player: null
};

export default class PlayerSelectionItem extends MultiSelectMenuItem {

  constructor(game, config) {
    this._config = _.merge({}, defaultOptions, config);
    this._config.text = this._config.player.fullName;
    super(game, this._config);
    this.initMoraleBar();
  }

  initMoraleBar(){
    this.morale = new StatBar(this.game, {
      value: this._config.player.morale
    });
    //this.game.add.existing(this.morale);
    this.add(this.morale);
  }


};

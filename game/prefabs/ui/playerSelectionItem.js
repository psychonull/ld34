'use strict';

import _ from 'lodash';
import MultiSelectMenuItem from '../../ui/multiSelectMenuItem';
import StatBar from './statBar';

const defaultOptions = {
  style: {
    width: 750,
    height: 35,
    x: 20,
    y: 40,
    font: 'pixelade',
    fontSize: 22,
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
    this.label.y = this._config.style.y;
    this.label.maxWidth = 285;
    this.initMoraleBar();
    this.initSpeedBar();
    this.initPowerBar();
    this.initAccBar();
    this.initControlBar();
    this.initAvg();
  }

  check(){
    this.avg.tint = this._config.checkedStyle.fontColor;
    super.check();
  }

  uncheck(){
    this.avg.tint = this._config.style.fontColor;
    super.uncheck();
  }

  initMoraleBar(){
    this.morale = new StatBar(this.game, {
      value: this._config.player.morale,
      x: this._config.style.x + 300,
      y: this._config.style.y + 10
    });
    //this.game.add.existing(this.morale);
    this.add(this.morale);
  }

  initSpeedBar(){
    this.speed = new StatBar(this.game, {
      value: this._config.player.speed,
      x: this._config.style.x + 300 + 80,
      y: this._config.style.y + 10
    });
    //this.game.add.existing(this.morale);
    this.add(this.speed);
  }

  initPowerBar(){
    this.power = new StatBar(this.game, {
      value: this._config.player.shootPower,
      x: this._config.style.x + 300 + 80 + 80,
      y: this._config.style.y + 10
    });
    //this.game.add.existing(this.morale);
    this.add(this.power);
  }

  initAccBar(){
    this.accuracy = new StatBar(this.game, {
      value: this._config.player.accuracy,
      x: this._config.style.x + 300 + 80 + 80 + 80,
      y: this._config.style.y + 10
    });
    //this.game.add.existing(this.morale);
    this.add(this.accuracy);
  }

  initControlBar(){
    this.control = new StatBar(this.game, {
      value: this._config.player.control,
      x: this._config.style.x + 300 + 80 + 80 + 80 + 80,
      y: this._config.style.y + 10
    });
    //this.game.add.existing(this.morale);
    this.add(this.control);
  }

  initAvg(){
    let { morale, speed, shootPower, accuracy, control } = this._config.player;
    let average = (morale + speed + shootPower + accuracy + control) / 5 * 100;
    this.avg = this.game.add.bitmapText(
      this._config.style.x + 300 + 80 + 80 + 80 + 80 + 80,
      this._config.style.y + 10,
      'p2',
      average.toFixed(),
      11
    );
    this.add(this.avg);
  }


};

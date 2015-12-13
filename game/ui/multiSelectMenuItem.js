'use strict';

import _ from 'lodash';
import MenuItem from './menuItem';

const defaultOptions = {
  style: {
    width: 100,
    height: 45,
    x: 0,
    y: 0,
    font: 'pixelade',
    fontSize: 42,
    fontColor: 0xFFFFFF,
    backgroundColor: 0x000000
  },
  checkedStyle: {
    backgroundColor: 0xFFFFFF,
    fontColor: 0x000000
  },
  checked: false
};

export default class MultiSelectMenuItem extends MenuItem {

  constructor(game, config) {
    this._config = _.merge({}, defaultOptions, config);
    super(game, this._config);
  }

  setup(){
    this.setupBackground();
    super.setup();

    this.label.tint = this._config.style.fontColor;

    this.checked = this._config.checked;
  }

  setupBackground(){
    var outerBmd = this.game.add.bitmapData(this._config.style.width, this._config.style.height);
  	outerBmd.ctx.beginPath();
  	outerBmd.ctx.rect(0, 0, this._config.style.width, this._config.style.height);
  	outerBmd.ctx.fillStyle = '#FFFFFF';
  	outerBmd.ctx.fill();

    this.background = this.game.add.sprite(this._config.style.x, this._config.style.y, outerBmd);
    this.background.tint = this._config.style.backgroundColor;
    this.add(this.background);
  }

  toggleChecked() {
    if(this.checked){
      this.uncheck();
    }
    else{
      this.check();
    }
  }

  check(){
    this.background.tint = this._config.checkedStyle.backgroundColor;
    this.label.tint = this._config.checkedStyle.fontColor;
    //TODO: Apply all transformations?
    this.checked = true;
  }

  uncheck(){
    this.background.tint = this._config.style.backgroundColor;
    this.label.tint = this._config.style.fontColor;
    this.checked = false;
  }

  select(){
    if(this._config.onSelected){
      let onSelectedResult = this._config.onSelected(this);
    }
  }

};

'use strict';

import _ from 'lodash';

const defaultOptions = {
  style: {
    x: 0,
    y: 0,
    font: 'pixelade',
    fontSize: 42
  }
};

export default class MenuItem extends Phaser.Group {

  constructor(game, config) {
    super(game);
    this._config = _.merge({}, defaultOptions, config);
    this.setup();
    this.highlighted = this._config.highlighted || false;
  }

  setup(){
    let {
      x, y, font, fontSize
    } = this._config.style;
    this.label = this.game.add.bitmapText(x, y, font, '    ' + this._config.text,  fontSize);
    this.add(this.label);
    if(this.highlighted){
      this.highlight();
    }
  }

  highlight(){
    this.highlighted = true;
    this.label.setText('+++ ' + this._config.text);
  }

  unhighlight(){
    this.highlighted = false;
    this.label.setText('    ' + this._config.text);
  }

  select(){
    if(this._config.onSelected){
      let onSelectedResult = this._config.onSelected(this);
    }
  }

};

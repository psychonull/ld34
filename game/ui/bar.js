'use strict';

import _ from 'lodash';

const defaultOptions = {
  value: 0,
  width: 300,
  height: 20,
  leftMargin: 0, //space reserved for caption (?)
  innerColor: '#3C3C3C',
  outerColor: '#FFFFFF',
  fullColor: 0x3CAA3C,
  fullThreshold: 0.8
};

export default class Bar extends Phaser.Group {

  constructor(game, config) {
    super(game);
    _.merge(this, _.pick(config, ['x', 'y']));
    this._config = _.merge({}, defaultOptions, config);
    this.value = this._config.value;
    this.setup();
  }

  setup(){
    this.setupOuter();
    this.setupInner();

    this.inner.anchor.setTo(0, 0.5);
    this.outer.anchor.setTo(0, 0.5);
    this.setValue(this.value);
  }

  setupOuter(){
    var outerBmd = this.game.add.bitmapData(this._config.width, this._config.height);
  	outerBmd.ctx.beginPath();
  	outerBmd.ctx.rect(0, 0, this._config.width, this._config.height);
  	outerBmd.ctx.fillStyle = this._config.outerColor;
  	outerBmd.ctx.fill();

    // this._config.height / 2 as y because of offset
    this.outer = this.game.add.sprite(this._config.leftMargin, this._config.height / 2, outerBmd);
    this.add(this.outer);
  }

  setupInner(){
    var innerBmd = this.game.add.bitmapData(this._config.width, this._config.height);
    innerBmd.ctx.beginPath();
  	innerBmd.ctx.rect(0, 0, this._config.width, this._config.height);
  	innerBmd.ctx.fillStyle = this._config.innerColor;
  	innerBmd.ctx.fill();

    this.innerWidth = new Phaser.Rectangle(0, 0, innerBmd.width, innerBmd.height);
    this.totalWidth = innerBmd.width;

    // this._config.height / 2 as y because of offset
    this.inner = this.game.add.sprite(this._config.leftMargin, this._config.height / 2, innerBmd);
    this.inner.cropEnabled = true;
    this.inner.crop(this.innerWidth);
    this.add(this.inner);
  }

  update(){

  }

  setValue(value){
    this.value = this.game.math.clamp(value, 0, 1);
    this.innerWidth.width = this.totalWidth * value;
    this.inner.updateCrop();
    if(this.value >= this._config.fullThreshold){
      this.inner.tint = this._config.fullColor;
    }
    else {
      this.inner.tint = colorFromStringToNumber(this._config.innerColor);
    }
  }

};

var colorFromStringToNumber = function(str){
  return parseInt(str.replace(/#/, ''), 16);
};

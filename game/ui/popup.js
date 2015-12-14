'use strict';

import _ from 'lodash';

const defaultOptions = {
  width: 300,
  height: 200,

  backgroundColor: '#FFFFFF',
  font: 'pixelade',
  fontSize: 24,
  padding: 10,
  textColor: 0x2222A3,

  align: 5
};

export default class Popup extends Phaser.Group {

  constructor(game, config) {
    super(game);
    _.merge(this, _.pick(config, ['x', 'y']));
    this._config = _.merge({}, defaultOptions, config);
    this.setup();
  }

  setup(){
    this.setupBackground();
    this.setupContent();
  }

  setupBackground(){
    var outerBmd = this.game.add.bitmapData(this._config.width, this._config.height);
  	outerBmd.ctx.beginPath();
  	outerBmd.ctx.rect(0, 0, this._config.width, this._config.height);
  	outerBmd.ctx.fillStyle = this._config.backgroundColor;
  	outerBmd.ctx.fill();

    // this._config.height / 2 as y because of offset
    this.background = this.game.add.sprite(0, 0, outerBmd);
    this.add(this.background);
  }

  setupContent(){
    if(typeof this._config.content === 'string'){
      let { font, fontSize, content, padding, textColor } = this._config;
      this.content = this.game.add.bitmapText(padding, padding, font, content, fontSize);
      this.content.maxWidth = this._config.width - padding * 2 - 10;
      this.content.tint = textColor;
    }
    else if (Array.isArray(this._config.content)){
      for(let cont of this._config.content){
        this.content = this.game.add.existing(cont);
      }
    }
    else {
      this.content = this.game.add.existing(this._config.content);
    }
    this.add(this.content);
  }

  update(){

  }



};

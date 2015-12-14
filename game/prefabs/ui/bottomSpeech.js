'use strict';

import _ from 'lodash';
import GenericPopup from './genericPopup';
import SpeechTextChain from '../../ui/speechTextChain';

const defaultOptions = {
  x: 0,
  y: 400,
  width: 800,
  height: 200,
  autoremove: true,
  autostart: true,
  title: '',
  titleStyle: {
    font: 'p2',
    fontSize: 20,
    color: 0xFFFFFF
  },
  textChainOptions: {}
};

export default class BottomSpeech extends Phaser.Group {

  constructor(game, config){
    this._config = _.merge({}, defaultOptions, config);
    super(game);
    this.setup();
  }

  setup(){

    if(this._config.title){
      // this.title = this.game.add.bitmapText();
      this.title = new Phaser.BitmapText(this.game, 10, 10, this._config.titleStyle.font, this._config.title,  this._config.titleStyle.fontSize);
      //this.title.tint = this._config.titleStyle.color;
      this.title.maxWidth = this._config.width - 30;
    }

    this.speech = new SpeechTextChain(this.game, _.merge({
      value: this._config.value,
      signals: {
        skip: this.game.i.B.onDown
      },
      autostart: this._config.autostart,
      fontSize: 30,
      x: 10,
      y: this.title ? this.title.y + this.title.height + 10 : 10,
      maxWidth: this._config.width - 30,
      timeBetweenTexts: 750
    }, this._config.textChainOptions));

    let content = [];
    if(this.title){
      content.push(this.title);
    }
    content.push(this.speech);

    this.frame = new GenericPopup(this.game, {
      x: this._config.x,
      y: this._config.y,
      width: this._config.width,
      height: this._config.height,
      content: content
    });


    this.game.add.existing(this.frame);

    if(this._config.autoremove){
      this.speech.onComplete.addOnce(this.destroy, this);
    }

    this.onComplete = this.speech.onComplete;
  }

  queue(values){
    this.speech.queue(values);
  }

  destroy(){
    this.frame.destroy();
    super.destroy();
  }

}

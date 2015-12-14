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
  autostart: true
};

export default class BottomSpeech extends Phaser.Group {

  constructor(game, config){
    this._config = _.merge({}, defaultOptions, config);
    super(game);
    this.setup();
  }

  setup(){
    this.speech = new SpeechTextChain(this.game, {
      value: this._config.value,
      signals: {
        skip: this.game.i.B.onDown
      },
      autostart: this._config.autostart,
      fontSize: 30,
      x: 10,
      y: 10,
      maxWidth: this._config.width - 30,
      timeBetweenTexts: 750
    });

    this.frame = new GenericPopup(this.game, {
      x: this._config.x,
      y: this._config.y,
      width: this._config.width,
      height: this._config.height,
      content: this.speech
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

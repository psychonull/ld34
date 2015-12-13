'use strict';

import _ from 'lodash';

const defaultOptions = {
  text: '',
  align: 'left',
  fontSize: 20,
  font: 'pixelade',
  autostart: false,
  timeBetweenLetters: 80,
  timeBetweenLettersSkip: 5,
  signals: {
    //skip: thesignalCommand
  }
};

export default class SpeechText extends Phaser.BitmapText {

  constructor(game, config){
    this._config = _.merge({}, defaultOptions, config);
    super(game, this._config.x, this._config.y, this._config.font, '', this._config.fontSize, this._config.align);
    this.setup();
  }

  setup(){
    this.onComplete = new Phaser.Signal();
    this._currentIndex = 0;
    this._timer = null;
    this._completed = false;

    if(this._config.maxWidth){
      this.maxWidth = this._config.maxWidth;
    }
    if(this._config.tint){
      this.tint = this._config.tint;
    }
    if(this._config.autostart){
      this.start();
    }

    if(this._config.signals.skip){
      this._config.signals.skip.add(this.skip, this);
    }

  }

  start(value){
    this._currentIndex = 0;
    if(typeof value !== 'undefined'){
      this._textValue = value;
    }
    if(Array.isArray(value)){
      throw new Error('Arrays not yet supported');
    }
    this._timer = this.game.time.events.repeat(
      this._config.timeBetweenLetters,
      this._textValue.length + 1,
      this._updateTextValue,
      this
    );
  }

  _updateTextValue() {
    if (this._currentIndex < this._textValue.length){
      this.setText(this._textValue.substr(0, this._currentIndex + 1));
      this._currentIndex++;
    }
    else{
      this._removeSignalsHandlers();
      if(!this._completed){
        this.onComplete.dispatch();
        this._completed = true;
      }
    }
  }

  skip(instant){
    this.game.time.events.remove(this._timer);
    if(instant){
      this.setText(this._textValue);
      this._removeSignalsHandlers();
      if(!this._completed){
        this.onComplete.dispatch();
        this._completed = true;
      }
    }
    else{
      this._timer = this.game.time.events.repeat(
        this._config.timeBetweenLettersSkip,
        this._textValue.length + 1 - this._text.length,
        this._updateTextValue,
        this
      );
    }
  }

  destroy(){
    this._removeSignalsHandlers();
    super.destroy();
  }

  _removeSignalsHandlers(){
    if(this._config.signals.skip){
      this._config.signals.skip.remove(this.skip, this);
    }
  }

}

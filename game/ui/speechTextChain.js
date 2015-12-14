'use strict';

import _ from 'lodash';
import SpeechText from './speechText';

const defaultOptions = {
  timeBetweenTexts: 100,
  signals: {
    //skip
  },
  allowSkipToNext: true,
  value: []
};

export default class SpeechTextChain extends SpeechText {

  constructor(game, config){
    this._config = _.merge({}, defaultOptions, config);
    super(game, this._config);
  }

  setup(){
    this._currentIndexArray = 0;
    this._textValue = this._config.value[this._currentIndexArray];
    this._waitingBetweenTexts = false;
    super.setup();
  }

  start(){
    this._currentIndex = 0;
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
      this._waitingBetweenTexts = true;
      this._timerBetweenTexts = this.game.time.events.add(this._config.timeBetweenTexts, this._nextText, this);

    }
  }

  next(){
    this._nextText();
  }

  _nextText() {
    this._waitingBetweenTexts = false;
    this._currentIndexArray++;
    if(this._config.value[this._currentIndexArray]){
      this._textValue = this._config.value[this._currentIndexArray];
      this.start();
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
    if(this._config.allowSkipToNext && this._waitingBetweenTexts){
      this.game.time.events.remove(this._timerBetweenTexts);
      this._nextText();
      return;
    }
    this.game.time.events.remove(this._timer);
    if(instant){
      this.setText(this._textValue);
      this.game.time.events.add(this._config.timeBetweenTexts, this._nextText, this);
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

}

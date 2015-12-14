'use strict';

import _ from 'lodash';
import BottomSpeech from './bottomSpeech';

const defaultOptions = {
  x: 0,
  y: 400,
  width: 800,
  height: 200,
  autoremove: true,
  autostart: false,
  title: '',
  titleStyle: {
    font: 'p2',
    fontSize: 10,
    color: 0xFFFFFF
  }
};

export default class BoxSpeech extends BottomSpeech {

  constructor(game, config){
    this._config = _.merge({}, defaultOptions, config);
    super(game, this._config);
  }

}

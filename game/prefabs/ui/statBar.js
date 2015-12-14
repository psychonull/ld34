'use strict';

import _ from 'lodash';
import Bar from '../../ui/bar';

const defaultOptions = {
  value: 0,
  width: 60,
  height: 10,
  leftMargin: 0, //space reserved for caption (?)
  innerColor: '#3FA501',
  outerColor: '#FFFFFF',
  fullColor: 0xAA02A0,
  fullThreshold: 0.8
};

export default class StatBar extends Bar {

  constructor(game, config) {
    this._config = _.merge({}, defaultOptions, config);
    super(game, this._config);
    //_.merge(this, _.pick(this._config, ['x', 'y']));
  }

};

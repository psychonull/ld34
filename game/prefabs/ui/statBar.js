'use strict';

import _ from 'lodash';
import Bar from '../../ui/bar';

const defaultOptions = {
  value: 0,
  width: 60,
  height: 20,
  leftMargin: 0, //space reserved for caption (?)
  innerColor: '#3C3C3C',
  outerColor: '#FFFFFF',
  fullColor: 0x3CAA3C,
  fullThreshold: 0.8
};

export default class StatBar extends Bar {

  constructor(game, config) {
    _.merge(this, _.pick(config, ['x', 'y']));
    this._config = _.merge({}, defaultOptions, config);
    super(game, config);
  }

};

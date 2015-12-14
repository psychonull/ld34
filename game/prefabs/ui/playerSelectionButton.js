'use strict';

import _ from 'lodash';
import MenuItem from '../../ui/menuItem';
const defaultOptions = {
  style: {
    x: 0,
    y: 20,
    font: 'p2',
    fontSize: 16
  },
  highlighted: false
};

export default class PlayerSelectionButton extends MenuItem {

  constructor(game, config) {
    this._config = _.merge({}, defaultOptions, config);
    super(game, this._config);
    this.y = 50;
  }

};

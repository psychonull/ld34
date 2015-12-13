'use strict';

import Menu from './menu';
import MultiSelectMenuItem from './multiSelectMenuItem';
import _ from 'lodash';

const defaultOptions = {
  menuItemClass: MultiSelectMenuItem,
  options: [], // [{ id: 'start', text: 'START NOW', onSelected: function(){}}]
  itemHeight: 50,
  signals: {}
};

export default class MultiSelectMenu extends Menu {

  constructor(game, config) {
    this._config = _.merge({}, defaultOptions, config);
    super(game, this._config);
  }

  setup(){
    this.signalMap = {
      next: this.highlightNext,
      prev: this.highlightPrev,
      select: this.select,
      check: this.check
    };
    super.setup();
  }

  check(){
    var currentlyHighlighted = _.find(this.menuItems, (mi) => mi.highlighted);
    if(currentlyHighlighted){
      currentlyHighlighted.toggleChecked();
    }
  }


};

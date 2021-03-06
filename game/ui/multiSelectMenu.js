'use strict';

import Menu from './menu';
import MultiSelectMenuItem from './multiSelectMenuItem';
import MenuItem from './menuItem';
import _ from 'lodash';

const defaultOptions = {
  menuItemClass: MultiSelectMenuItem,
  options: [], // [{ id: 'start', text: 'START NOW', onSelected: function(){}}]
  itemHeight: 50,
  itemWidth: 200,
  signals: {},
  buttons: [
    {text: 'OK'},
    {text: 'cancel'}
  ],
  buttonClass: MenuItem,
  x: 0,
  y: 0
};

export default class MultiSelectMenu extends Menu {

  constructor(game, config) {
    this._config = _.merge({}, defaultOptions, config);
    this.onToggleCheck = new Phaser.Signal();
    super(game, this._config);
    // _.merge(this, _.pick(this._config, ['x', 'y']));
    // this.x = this._config.x;
    // this.y = this._config.y;
    // DOES NOT WORK (?)
  }

  setup(){
    this.signalMap = {
      next: this.highlightNext,
      prev: this.highlightPrev,
      check: this.check
    };
    super.setup();
    this.setupButtons();
  }

  setupButtons(){
    let currentOptionIndex = 0;
    let numberOfOptions = this.menuItems.length;
    for(let button of this._config.buttons){
      let menuOption = _.merge({}, button, {
        style: {
          y: numberOfOptions * this._config.itemHeight + this._config.y, //no relative coords in nested groups?
          x: currentOptionIndex * this._config.itemWidth + this._config.x //no relative coords in nested groups?
        }
      });
      let menuItem = new this._config.buttonClass(this.game, menuOption);
      menuItem.isButton = true;
      this.menuItems.push(menuItem);
      //this.game.add.existing(menuItem);
      this.add(menuItem);
      // something else?
      currentOptionIndex++;
    }
  }

  check(){
    var currentlyHighlighted = _.find(this.menuItems, (mi) => mi.highlighted);
    if(currentlyHighlighted){
      if(currentlyHighlighted.isButton){
        currentlyHighlighted.select();
        this.onSelect.dispatch(currentlyHighlighted, _.filter(this.menuItems, (mi) => mi.checked), this);
      }
      else {
        currentlyHighlighted.toggleChecked();
        this.onToggleCheck.dispatch(currentlyHighlighted, _.filter(this.menuItems, (mi) => mi.checked), this);
      }
    }
  }


};

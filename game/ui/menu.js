'use strict';

import MenuItem from './menuItem';
import _ from 'lodash';

const defaultOptions = {
  menuItemClass: MenuItem,
  options: [], // [{ id: 'start', text: 'START NOW', onSelected: function(){}}]
  itemHeight: 50,
  signals: {},
  x: 0,
  y: 0
};

export default class Menu extends Phaser.Group {

  constructor(game, config) {
    super(game);
    this._config = _.merge({}, defaultOptions, config);
    this.menuItems = [];
    this.signalMap = {
      next: this.highlightNext,
      prev: this.highlightPrev,
      select: this.select
    };
    this.onSelect = new Phaser.Signal();
    this.setup();
  }

  setup(){
    this.fixedToCamera = true;
    var currentOptionIndex = 0;
    for(let option of this._config.options){
      let menuOption = _.merge({}, option, {
        style: {
          y: currentOptionIndex * this._config.itemHeight + this._config.y,
          x: this._config.x
        }
      });
      let menuItem = new this._config.menuItemClass(this.game, menuOption);
      this.menuItems.push(menuItem);
      this.game.add.existing(menuItem);
      this.add(menuItem);
      // something else?
      currentOptionIndex++;
    }

    if(this.menuItems.length && !_.any(this.menuItems, (mi) => mi.highlighted)){
      this.menuItems[0].highlight();
    }

    this.setupSignals();
  }

  setupSignals(){
    if(!this._config.signals.select){
      window.console.warn('No select signal passed to menu');
    }
    for (let signal of Object.keys(this._config.signals)){
      if(this.signalMap[signal]){
        this._config.signals[signal].add(this.signalMap[signal], this);
      }
      else {
        window.console.warn('Unknown menu signal: ' + signal);
      }
    }

  }

  removeSignals(){
    for (let signal of Object.keys(this._config.signals)){
      if(this.signalMap[signal]){
        this._config.signals[signal].remove(this.signalMap[signal], this);
      }
    }
  }

  highlight(index){
    this.unhighlightCurrent();
    if(this.menuItems[index]){
      this.menuItems[index].highlight();
    }
  }

  highlightNext(){
    var index = this.getHighlightedIndex();
    this.unhighlightCurrent();
    if(this.menuItems[index + 1]){
      this.menuItems[index + 1].highlight();
    }
    else {
      this.menuItems[0].highlight();
    }
  }

  highlightPrev(){
    var index = this.getHighlightedIndex();
    this.unhighlightCurrent();
    if(index === 0){
      this.menuItems[this.menuItems.length - 1].highlight();
    }
    else {
      this.menuItems[index - 1].highlight();
    }
  }

  unhighlightCurrent() {
    var currentlyHighlighted = _.find(this.menuItems, (mi) => mi.highlighted);
    if(currentlyHighlighted){
      currentlyHighlighted.unhighlight();
    }
  }

  getHighlightedIndex(){
    var currentlyHighlightedIndex = _.findIndex(this.menuItems, (mi) => mi.highlighted);
    if (currentlyHighlightedIndex === -1){ //defensive programming (?)
      return 0;
    }
    return currentlyHighlightedIndex;
  }

  select(){
    var currentlyHighlighted = _.find(this.menuItems, (mi) => mi.highlighted);
    if(currentlyHighlighted){
      currentlyHighlighted.select();
      this.onSelect.dispatch(currentlyHighlighted, this);
    }
  }

  destroy(){
    this.removeSignals();
    super.destroy();
  }


};

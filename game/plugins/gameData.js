'use strict';

import _ from 'lodash';
import config from '../settings.js';

export default class GameData extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);
    this.game = game;
  }

  init(){
    this._data = {};
    this.onChange = new Phaser.Signal();
  }

  set(key, value){
    let oldValue = this._data[key];
    this._data[key] = value;
    this.onChange.dispatch(key, value, oldValue);
  }

  save(){
    // save to localstorage?
  }

  load(){
    // load from localstorage?
  }

  update(){

  }

  destroy(){
    super.destroy();
  }

};

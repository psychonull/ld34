'use strict';

import _ from 'lodash';
import config from '../settings.js';

export default class GameData extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);
    this.game = game;
  }

  init(){
    this._data = {
      stats: {
        played: 0,
        won: 0,
        lost: 0,
        playersLost: 0,
        playersWon: 0
      },
      roster: [],
      team: [] // titulares
    };
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

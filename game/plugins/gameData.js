'use strict';

import _ from 'lodash';
import config from '../settings.js';


const baseData = {
  stats: {
    played: 0,
    won: 0,
    lost: 0,
    playersLost: 0,
    playersWon: 0
  },
  roster: [],
  team: [], // titulares
  founder: null,
  currentLevel: 0,
  nextLevel: 0
};

const baseInternals = {
  firstTimePlayed: true
};

const baseState = {
  hasPlayerToClaim: false,
  recentlyClaimed: [],
  recentlyLost: false
};

export default class GameData extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);
    this.game = game;
  }

  init(){
    this._data = baseData;
    this._internals = this._loadInternals();
    this._state = baseState;
    this.settings = config;
    this.onChange = new Phaser.Signal();
    this.onLoad = new Phaser.Signal();
    this.onSave = new Phaser.Signal();
  }

  get(key){
    return this._data[key];
  }

  set(key, value){
    let oldValue = this._data[key];
    this._data[key] = value;
    this.onChange.dispatch(key, value, oldValue);
  }

  inc(key){
    this.set(key, this._data[key] + 1);
  }

  save(){
    if(!window.localStorage){
      return window.console.warn('No localStorage available');
    }
    Object.keys(this._data).forEach((k) => {
      window.localStorage.setItem(config.localStoragePrefix + '.' + k, JSON.stringify(this._data[k]));
    });
    this._saveInternals();
    this.onSave.dispatch(this._data);
    return this.data;
  }

  _saveInternals(){
    if(!window.localStorage){
      return window.console.warn('No localStorage available');
    }
    window.localStorage.setItem(config.localStoragePrefix + '._internals', JSON.stringify(this._internals));
    return this._internals;
  }

  _loadInternals(){
    if(!window.localStorage){
      return window.console.warn('No localStorage available');
    }
    let item = window.localStorage.getItem(config.localStoragePrefix + '._internals');
    if(item){
      return JSON.parse(item);
    }
    else {
      return baseInternals;
    }
  }

  load(){
    if(!window.localStorage){
      return window.console.warn('No localStorage available');
    }
    Object.keys(this._data).forEach((k) => {
      let item = window.localStorage.getItem(config.localStoragePrefix + '.' + k);
      if(item){
        this._data[k] = JSON.parse(item);
      }
    });
    this.onLoad.dispatch(this._data);
    return this._data;
  }

  clear(){
    if(!window.localStorage){
      return window.console.warn('No localStorage available');
    }
    Object.keys(this._data).forEach((k) => {
      window.localStorage.removeItem(config.localStoragePrefix + '.' + k);
    });
    this.data = baseData;
  }

  selectFounder(player){
    this.set('founder', player);
    this.set('roster', [player]);
    this.set('team', [player]);
  }

  selectNewMember(player){
    var roster = this.get('roster');
    roster.push(player);
    this.set('roster', roster);
    // roster === team because of time :(
    this.set('team', roster);
  }

  destroy(){
    super.destroy();
  }

};

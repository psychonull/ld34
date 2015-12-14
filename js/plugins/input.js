'use strict';

import _ from 'lodash';
import CompositeKey from './input/compositeKey';
import config from '../settings.js';
import AnyKey from './input/anyKey.js';

class Input extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);
    this.game = game;
    this.setupKeys();
  }

  getFromConfig(player, button){
    if(!config.input[player][button]){
      throw new Error(`Missing input config for player ${player} and button ${button}`);
    }
    return _.map(config.input[player][button], (k) => {
      if(typeof k === 'string'){
        return Phaser.Keyboard[k];
      }
      else if(typeof k === 'number'){
        return k;
      }
      else {
        throw new Error(`Cannot accept type ${typeof k} as key`);
      }
    });
  }

  setupKeys(){
    let AKeys = _.map(this.getFromConfig('player1', 'A'), (k) => this.game.input.keyboard.addKey(k));
    let BKeys = _.map(this.getFromConfig('player1', 'B'), (k) => this.game.input.keyboard.addKey(k));

    //  Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture(_.union(this.getFromConfig('player1', 'A'), this.getFromConfig('player1', 'B')));

    this.A = this.game.plugins.add(AnyKey, AKeys, 'A');
    this.B = this.game.plugins.add(AnyKey, BKeys, 'B');
    this.AB = this.game.plugins.add(CompositeKey, [this.A, this.B]);
  }

  update(){

  }

};

module.exports = Input;

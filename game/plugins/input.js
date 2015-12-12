'use strict';

var _ = require('lodash'),
  CompositeKey = require('./input/compositeKey');

import { keys } from '../settings.js';
import AnyKey from './input/anyKey.js';

class Input extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);
    this.game = game;
    this.setupKeys();
  }

  setupKeys(){
    //  Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT ]);

    // this.A = this.game.plugins.add(AnyKey);
    // this.A.init([this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT), this.game.input.keyboard.addKey(Phaser.Keyboard.A)]);
    // this.A = new AnyKey([this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT), this.game.input.keyboard.addKey(Phaser.Keyboard.A)]);
    // this.B = new AnyKey([this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT), this.game.input.keyboard.addKey(Phaser.Keyboard.S)]);
    let AKeys = [this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT), this.game.input.keyboard.addKey(Phaser.Keyboard.A)];
    let BKeys = [this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT), this.game.input.keyboard.addKey(Phaser.Keyboard.S)];

    this.A = this.game.plugins.add(AnyKey, AKeys);
    this.B = this.game.plugins.add(AnyKey, BKeys);
    // this.B = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.AB = this.game.plugins.add(CompositeKey, [this.A, this.B]);
  }

  update(){
    //this.AB.update();
  }

  start(){
    console.log('start');
  }


};

module.exports = Input;

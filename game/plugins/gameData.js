'use strict';

import _ from 'lodash';
import config from '../settings.js';

export default class GameData extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);
    this.game = game;
  }

};

'use strict';

import settings from '../settings';
import _ from 'lodash';

export default class Play {
  create() {
    var game = this.game;
    var ws = settings.worldSize;

    this.startingSetting = _.cloneDeep(settings);

    game.world.setBounds(0, 0, ws.width, ws.height);
    //game.camera.follow(this.player);
  }

  update () {

  }

};

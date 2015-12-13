
'use strict';

import InputPlugin from '../plugins/input.js';

export default class Boot {
  preload() {
    this.load.image('preloader', 'assets/preloader.gif');
  }

  create() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
    this.game.i = this.game.plugins.add(InputPlugin);
  }
};

'use strict';

import settings from '../settings';
import _ from 'lodash';

import Field from '../prefabs/Field';

export default class Play {
  create() {
    var game = this.game;
    //var ws = settings.worldSize;

    this.startingSetting = _.cloneDeep(settings);
    //game.camera.follow(this.player);


    this.createField();

    // For test camera
    this.cursors = game.input.keyboard.createCursorKeys();
  }

  createField() {
    var game = this.game;
    
    this.field = new Field(game, 1);
    game.add.existing(this.field);

    let fieldSize = this.field.totalSize;
    game.world.setBounds(0, 0, fieldSize.width, fieldSize.height);
  }

  update () {
    this.moveCamera();
  }

  moveCamera() {
    if (this.cursors.left.isDown) {
      this.game.camera.x -= 8;
    } else if (this.cursors.right.isDown) {
      this.game.camera.x += 8;
    }

    if (this.cursors.up.isDown) {
      this.game.camera.y -= 8;
    } else if (this.cursors.down.isDown) {
      this.game.camera.y += 8;
    }
  }

};

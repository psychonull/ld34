'use strict';

import settings from '../settings';
import _ from 'lodash';

var Player = require('../prefabs/player');
var Ball = require('../prefabs/ball');

export default class Play {
  create() {
    var game = this.game;
    var ws = settings.worldSize;

    this.startingSetting = _.cloneDeep(settings);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0.8;
    game.physics.p2.gravity.y = settings.gravity;
    this.ball = new Ball(game, 200, 270);
    this.player = new Player(game, 200, 300);


    game.world.setBounds(0, 0, ws.width, ws.height);
    //game.camera.follow(this.player);
    game.add.existing(this.ball);
    game.add.existing(this.player);


    
  }

  update () {

  }

};

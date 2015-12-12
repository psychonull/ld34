'use strict';

var settings = require('../settings');


var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player1', frame);
  game.physics.p2.enable(this);
  //this.body.velocity.x = 0;
  this.body.velocity.y = -200;
  this.scale.x = 0.4;
  this.scale.y = 0.4;
  this.body.kinematic = true;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

module.exports = Player;

'use strict';

var settings = require('../settings');


var Ball = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'ball', frame);
  game.physics.p2.enable(this);
  //this.body.velocity.x = 0;
  //this.body.velocity.x = -1800;
  //this.body.setZeroDamping();
  //this.body.fixedRotation = true;
  //this.body.velocity.y = -200;
  this.body.kinematic = true;
};

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

module.exports = Ball;
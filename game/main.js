'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ld34');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('edition', require('./states/edition'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('instructions', require('./states/instructions'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('win', require('./states/win'));
  

  game.state.start('boot');
};
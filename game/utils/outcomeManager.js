'use strict';

var win = function(game){
  game.gd._state.hasPlayerToClaim = true;
  game.gd._state.recentlyLost = false;
  game.gd.inc('nextLevel');
};

var lose = function(game){
  game.gd._state.hasPlayerToClaim = false;
  game.gd._state.recentlyLost = true;
};

export default {
  win, lose
};

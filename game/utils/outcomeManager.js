'use strict';

var win = function(game){
  console.log(game.teams);
  game.gd._state.hasPlayerToClaim = true;
  game.gd.inc('nextLevel');
};

var lose = function(game){
  game.gd._state.hasPlayerToClaim = false;
  console.log(game.teams);

};

export default {
  win, lose
};

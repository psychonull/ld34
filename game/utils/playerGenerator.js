'use strict';

import _ from 'lodash';
import generateName from './nameGenerator';
import {generate as genId} from 'shortid';

const difficultyConfig = [.3,.3,.5,.7,.7,.8,.9];

var generate = function(maxline, baseline, morale){ // 0 to 1
  let min = baseline || 0;
  let max = maxline || .4;
  var player = {};
  player.fullName = generateName();
  player.morale = morale || _.random(min, max);
  player.speed = _.random(min, max);
  player.shootPower = _.random(min, max);
  player.accuracy = _.random(min, max);
  player.control = _.random(min, max);
  player.id = genId();
  return player;
};

var generateTeam = function(numberOfPlayers, mapIndex){ //difficulty = 0 to 1
  let players = [];
  let difficulty = getDifficultyByIndex(mapIndex);
  for(let i = 0; i < numberOfPlayers; i++){
    players.push(generate(difficulty, Math.max(difficulty - 0.3, 0)));
  }
  return players;
};

var getDifficultyByIndex = function(index){
  return difficultyConfig[index] || .4;
};

export {
  generate,
  generateTeam,
  getDifficultyByIndex
};

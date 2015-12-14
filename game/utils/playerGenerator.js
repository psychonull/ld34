'use strict';

import _ from 'lodash';
import generateName from './nameGenerator';

const attrs = ['morale', 'speed', 'shootPower', 'accuracy', 'control'];

var generate = function(){
  var player = {};
  player.fullName = generateName();
  player.morale = _.random(.5);
  player.speed = _.random(.4);
  player.shootPower = _.random(.5);
  player.accuracy = _.random(.5);
  player.control = _.random(.3);
  return player;
};

export {
  generate
};

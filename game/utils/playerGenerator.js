'use strict';

import _ from 'lodash';
import generateName from './nameGenerator';
import {generate as genId} from 'shortid';

const attrs = ['morale', 'speed', 'shootPower', 'accuracy', 'control'];

var generate = function(){
  var player = {};
  player.fullName = generateName();
  player.morale = _.random(.5);
  player.speed = _.random(.4);
  player.shootPower = _.random(.5);
  player.accuracy = _.random(.5);
  player.control = _.random(.3);
  player.id = genId();
  return player;
};

export {
  generate
};

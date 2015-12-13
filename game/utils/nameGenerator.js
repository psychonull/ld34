'use strict';

import _ from 'lodash';
import { nicknames, names } from './nameGenerator.data.js';

const MIDDLE_CHANCES = .7;
const NICKNAME_CHANCES = .3;

module.exports = function generate(){
  let firstName = atob(_.sample(names)).split(' ')[0];
  let lastName = atob(_.sample(names)).split(' ')[1];
  while(!lastName){
    lastName = atob(_.sample(names)).split(' ')[1];
  }
  let middle = '';

  if(Math.random() < MIDDLE_CHANCES){
    if(Math.random() < NICKNAME_CHANCES){
      middle = '"' + atob(_.sample(nicknames)) + '"';
    }
    else {
      middle = _.sample(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']) + '.'; //lol
    }
  }

  return `${firstName} ${middle} ${lastName}`;
};

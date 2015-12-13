'use strict';

import _ from 'lodash';
import Popup from '../../ui/popup';

const defaultOptions = {
  width: 300,
  height: 200,

  font: 'pixelade',
  fontSize: 24,
  padding: 10,
  textColor: 0xDDDDDD,

  align: 5
};

export default class GenericPopup extends Popup {

  constructor(game, config) {
    super(game,  _.merge({}, defaultOptions, config));
    super.setup();
  }

  setupBackground(){
    var bg = new Phaser.NinePatchImage(this.game, 0, 0, 'popup');
    bg.targetWidth = this._config.width;
    bg.targetHeight = this._config.height;

    this.background = this.game.add.existing(bg);
    this.add(this.background);

    this.add(this.background);
  }

};

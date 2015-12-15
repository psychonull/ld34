'use strict';

import _ from 'lodash';

const defaultOptions = {
  x: 0,
  y: 0,
  titleStyle: {
    color: 0xAA1111,
    font: 'p2',
    fontSize: 12,
    x: 0,
    y: 0
  },
  valueStyle: {
    color: 0xFFFFFF,
    font: 'p2',
    fontSize: 12,
    x: 0,
    y: 0
  },
  value: {
    name: '',
    minPlayers: 0,
    maxPlayers: 0,
    difficulty: 0,
  },
};

export default class NextMatchInfo extends Phaser.Group {

  constructor(game, config) {
    this._config = _.merge({}, defaultOptions, config);
    super(game);
    this.setup();
  }

  setup(){
    this.x = this._config.x;
    this.y = this._config.y;
    this._addLabel('title', _.merge({}, this._config.titleStyle, {
      text: 'NEXT CHALLENGE:',
      fontSize: 18,
      x: 0
    }));

    if(this._config.value.name){
      this._addLabel('title', _.merge({}, this._config.titleStyle, {
        text: 'vs. ' + this._config.value.name,
        fontSize: 18,
        color: 0xFFFFFF,
        x: this.title.x + this.title.width + 10,
        maxWidth: 370
      }));
    }
    else {
      //ADD EXTRA MARGIN TO KEEP IT CENTERED (?)
      this.x += 150;
    }

    const DATA_BASE_Y = 20;
    this._addLabel('DifficultyLbl', _.merge({}, this._config.titleStyle, {
      text: 'Difficulty: ',
      x: 0,
      y: DATA_BASE_Y + 40
    }));
    this._addLabel('DifficultyVal', _.merge({}, this._config.valueStyle,
      this._getDifficultyText(this._config.value.difficulty), {
      x: 175,
      y: DATA_BASE_Y + 40
    }));
    this._addLabel('minPlayersLbl', _.merge({}, this._config.titleStyle, {
      text: 'Min. Players: ',
      x: 0,
      y: DATA_BASE_Y + 60
    }));
    this._addLabel('minPlayersVal', _.merge({}, this._config.valueStyle, {
      text: this._config.value.minPlayers.toFixed(),
      x: 175,
      y: DATA_BASE_Y + 60
    }));
    this._addLabel('maxPlayersLbl', _.merge({}, this._config.titleStyle, {
      text: 'Max. Players: ',
      x: 0,
      y: DATA_BASE_Y + 80
    }));
    this._addLabel('maxPlayersVal', _.merge({}, this._config.valueStyle, {
      text: this._config.value.maxPlayers.toFixed(),
      x: 175,
      y: DATA_BASE_Y + 80
    }));
  }

  _addLabel(name, opts){
    let {x, y, font, text, fontSize, color, maxWidth} = opts;
    this[name] = this.game.add.bitmapText(x, y, font, text, fontSize);
    this[name].tint = color;
    if(maxWidth){
      this[name].maxWidth = maxWidth;
    }
    this.add(this[name]);
  }

  _getDifficultyText(val){
    var text,
      color = 0xFFFFFF;
    if (val >= 0 && val < 0.1){
      text = 'Baby';
    }
    else if (val >= 0.1 && val < 0.25){
      text = 'Piece of cake';
    }
    else if (val >= 0.25 && val < 0.5){
      color = 0xAAAA11;
      text = 'Moderate';
    }
    else if (val >= 0.5 && val < 0.7){
      color = 0xAAAA11;
      text = 'Hard';
    }
    else if (val >= 0.5 && val < 0.7){
      text = _.sample(['Double Hard']);
      color = 0xAA1111;
    }
    else {
      text = _.sample(['Hell', 'Worst nightmare']);
      color = 0xAA1111;
    }
    return { text, color };
  }

  update(){

  }



};

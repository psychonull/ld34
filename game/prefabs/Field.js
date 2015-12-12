'use strict';

const width = 1400;
const hExtender = 275;
const hGoal = 445;

export default class Field extends Phaser.Group {

  constructor(game, extenders) {
    super(game);
    this.totalSize = { width: 0, height: 0 };
    this.createField(extenders);
  }

  createField(extenders) {
    var y=0;

    let addExenders = howMany => {
      for (let i=0;i<howMany;i++){
        this.game.add.tileSprite(0, y, width, hExtender, 'field', 'extender');
        y+=hExtender;
      }
    };

    this.game.add.tileSprite(0, y, width, hGoal, 'field', 'top_goal');
    y+=hGoal;

    addExenders(extenders);

    this.game.add.tileSprite(0, y, width, hExtender, 'field', 'center');
    y+=hExtender;

    addExenders(extenders);

    this.game.add.tileSprite(0, y, width, hGoal, 'field', 'bot_goal');
    y+=hGoal;

    this.totalSize = { width: width, height: y };
  }

};

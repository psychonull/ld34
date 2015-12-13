'use strict';

export default class Field extends Phaser.Group {

  constructor(game, extenders) {
    super(game);

    this.extenders = extenders;

    this.maxWidth = 1400;
    this.hExtender = 275;
    this.hGoal = 445;

    this.totalSize = { width: 0, height: 0 };
    this.createField(extenders);
  }

  createField(extenders) {
    var y=0;

    let addExenders = howMany => {
      for (let i=0;i<howMany;i++){
        this.game.add.tileSprite(0, y, this.maxWidth, this.hExtender, 'field', 'extender');
        y+=this.hExtender;
      }
    };

    this.game.add.tileSprite(0, y, this.maxWidth, this.hGoal, 'field', 'top_goal');
    y+=this.hGoal;

    addExenders(extenders);

    this.game.add.tileSprite(0, y, this.maxWidth, this.hExtender, 'field', 'center');
    y+=this.hExtender;

    addExenders(extenders);

    this.game.add.tileSprite(0, y, this.maxWidth, this.hGoal, 'field', 'bot_goal');
    y+=this.hGoal;

    this.totalSize = { width: this.maxWidth, height: y };
  }

};

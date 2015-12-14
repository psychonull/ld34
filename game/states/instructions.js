
'use strict';

import Popup from '../prefabs/ui/genericPopup';

export default class Instructions {
  preload() {

  }

  create() {
    this.titleText = this.game.add.bitmapText(400, 100, 'p2', 'Instructions!', 42);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.helpText = this.game.add.bitmapText(200, 570, 'pixelade', '<< Z to go back >>', 20);
    this.helpText.anchor.setTo(0.5, 0.5);

    this.instructions = new Popup(this.game, {
      content: `* Z to shoot (hold to charge power)
* X to call a team mate (hold to keep player coming)
* Don't lose the ball.
* Score to win`,
      x: 150,
      y: 200,
      width: 500
    });
    this.game.add.existing(this.instructions);

    this.game.i.A.onDown.addOnce(() => this.game.state.start('menu'));
  }

  update () {

  }

};

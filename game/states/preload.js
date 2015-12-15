
'use strict';

export default class Preload {

  constructor(){
    this.asset = null;
    this.ready = false;
  }

  preload() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.bitmapFont('p2', 'assets/fonts/p2.png', 'assets/fonts/p2.fnt');
    this.load.atlas('field', 'assets/field.png', 'assets/field.json');

    this.load.spritesheet('player_blue', 'assets/sprites_player_blue.png', 25, 39.4, 24);
    this.load.spritesheet('player_red', 'assets/sprites_player_red.png', 25, 39.4, 24);

    this.load.spritesheet('ball', 'assets/ball.png', 45, 45, 8);
    this.load.spritesheet('arrow', 'assets/shoot_arrow.png');

    this.load.spritesheet('title', 'assets/title.png');
    this.load.spritesheet('msg_goal', 'assets/msg_goal.png');
    this.load.spritesheet('msg_loose', 'assets/msg_loose.png');
    this.load.spritesheet('msg_ready', 'assets/msg_ready.png');

    this.load.bitmapFont('pixelade', 'assets/fonts/pixelade.png', 'assets/fonts/pixelade.fnt');

    this.load.image('9patchpopup', 'assets/9-patch-popup.png');
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
  }

  create() {
    this.asset.cropEnabled = false;
    this.game.cache.addNinePatch('popup', '9patchpopup', null, 32, 32, 64, 64);
  }

  update() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  }

  onLoadComplete() {
    this.ready = true;
  }
};

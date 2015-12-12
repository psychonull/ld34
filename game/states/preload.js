
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
    
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
  }

  create() {
    this.asset.cropEnabled = false;
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

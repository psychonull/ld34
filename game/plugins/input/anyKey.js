'use strict';

import _ from 'lodash';


const ON_DOWN_DELAY = 100;

export default class AnyKey extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);

  }

  init(keyList){
    this.keyList = keyList;

    this._signalsInit = false;
    this.onDown = new Phaser.Signal();
    this.onUp = new Phaser.Signal();
    this.isDown = false;

    this.downDuration = function(duration){
      return _.any(this.keyList, (k) => k.downDuration(duration));
    };

    this.stopDownEvent = false; //flag used as delay to check for compositeEvents first

  }

  initSignals(){
    //HACK: why handlers are lost? Enforce not losing them
    if(this.keyList[0].onDown.has(this.singleKeyDown, this)){
      return;
    }
    for (let i=0; i < this.keyList.length; i++){
      this.keyList[i].onDown.add(this.singleKeyDown, this, i);
      this.keyList[i].onUp.add(this.singleKeyUp, this, i);
    }
  }

  singleKeyDown(){
    this.game.time.events.add(ON_DOWN_DELAY, function(){
      if(!this.stopDownEvent){
        this.onDown.dispatch();
      }
      this.stopDownEvent = false;
    }, this);

  }

  singleKeyUp(){
    this.onUp.dispatch();
  }

  update(){
    this.initSignals();
    this.isDown = this._isDown();
  }

  _isDown(){
    return _.any(this.keyList, (k) => k.isDown);
  }

}

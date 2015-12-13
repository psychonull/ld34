'use strict';

import _ from 'lodash';

export default class CompositeKey extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);
  }

  init(keyList){
    if(!keyList || keyList.length === 0){
      throw new Error('keyList is not set');
    }
    this.onDown = new Phaser.Signal();
    this.onUp = new Phaser.Signal();
    this.isDown = false;

    this.keyList = keyList;
    this.downDuration = function(duration){
      return _.reduce(this.keyList, (a,b) => a.downDuration(duration) && b.downDuration(duration));
    };
  }

  initSignals(){
    //HACK: why handlers are lost? Enforce not losing them
    if(this.keyList[0]._rawOnDown.has(this.singleKeyDown, this)){
      return;
    }
    for (let i=0; i < this.keyList.length; i++){
      this.keyList[i]._rawOnDown.add(this.singleKeyDown, this, 0, i);
      this.keyList[i].onUp.add(this.singleKeyUp, this, 0, i);
    }
  }

  singleKeyDown(i){
    //hack: uses _isDown to prevent checking before update run (?)
    if(this._isDown()){
      this.keyList.forEach((k) => {
        k.stopDownEvent = true;
      });
      this.onDown.dispatch();
    }
  }

  singleKeyUp(i){
    //hack: uses _isDown to prevent checking before update run (?)
    // if(!this._isDown()){
    //   this.onUp.dispatch();
    // }
    //TODO: implement onup
  }

  update(){
    this.initSignals();
    this.isDown = this._isDown();
  }

  _isDown(){
    return _.every(this.keyList, (k) => k._isDown ? k._isDown() : k.isDown);
  }

}

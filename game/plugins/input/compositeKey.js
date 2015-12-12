'use strict';

import _ from 'lodash';

export default class CompositeKey extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);
  }

  init(keyList){
    if(!keyList || keyList.length === 0){
      console.warn('keyList is not set');
    }
    this.onDown = new Phaser.Signal();
    this.isDown = false;

    this.keyList = keyList;
    this.downDuration = function(duration){
      return _.reduce(this.keyList, (a,b) => a.downDuration(duration) && b.downDuration(duration));
    };
    // this.initSignals();
  }

  initSignals(){
    //HACK: why handlers are lost? Enforce not losing them
    if(this.keyList[0].onDown.has(this.singleKeyDown, this)){
      return;
    }
    for (let i=0; i < this.keyList.length; i++){
      this.keyList[i].onDown.add(this.singleKeyDown, this, i);
    }
  }

  singleKeyDown(){
    //hack: uses _isDown to prevent checking before update run (?)
    if(this._isDown()){
      this.onDown.dispatch();
    }
  }

  update(){
    this.initSignals();
    this.isDown = this._isDown();
  }

  _isDown(){
    return _.every(this.keyList, (k) => k._isDown ? k._isDown() : k.isDown);
  }

}

'use strict';

import _ from 'lodash';

export default class AnyKey extends Phaser.Plugin {

  constructor(game, parent){
    super(game, parent);

  }

  init(keyList){
    this.keyList = keyList;

    this._signalsInit = false;
    this.onDown = new Phaser.Signal();
    this.isDown = false;

    this.downDuration = function(duration){
      return _.any(this.keyList, (k) => k.downDuration(duration));
    };

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
    this.onDown.dispatch();
  }

  update(){
    this.initSignals();
    this.isDown = this._isDown();
  }

  _isDown(){
    return _.any(this.keyList, (k) => k.isDown);
  }

}

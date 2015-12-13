'use strict';

import settings from '../settings';
import maps from '../maps';
import _ from 'lodash';

import {
  Field,
  Team,
  Player,
  Ball,
  EditionMap
} from '../prefabs';



export default class Play {

  create() {
    let input = document.createElement('TEXTAREA');
    this.teamPos;
    this.playerNbr = 3;
    this.rivalPlayerNbr = 3;
    this.fieldSize = 7;
    let positionY = 30;
    let positionX = 500;
    let rivalPositionY = 100;
    let rivalPositionX = 500;
    let ballPositionX = 500;
    let ballPositionY = 150;
    this.game.currentMapIndex = 0;

    this.game.camera.scale = 1/5;
    input.setAttribute('id', 'json');
    input.setAttribute('name', 'post');
    input.setAttribute('maxlength', 5000);
    input.setAttribute('cols',80);
    input.setAttribute('rows', 40);
    document.getElementsByTagName('body')[0].appendChild(input);
    
    //this.layer1.addChild(this.textPosition);
    this.createField();

    //this.players = [];
    this.players = [];
    this.rivalPlayers = [];
    // For test camera
    this.cursors = this.game.input.keyboard.createCursorKeys();


    for(let i = 0; i < this.playerNbr; i++){
      this.players[i] = this.game.add.sprite(positionX, positionY, 'player_blue');
      this.players[i].inputEnabled = true;
      this.players[i].input.enableDrag();
      this.players[i].events.onDragStart.add(this.onDragStart, this);
      this.players[i].events.onDragStop.add(this.onDragStop, this);
      positionX += 20;
    }

    for(let i = 0; i < this.rivalPlayerNbr; i++){
      this.rivalPlayers[i] = this.game.add.sprite(rivalPositionX, rivalPositionY, 'player_red');
      this.rivalPlayers[i].inputEnabled = true;
      this.rivalPlayers[i].input.enableDrag();
      this.rivalPlayers[i].events.onDragStart.add(this.onDragStart, this);
      this.rivalPlayers[i].events.onDragStop.add(this.onDragStop, this);
      rivalPositionX += 20;
    }

    this.ball = this.game.add.sprite(ballPositionX, ballPositionY, 'ball');
    this.ball.inputEnabled = true;
    this.ball.input.enableDrag();
    this.ball.events.onDragStart.add(this.onDragStart, this);
    this.ball.events.onDragStop.add(this.onDragStop, this);

    this.teamPos = {
      ball: {},
      fieldSize: this.fieldSize,
      teamA: {tshirt: 'blue', players: []},
      teamB: {tshirt: 'red', players: []}
    };
}

  onDragStart(sprite, pointer) {
    this.game.camera.follow(sprite);
    this.result = 'Dragging ' + sprite.key;
}

  onDragStop(sprite, pointer) {
    this.game.camera.unfollow(sprite);
    this.result = sprite.key + ' dropped at x:' + pointer.x + ' y: ' + pointer.y;
  }

  createField() {
    var map = maps[this.game.currentMapIndex];

    this.map = new EditionMap(this.game, {width: 800,height: 600}, this.fieldSize);
    this.game.add.existing(this.map);
  }

  update () {
    this.moveCamera();
  }

  moveCamera() {
    if (this.cursors.left.isDown) {
      this.game.camera.x -= 8;
    } else if (this.cursors.right.isDown) {
      this.game.camera.x += 8;
    }

    if (this.cursors.up.isDown) {
      this.game.camera.y -= 8;
    } else if (this.cursors.down.isDown) {
      this.game.camera.y += 8;
    }
  }

  render(){
    this.game.debug.text(this.result, 10, 20);

    //for(let i = 0; i < this.players.length; i++){
    //  this.teamPos.teamA.players[i] = {pos: {x: this.players[i].position.x, y: this.players[i].position.y}};
    //}

    //for(let i = 0; i < this.rivalPlayers.length; i++){
    //  this.teamPos.teamB.players[i] = {pos: {x: this.rivalPlayers[i].position.x, y: this.rivalPlayers[i].position.y}};
    //}
    //this.teamPos.ball = {pos :{x: this.ball.position.x, y: this.ball.position.y}};
    //this.jsonTeamPos = JSON.stringify(this.teamPos).replace(/"/g, "'");;//.replace(/["']/g, "");
    let element = document.getElementById('json');
    element.innerHTML = this.map.getConvertedPositions(this.teamPos, this.players, this.rivalPlayers, this.ball);
  }

};

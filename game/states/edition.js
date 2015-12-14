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

export default class Edition {

  create() {
    let input = document.createElement('textarea');
    let output = document.createElement('pre');
    let sendOutput = document.createElement('button');
    let selectLevel = document.createElement('select');
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
    output.setAttribute('id', 'output');
    sendOutput.setAttribute('id', 'send-output');
    selectLevel.setAttribute('id', 'select-level');
    sendOutput.innerText = 'Build';

    document.getElementsByTagName('body')[0].appendChild(sendOutput);
    document.getElementsByTagName('body')[0].appendChild(selectLevel);
    document.getElementsByTagName('body')[0].appendChild(output);

    sendOutput.addEventListener('click', ()=> this.buildJSON() );
    selectLevel.addEventListener('blur', ()=> this.readJSON());

    let opt = document.createElement('option');
    opt.value = -1;
    opt.innerHTML = 'Select option';
    selectLevel.appendChild(opt);
    for(let i = 0; i < maps.length; i++){
      let option = document.createElement('option');
      option.value = i;
      option.innerHTML = 'Level ' + (i+1);
      selectLevel.appendChild(option);
    }


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
    this.result = 'Dragging ' + sprite.key;
}

  onDragStop(sprite, pointer) {
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
    //let element = document.getElementById('json');
    //element.innerHTML = this.map.getConvertedPositions(this.teamPos, this.players, this.rivalPlayers, this.ball);
  }

  buildJSON() {
    let output = document.getElementById('output');
    let outputJSON = this.map.getConvertedPositions(this.teamPos, this.players, this.rivalPlayers, this.ball);
    var str = JSON.stringify(outputJSON, undefined, 2);
    output.innerHTML = syntaxHighlight('export default [' + str + '];');

    SelectText('output');
  }

  readJSON(e) {
    let levelId = document.getElementById('select-level').value;
    
    
    if(levelId > -1){
      this.level = maps[levelId];
    }
    let ratio = this.map.getRatio(this.level.fieldSize);

    this.destroySprites();
    this.createPlayers(this.level.teamA.players, this.level.teamA.tshirt, this.players);
    this.createPlayers(this.level.teamB.players, this.level.teamB.tshirt, this.rivalPlayers);

    this.ball = this.game.add.sprite(this.level.ball.pos.x/ratio, this.level.ball.pos.y/ratio, 'ball');
    this.ball.inputEnabled = true;
    this.ball.input.enableDrag();
    this.ball.events.onDragStart.add(this.onDragStart, this);
    this.ball.events.onDragStop.add(this.onDragStop, this);
    console.log('test');
  }

  createPlayers(playersJSON, tshirt, players){
    let ratio = this.map.getRatio(this.level.fieldSize);
    for(let i = 0; i < playersJSON.length; i++){
      let player = playersJSON[i];

      players[i] = this.game.add.sprite(player.pos.x/ratio, player.pos.y/ratio, 'player_' + tshirt);
      players[i].inputEnabled = true;
      players[i].input.enableDrag();
      players[i].events.onDragStart.add(this.onDragStart, this);
      players[i].events.onDragStop.add(this.onDragStop, this);
    }
  }

  destroySprites(){
    this.ball.body = null;
    this.ball.destroy();

    for(let i = 0; i < this.players.length; i++){
      this.players[i].body = null;
      this.players[i].destroy();
    }

    for(let i = 0; i < this.rivalPlayers.length; i++){
      this.rivalPlayers[i].body = null;
      this.rivalPlayers[i].destroy();
    }
  }

};

function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

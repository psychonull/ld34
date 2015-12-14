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
    let playersLbl = document.createElement('span');
    let playersNbr = document.createElement('input');
    let rivalsLbl = document.createElement('span');
    let rivalsNbr = document.createElement('input');
    let sizeLbl = document.createElement('span');
    let sizeNbr = document.createElement('input');
    let buildMap = document.createElement('button');
    let separator = document.createElement('br');
    let input = document.createElement('textarea');
    let output = document.createElement('pre');
    let sendOutput = document.createElement('button');
    let selectLevel = document.createElement('select');

    //this.game.camera.scale = 1/5;
    playersLbl.setAttribute('id', 'playerLbl');
    playersNbr.setAttribute('id', 'playersNbr');
    playersNbr.setAttribute('type', 'number');
    rivalsLbl.setAttribute('id', 'rivalsLbl');
    rivalsNbr.setAttribute('id', 'rivalsNbr');
    rivalsNbr.setAttribute('type', 'number');
    sizeLbl.setAttribute('id', 'sizeLbl');
    sizeNbr.setAttribute('id', 'sizeNbr');
    sizeNbr.setAttribute('type', 'number');
    buildMap.setAttribute('id', 'btnBuild');
    input.setAttribute('id', 'json');
    output.setAttribute('id', 'output');
    sendOutput.setAttribute('id', 'send-output');
    selectLevel.setAttribute('id', 'select-level');
    playersLbl.innerText = 'Cantidad de jugadores: ';
    rivalsLbl.innerText = 'Cantidad de adversarios: ';
    sizeLbl.innerText = 'Size: ';
    sendOutput.innerText = 'Build';
    buildMap.innerText = 'Generate map';

    document.getElementsByTagName('body')[0].appendChild(playersLbl);
    document.getElementsByTagName('body')[0].appendChild(playersNbr);
    document.getElementsByTagName('body')[0].appendChild(rivalsLbl);
    document.getElementsByTagName('body')[0].appendChild(rivalsNbr);
    document.getElementsByTagName('body')[0].appendChild(sizeLbl);
    document.getElementsByTagName('body')[0].appendChild(sizeNbr);
    document.getElementsByTagName('body')[0].appendChild(buildMap);
    document.getElementsByTagName('body')[0].appendChild(separator);
    document.getElementsByTagName('body')[0].appendChild(sendOutput);
    document.getElementsByTagName('body')[0].appendChild(selectLevel);
    document.getElementsByTagName('body')[0].appendChild(output);

    sendOutput.addEventListener('click', ()=> this.buildJSON() );
    buildMap.addEventListener('click', ()=> this.buildInitMap() );
    selectLevel.addEventListener('change', ()=> this.readJSON());

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

}

  onDragStart(sprite, pointer) {
    this.result = 'Dragging ' + sprite.key;
}

  onDragStop(sprite, pointer) {
    this.result = sprite.key + ' dropped at x:' + pointer.x + ' y: ' + pointer.y;
  }

  createField() {
    this.map = new EditionMap(this.game, {width: 800,height: 600}, this.fieldSize);
    this.game.add.existing(this.map);
  }

  update () {
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

    this.destroySprites();
    if(levelId > -1){
      this.level = maps[levelId];
    }
    this.fieldSize = this.level.fieldSize;
    this.teamPos = {
      ball: {},
      fieldSize: this.fieldSize,
      teamA: {tshirt: 'blue', players: []},
      teamB: {tshirt: 'red', players: []}
    };
    this.createField();
    let ratio = this.map.getRatio(this.level.fieldSize);

    this.players = this.createPlayers(this.level.teamA.players, this.level.teamA.tshirt);
    this.rivalPlayers = this.createPlayers(this.level.teamB.players, this.level.teamB.tshirt);

    this.ball = this.game.add.sprite(this.level.ball.pos.x/ratio, this.level.ball.pos.y/ratio, 'ball');
    this.ball.scale.x = 0.3;
    this.ball.scale.y = 0.3;
    this.ball.inputEnabled = true;
    this.ball.input.enableDrag();
    this.ball.events.onDragStart.add(this.onDragStart, this);
    this.ball.events.onDragStop.add(this.onDragStop, this);
    console.log('test');
  }

  createPlayers(playersJSON, tshirt){
    let players = [];
    let ratio = this.map.getRatio(this.level.fieldSize);
    for(let i = 0; i < playersJSON.length; i++){
      let player = playersJSON[i];

      players[i] = this.game.add.sprite(player.pos.x/ratio, player.pos.y/ratio, 'player_' + tshirt);
      players[i].inputEnabled = true;
      players[i].input.enableDrag();
      players[i].events.onDragStart.add(this.onDragStart, this);
      players[i].events.onDragStop.add(this.onDragStop, this);
    }
    return players;
  }

  destroySprites(){
    if(this.ball){
      this.ball.body = null;
      this.ball.destroy();
    }
    if(this.map){
      this.map.destroy();
    }

    let clearList = list => {
      if (!list || !list.length){
        return;
      }

      while(list.length){
        list[0].body = null;
        list[0].destroy();
        list.shift();
      }
    };

    clearList(this.players);
    clearList(this.rivalPlayers);
  }

  buildInitMap(){
    this.teamPos;
    this.playerNbr = document.getElementById('playersNbr').value;
    this.rivalPlayerNbr = document.getElementById('rivalsNbr').value;;
    this.fieldSize = document.getElementById('sizeNbr').value;;
    let positionY = 30;
    let positionX = 500;
    let rivalPositionY = 100;
    let rivalPositionX = 500;
    let ballPositionX = 500;
    let ballPositionY = 150;
    this.game.currentMapIndex = 0;

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
    this.ball.scale.x = 0.3;
    this.ball.scale.y = 0.3;
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

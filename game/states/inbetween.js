'use strict';

import Menu from '../ui/menu';
import Popup from '../prefabs/ui/genericPopup';
import BottomSpeech from '../prefabs/ui/bottomSpeech';
import NextMatchInfo from '../prefabs/ui/nextMatchInfo';
import _ from 'lodash';
import maps from '../maps';
import {getDifficultyByIndex} from '../utils/playerGenerator';

export default class Inbetween {

  create() {

    if(this.game.gd._state.hasPlayerToClaim){
      this.game.state.start('playerSelection');
      return;
    }

    var menu = new Menu(this.game, {
      x: 10,
      y: 10,
      options: [
        {
          id: 'next',
          text: 'Play next match',
          onSelected: () => {
            this.game.state.start('play', true);    
          }
        },
        // {
        //   id: 'roster',
        //   text: 'My roster',
        //   onSelected: () => {
        //     this.game.state.start('instructions');
        //   }
        // },
        // {
        //   id: 'stats',
        //   text: 'Stats',
        //   onSelected: () => {
        //     this.game.state.start('stats');
        //   }
        // },
        {
          id: 'restart',
          text: 'Restart (lose all progress)',
          onSelected: () => {
            this.game.gd.clear();
            window.location.reload();
          }
        }
      ],
      signals: {
        next: this.game.i.B.onDown,
        prev: this.game.i.A.onDown,
        select: this.game.i.AB.onDown
      }
    });

    this.menuFrame = new Popup(this.game, {
      x:150,
      y:325,
      width: 500,
      height: 250,
      content: menu
    });

    this.game.add.existing(this.menuFrame);

    let newsMessages = this._generateMessages();
    if(newsMessages.length){
      this.news = new BottomSpeech(this.game, {
        title: 'News',
        value: [newsMessages.join('\n')],
        y: 0,
        height: 150,
        autoremove: false
      });
      this.game.add.existing(this.news);
    }

    let nextMatch = this._getNextMatchInfo();

    if(nextMatch){
      this.nextMatchInfo = new NextMatchInfo(this.game, {
        value: nextMatch,
        x: 100,
        y: 170
      });
      this.game.add.existing(this.nextMatchInfo);
    }
    else {
      this.game.state.start('win');
    }

  }

  _generateMessages(){
    var messages = this.game.gd._state.recentlyClaimed.map((p) => _.sample([
      p.fullName + ' has joined you!'
    ]));
    if(this.game.gd._state.recentlyLost){
      messages.push('Morale is going down with this lost');
    }
    this.game.gd._state.recentlyClaimed = [];
    return messages;
  }

  _getNextMatchInfo(){
    let mapIndex = this.game.gd.get('nextLevel'),
      map = maps[mapIndex];
    if(!map){
      return null;
    }
    return {
      minPlayers: this.game.gd.get('team').length,
      maxPlayers: map.teamB.players.length,
      difficulty: getDifficultyByIndex(mapIndex)
    };
  }

  update() {

  }

};

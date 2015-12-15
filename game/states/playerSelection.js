'use strict';

import Menu from '../ui/menu';
import PlayerSelectionItem from '../prefabs/ui/playerSelectionItem';
import PlayerSelectionButton from '../prefabs/ui/playerSelectionButton';
import BottomSpeech from '../prefabs/ui/bottomSpeech';
import { generate } from '../utils/playerGenerator';
import _ from 'lodash';

export default class PlayerSelection {

  create() {

    var mainMessages;
    if(this.game.gd.get('nextLevel') === 0){
      mainMessages = ['Choose one volunteer to be the founder of your guild for freedom.'];
    }
    else {
      mainMessages = ['You won one of their players!'];
    }

    this.speech = new BottomSpeech(this.game, {
      value: mainMessages,
      y: 0,
      autoremove: false
    });
    this.game.add.existing(this.speech);

    this._initTitles();
    this.menu = new Menu(this.game, {
      x: 20,
      y: 70,
      options: this._getInitialPlayers(),
      itemHeight: 35,
      menuItemClass: PlayerSelectionItem,
      buttonClass: PlayerSelectionButton,
      signals: {
        next: this.game.i.B.onDown,
        prev: this.game.i.A.onDown,
        select: this.game.i.AB.onDown
      }
    });

    this.menu.onSelect.addOnce((btn) => {
      this._onSelectPlayer(btn._config.player);
      this.menu.destroy();
      this.nameLabel.destroy();
      this.moraleLabel.destroy();
      this.speedLabel.destroy();
      this.shootLabel.destroy();
      this.accLabel.destroy();
      this.controlLabel.destroy();
      this.avgLabel.destroy();
    });

    this.game.add.existing(this.menu);
  }

  _initTitles(){
    const SPACE = 80;
    this.nameLabel = this.game.add.bitmapText(40, 50, 'p2', 'Full Name', 10);
    this.moraleLabel = this.game.add.bitmapText(20 + 300, 50, 'p2', 'Morale', 10);
    this.speedLabel = this.game.add.bitmapText(this.moraleLabel.x + SPACE, 50, 'p2', 'Speed', 10);
    this.shootLabel = this.game.add.bitmapText(this.speedLabel.x + SPACE, 50, 'p2', 'Power', 10);
    this.accLabel = this.game.add.bitmapText(this.shootLabel.x + SPACE, 50, 'p2', 'Accuracy', 9);
    this.controlLabel = this.game.add.bitmapText(this.accLabel.x + SPACE, 50, 'p2', 'Control', 10);
    this.avgLabel = this.game.add.bitmapText(this.controlLabel.x + SPACE, 50, 'p2', 'AVG.', 10);
  }

  update() {

  }

  _onSelectPlayer(player){

    if(this.game.gd.get('nextLevel') === 0){
      this.game.gd.selectFounder(player);
      let newMessage = `Congratulations,
  ${player.fullName} is now the first member of your guild.`;
      let strenght = this._getStrenght(player);
      let strongMessage = `Looks like ${player.fullName.split(' ')[0]} is good with ${strenght}.`;
      this.speech.queue([newMessage, strongMessage, 'Good luck in your journey!']);
      this.speech.speech.onComplete.add(this.passToNextState, this); //fugly HACK
    }
    else {
      this.game.gd.selectNewMember(player);
      this.game.gd._state.recentlyClaimed = [player];
      this.game.gd._state.hasPlayerToClaim = false;
      this.speech.queue([_.sample(['Good choice!', 'Nice!\nThe cult is growing!'])]);
      this.speech.speech.onComplete.add(this.passToNextState, this); //fugly HACK
    }
  }

  _getStrenght(p){
    var max = 0, keyMax = '';
    _.keys(p).forEach((k) => {
      if(typeof p[k] === 'number' && p[k]>max){
        max = p[k];
        keyMax = k;
      }
    });
    return keyMax;
  }

  _getInitialPlayers(){
    const max = 3;
    if(this.game.gd.get('nextLevel') === 0){
      var dummy = [];
      for(let i = 0; i < max; i++){
        dummy.push({
          player: generate()
        });
      }
      return dummy;
    }
    else {
       return this.game.teams.b.roster.map((p) => {
         return { player: p };
       });
    }
  }

  passToNextState(){
    if(this.game.gd.get('nextLevel') === 0){
      this.game.state.start('play');
    }
    else{
      this.game.state.start('inbetween');
    }
  }

  destroy(){
    super.destroy();
  }

};

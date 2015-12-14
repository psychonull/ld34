'use strict';

import BottomSpeech from '../prefabs/ui/boxSpeech';
import _ from 'lodash';

const speechWidth = 350,
  speechHeight = 150;

export default class Intro {

  create() {

    this.opponentSprite = this.game.add.sprite(350, 100, 'player_red');

    this.opponentSprite.animations.add('talking', [22,23,22,23,21]);
    this.opponentSprite.animations.add('idle', [22]);
    this.opponentSprite.animations.play('idle', 1, true);

    this.opponentSprite.scale.set(7,7);

    this._sayYou([
      `hhmmm............\nwhat...\nwhat is this place?`,
      `Who are you?\n..!!!??\n`,
      'What am I doing here?'
    ], () => {
      this._sayOpponent([
        'Looks like we are pretty philosophical today.. uh?'
      ], () => {
        this._sayYou([
          'Come on... \n',
          'I can\'t believe I woke up to this'
        ], ()=>{
          this._sayOpponent([
            'You might be wasting your time here.',
            'You might be saving the world',
            'No one knows. \n EXCEPT FOR ME.',
            'Im the lord and keeper of the absolute knowledge.HA HA HA'
          ], () => {
            this._sayYou([
              'But..\nThat knowledge should be FREE!!'
            ], () => {
              this._sayOpponent([
                'It is free.',
                'As long as you defeat me and my minions.\nMy game, my rules.',
                'SOCCER TIME.\n1- GET A TEAM\n2-GET OVER MY CHALLENGES'
              ], () => {
                this._sayYou([
                  'Let\'s do it. Thruth can\'t wait.'
                ], ()=>{
                  this.passToNextState();
                });
              });
            });
          });
        });
      });
    });

  }

  _sayYou(value, onComplete){
    this.playerSpeech = new BottomSpeech(this.game, {
      title: 'You:',
      value: value,
      y: this.game.height - speechHeight,
      x: this.game.width - speechWidth,
      height: speechHeight,
      width: speechWidth,
      autoremove: true,
      autostart: true
    });
    this.game.add.existing(this.playerSpeech);
    this.playerSpeech.onComplete.addOnce(onComplete, this);
  }

  _sayOpponent(value, onComplete){
    this.opponentSprite.animations.play('talking', 5, true);
    this.opponentSpeech = new BottomSpeech(this.game, {
      title: 'misterious bypasser dressed as soccer player:',
      value: value,
      x: 0,
      y: 0,
      height: speechHeight,
      width: speechWidth,
      autoremove: true,
      autostart: true
    });
    this.game.add.existing(this.opponentSpeech);
    this.opponentSpeech.onComplete.addOnce(onComplete, this);
    this.opponentSpeech.onComplete.addOnce(function(){
      this.opponentSprite.animations.play('idle', 1, true);
    }, this);
  }

  update() {

  }

  passToNextState(){
    this.game.gd._internals.firstTimePlayed = false;
    this.game.gd._saveInternals();
    window.setTimeout(() => this.game.state.start('playerSelection'), 500);
  }

};

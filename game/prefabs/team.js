'use strict';

import Player from './player';

export default class Team extends Phaser.Group {

  constructor(game, map){
    super(game);
    this.mode = map.mode;
    this.tshirt = map.tshirt;
    this.createPlayers(map.players);
  }

  setMode(mode){
    this.mode = mode;
    //TODO: something to do?
  }

  createPlayers(players){
    this.players = [];

    players.forEach( player => {
      let pl = new Player(this.game, player.pos.x, player.pos.y, 'player_' + this.tshirt);
      this.players.push(pl);
    });

    this.players.forEach( pl => this.add(pl));
  }

  update(){

  }

};

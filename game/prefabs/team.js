'use strict';

import Player from './player';

export default class Team extends Phaser.Group {

  constructor(game, map, collisionGroups){
    super(game);

    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.collisionGroups = collisionGroups;

    this.mode = map.mode;
    this.tshirt = map.tshirt;
    this.createPlayers(map.players);
    this.setActivePlayer();
  }

  setMode(mode){
    this.mode = mode;
    //TODO: something to do?
  }

  createPlayers(players){
    this.players = [];
    let plControl = -1;

    players.forEach( (player, i) => {
      let pl = new Player(this.game, player.pos.x, player.pos.y, 'player_' + this.tshirt);
      let cGroups = this.collisionGroups;

      pl.body.setCollisionGroup(cGroups.own);
      pl.body.collides(cGroups.own, this.hitTeamMember, this);
      pl.body.collides(cGroups.opposite, this.hitRival, this);
      pl.body.collides(cGroups.ball, this.hitBall, this);

      this.players.push(pl);

      if (player.control){
        plControl = i;
      }

    });

    this.players.forEach( pl => this.add(pl));

    if (plControl > -1){
      this.setControlling(plControl);
    }
  }

  setControlling(index){
    this.players.forEach( pl => pl.setControlled(false));
    this.players[index].setControlled(true);
    this.activePlayerIndex = index;
  }

  setControlledById(id) {
    this.players.forEach( (pl, i) => {
      if (pl.__id === id){
        this.setControlling(i);
        return false;
      }
    });
  }

  update(){
    this.players.forEach( pl => pl.update() );
    this.setActivePlayer();
  }

  /*
   * Collisions Callbacks
   */

  hitTeamMember(teamPlayerBody, otherTeamPlayer) {
    // teamPlayerBody.sprite > to access the sprite
    //console.log('hitTeamMember!');
  }

  hitRival(teamPlayerBody, rivalBody) {
    //console.log('hitRival!');
  }

  hitBall(teamPlayerBody, ballBody) {
    //console.log('hitBall!');

    let pl = this.activePlayerIndex && this.players[this.activePlayerIndex] || null;

    if (!pl || teamPlayerBody.sprite.__id !== pl.__id){
      this.setControlledById(teamPlayerBody.sprite.__id);
      return;
    }

    teamPlayerBody.sprite.kick();
    ballBody.sprite.forward();
  }

  setActivePlayer(){
    let playersDistance = [this.players.length];
    let minDistance = 10000;
    let minDistancePlayer;
    this.players.forEach( (player, i) => {
      let distanceX = (player.position.x - this.game.ball.position.x) * (player.position.x - this.game.ball.position.x);
      let distanceY = (player.position.y - this.game.ball.position.y) * (player.position.y - this.game.ball.position.y);
      let distanceModule = Math.sqrt(distanceX + distanceY);
      playersDistance[i] = distanceModule;
    });

    for(let i = 0; i < this.players.length; i++){
      if(playersDistance[i] < minDistance){
        minDistance = playersDistance[i];
        minDistancePlayer = i;
      }
    }
    this.players[minDistancePlayer].accelerateToBall();
  }

};

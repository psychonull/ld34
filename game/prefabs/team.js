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
    this.players.forEach( pl => pl.controlling = false);
    this.players[index].controlling = true;
  }

  update(){
    this.players.forEach( pl => pl.update() );
  }

  /*
   * Collisions Callbacks
   */

  hitTeamMember(teamPlayerBody, otherTeamPlayer) {
    // teamPlayerBody.sprite > to access the sprite
    console.log("hitTeamMember!");
  }

  hitRival(teamPlayerBody, rivalBody) {
    console.log("hitRival!");
  }

  hitBall(teamPlayerBody, ballBody) {
    console.log("hitBall!");
  }

};

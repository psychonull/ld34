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
    this.sendAPlayerToBall();

    this.game.i.A.onDown.add(this.onShootDown, this);
    this.game.i.A.onUp.add(this.onShootUp, this);
  }

  onShootDown(){
    let pl = this.getActivePlayer();
    if (pl){
      pl.onShootDown();
    }
  }

  onShootUp(){
    let pl = this.getActivePlayer();
    if (pl){
      pl.onShootUp();
    }
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

  getActivePlayer(){
    let pls = this.players.filter( pl => pl.isControlled());
    return pls.length > 0 && pls[0] || null;
  }

  setControlling(index){
    this.players.forEach( pl => {
      if (pl.isControlled()) {
        pl.setControlled(false);
      }
    });

    this.players[index].setControlled(true);
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
    this.sendAPlayerToBall();
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

    let pl = this.getActivePlayer();

    if (!pl || pl.__id !== teamPlayerBody.sprite.__id){
      this.setControlledById(teamPlayerBody.sprite.__id);
      return;
    }

    teamPlayerBody.sprite.kick();
    ballBody.sprite.forward();
  }

  sendAPlayerToBall(){
    let playersDistance = [this.players.length];
    let minDistance = 10000;
    let minDistancePlayer;

    this.players.forEach( (player, i) => {
      let plDistance = player.getVectorToBall().getMagnitude();

      if (plDistance < minDistance){
        minDistance = plDistance;
        minDistancePlayer = i;
      }
    });

    if (minDistancePlayer) {
      this.players[minDistancePlayer].accelerateToBall();
    }
  }

  destroy(){
    this.game.i.A.onDown.remove(this.onShootDown, this);
    this.game.i.A.onUp.remove(this.onShootUp, this);
    super.destroy();
  }

};

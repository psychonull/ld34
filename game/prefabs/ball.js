'use strict';

import { debug, ball as _ball } from '../settings';

const kickHoldInterval = 500; // ms
const kickShort = 70;

export default class Ball extends Phaser.Sprite {

  constructor(game, x, y, frame) {
    super(game, x, y, 'ball', frame);

    game.physics.p2.enable(this, debug);

    this.body.fixedRotation = true;
    this.body.data.gravityScale = 0;
    this.body.angularVelocity = 0;
    this.body.mass = _ball.mass;
    this.physicShape = this.body.setCircle(10);

    this.body.setCollisionGroup(game.collisionGroups.ball);
    this.body.collides([
      game.collisionGroups.teamA,
      game.collisionGroups.teamB,
      game.collisionGroups.goal
    ]);

    this.anchor.setTo(0.5);
    this.scale.setTo(0.5);

    this.initAnimations();
    this.timer = null;

    this.bounds = this.game.field.getBounds();
  }

  initAnimations(){
    this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7]);
    this.animations.add('idle', [0]);

    this.animations.play('idle', 1, true);
  }

  hasNewPlayer(player){
    this.body.x = player.x;
    this.body.y = player.y-20;
    this.forward();
  }

  forward() {
    if (this.timer){
      this.body.setZeroVelocity();
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.body.moveUp(kickShort);
    this.animations.play('move', 10, true);

    this.timer = setTimeout(() => {
      this.body.setZeroVelocity();
      this.animations.play('idle', 1, true);
    }, kickHoldInterval);
/*
    this.game.time.events.add(kickHoldInterval, () => {
      this.body.setZeroVelocity();
      this.animations.play('idle', 1, true);
    });
*/
  }

  shoot(angle, force) {
    this.body.force.x = Math.cos(this.game.math.degToRad(angle)) * force;
    this.body.force.y = Math.sin(this.game.math.degToRad(angle)) * force;

    this.animations.play('move', 10, true);
  }

  update(){
    let pos = this.position;
    let bounds = this.bounds;

    if (pos.x < bounds.min.x || pos.x > bounds.max.x ||
      pos.y < bounds.min.y || pos.y > bounds.max.y){

      console.log('OUT OF FIELD!!!!!!');
      this.game.state.start('gameover');
    }
  }
};

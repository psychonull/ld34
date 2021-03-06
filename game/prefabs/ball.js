'use strict';

import { debug, ball as _ball } from '../settings';

const kickShort = 20;

export default class Ball extends Phaser.Sprite {

  constructor(game, x, y, frame) {
    super(game, x, y, 'ball', frame);
    this.name = 'ball';

    game.physics.p2.enable(this, debug);

    this.body.damping = 0.8;
    this.body.fixedRotation = true;
    this.body.data.gravityScale = 0;
    this.body.angularVelocity = 0;
    this.body.mass = _ball.mass;
    this.physicShape = this.body.setCircle(8);

    this.body.setCollisionGroup(game.collisionGroups.ball);
    this.body.collides([
      game.collisionGroups.teamA,
      game.collisionGroups.teamB,
      game.collisionGroups.goal
    ]);

    this.anchor.setTo(0.5);
    this.scale.setTo(0.35);

    this.control = kickShort;

    this.initAnimations();
    this.timer = null;

    this.bounds = this.game.field.getBounds();
  }

  initAnimations(){
    this.anim = this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7]);
  }

  hasNewPlayer(player){
    this.body.x = player.x;
    this.body.y = player.y-20;
    this.forward(player.stats.speed);
    this.control = player.stats.control;
  }

  forward(speed, control) {
    if (this.timer){
      this.body.setZeroVelocity();
      clearTimeout(this.timer);
      this.timer = null;
    }

    let ctrl = control || this.control || kickShort;
    this.body.moveUp(speed + ctrl);
  }

  shoot(angle, force) {
    this.body.force.x = Math.cos(this.game.math.degToRad(angle)) * force;
    this.body.force.y = Math.sin(this.game.math.degToRad(angle)) * force;

    let tw = this.game.add.tween(this.scale).to({ x: 0.45, y: 0.45}, 600, Phaser.Easing.Bounce.Out, true);
    tw.yoyo(true, 1);
  }

  update(){
    let pos = this.position;
    let bounds = this.bounds;
    let goalBounds = this.game.goalTop.getBounds();

    if (pos.x > goalBounds.x && pos.x < goalBounds.x + goalBounds.width && pos.y < bounds.min.y){
      // is inside TopGoal so ... GOALL!!!
      this.game.setGameState('goal');
    }
    else if (pos.x < bounds.min.x || pos.x > bounds.max.x ||
      pos.y < bounds.min.y || pos.y > bounds.max.y){
        this.game.setGameState('outside');
    }

    this.updateAnimation();
  }

  updateAnimation(){
    let bVel = this.body.velocity;
    if (bVel.x === 0 && bVel.y === 0) {
      this.anim.stop();
    } else {
      var speed = Math.min(1, Math.max(Math.abs(bVel.x),
                  Math.abs(bVel.y)) / 200) * 9;
      if (this.anim.isPlaying) {
        this.anim.speed = speed;
      } else {
        this.anim.play(speed, true);
      }
    }

  }
};

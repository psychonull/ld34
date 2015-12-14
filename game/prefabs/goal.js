'use strict';

import { debug } from '../settings';

export default class Goal extends Phaser.Group {

  constructor(game, x, y) {
    super(game);

    this.x = x;
    this.y = y;
    this.bounds = { width: 0, height: 0 };
    this.createCollisions();
  }

  createCollisions() {
    let game = this.game;

    let buildSP = (sp, size) => {
      game.physics.p2.enable(sp, debug);

      sp.body.static = true;
      sp.body.fixedRotation = true;
      sp.body.setRectangle(size.w, size.h, 0, 0);
      sp.body.setCollisionGroup(game.collisionGroups.goal);
      sp.anchor.setTo(0.5);
      this.add(sp);
    };

    let iSize = { w: 184, h: 30 };
    let pSize = { w: 5, h: 75 };
    let polePad = { x: 96, y: 15 };

    let w = iSize.w + (pSize.w*2),
      h = iSize.h + (pSize.h*2);

    this.bounds = {
      x: this.x-(w/2),
      y: this.y-(h/2),
      width: w,
      height: h
    };

    let inside = game.add.sprite(this.x, this.y);
    buildSP(inside, iSize);

    inside.body.collides(game.collisionGroups.ball, (goalBody, ballBody) => {
      game.setEndState('goal');
    });

    let leftPole = game.add.sprite(this.x-polePad.x, this.y+polePad.y);
    buildSP(leftPole, pSize);
    leftPole.body.collides(game.collisionGroups.ball);

    let rightPole = game.add.sprite(this.x+polePad.x, this.y+polePad.y);
    buildSP(rightPole, pSize);
    rightPole.body.collides(game.collisionGroups.ball);
  }

  getBounds() {
    return this.bounds;
  }

  update(){

  }

};

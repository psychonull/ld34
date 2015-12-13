'use strict';

import Player from './player';

//const ratio = 3;
const borderSize = 2;

export default class EditionMap extends Phaser.Group {

  constructor(game, camSize, extenders){
    super(game);
    this.setRatio(extenders);

    this.createField(extenders);
    let fieldSize = this.totalSize;

    this.x = 0;//camSize.width - (fieldSize.width/ratio) - borderSize;
    this.y = 0;//camSize.height - (fieldSize.height/ratio) - borderSize;
    this.fixedToCamera = true;

    this.initMap();
    this.game.world.setBounds(0, 0, fieldSize.width/this.ratio, fieldSize.height/this.ratio);
  }

  initMap() {
    //let field = this.game.field;
    this.maxWidth = this.maxWidth/this.ratio;
    const hExtender = this.hExtender/this.ratio;
    const hGoal = this.hGoal/this.ratio;

    let x = this.x;
    let y = this.y;

    let attachSP = (frame, height) => {
      let sp = this.create(x, y, 'field', frame);
      sp.width = this.maxWidth;
      sp.height = height;
    };

    let addExenders = howMany => {
      for (let i=0;i<howMany;i++){
        attachSP('extender', hExtender);
        y+=hExtender;
      }
    };

    attachSP('top_goal', hGoal);
    y+=hGoal;

    addExenders(this.extenders);

    attachSP('center', hExtender);
    y+=hExtender;

    addExenders(this.extenders);

    attachSP('bot_goal', hGoal);
    y+=hGoal;

    this.maxHeight = y-this.y;

    // Draw Border
    let graphics = this.game.add.graphics(x, this.y);
    graphics.boundsPadding = 0;

    graphics.lineStyle(borderSize, 0x000000, 1);
    graphics.drawRect(0, 0, this.maxWidth, this.maxHeight);

    this.add(graphics);

    // Create Graphics positions
    this.grapPositions = this.game.add.graphics(this.x, this.y);
    this.grapPositions.boundsPadding = 0;
    this.add(this.grapPositions);
  }

  createField(extenders) {
    this.extenders = extenders;

    this.maxWidth = 1400;
    this.hExtender = 275;
    this.hGoal = 445;

    this.totalSize = { width: 0, height: 0 };
    var y=0;

    let addExenders = howMany => {
      for (let i=0;i<howMany;i++){
        y+=this.hExtender;
      }
    };
    y+=this.hGoal;

    addExenders(extenders);

    y+=this.hExtender;

    addExenders(extenders);

    y+=this.hGoal;

    this.totalSize = { width: this.maxWidth, height: y };
  }

  update(){
  }

  getConvertedPositions(teamPos, players, rivalPlayers, ball){
    for(let i = 0; i < players.length; i++){
      teamPos.teamA.players[i] = {pos: {x: players[i].position.x * this.ratio, y: players[i].position.y * this.ratio}};
    }

    for(let i = 0; i < rivalPlayers.length; i++){
      teamPos.teamB.players[i] = {pos: {x: rivalPlayers[i].position.x * this.ratio, y: rivalPlayers[i].position.y * this.ratio}};
    }

    teamPos.ball = {pos :{x: ball.position.x * this.ratio, y: ball.position.y * this.ratio}};

    return teamPos;
  }

  setRatio(extenders){
    switch(extenders) {
      case 1:
          this.ratio = 3;
          break;
      case 2:
          this.ratio = 4;
          break;
      case 3:
          this.ratio = 5;
          break;
      case 4:
          this.ratio = 6;
          break;
      case 5:
          this.ratio = 7;
          break;
      default:
          this.ratio = 8;
    }
  }

};

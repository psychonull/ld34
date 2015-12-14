'use strict';

import Player from './player';

const ratio = 10;
const borderSize = 2;

export default class Minimap extends Phaser.Group {

  constructor(game, camSize){
    super(game);

    let fieldSize = game.field.totalSize;

    this.x = camSize.width - (fieldSize.width/ratio) - borderSize;
    this.y = camSize.height - (fieldSize.height/ratio) - borderSize;
    this.fixedToCamera = true;

    this.initMap();
  }

  initMap() {
    let field = this.game.field;
    this.maxWidth = field.maxWidth/ratio;
    const hExtender = field.hExtender/ratio;
    const hGoal = field.hGoal/ratio;

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

    addExenders(field.extenders);

    attachSP('center', hExtender);
    y+=hExtender;

    addExenders(field.extenders);

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

  update(){
    let teams = this.game.teams;
    let field = this.game.field;

    this.grapPositions.clear();

    let setPoints = (color, sprites) => {
      sprites.forEach( sp => {
        let x = (sp.x*100) / field.maxWidth;
        let y = (sp.y*100) / field.totalSize.height;

        x = x * this.maxWidth / 100;
        y = y * this.maxHeight / 100;

        let grp = this.grapPositions;
        if (sp.name === 'ball') {
          grp.lineStyle(borderSize+2, 0x000000, 1);
          grp.drawRect(x, y, 2, 2);
        }
        else if (sp.controlling || sp.calling) {
          grp.lineStyle(borderSize+2, 0x00FF00, 1);
          grp.drawRect(x, y, 2, 2);
        }
        else if (sp.body.velocity.x > 0 || sp.body.velocity.y > 0){
          grp.lineStyle(borderSize+2, 0xFFFFFF, 1);
          grp.drawRect(x, y, 2, 2);
        }

        grp.lineStyle(borderSize, color, 1);
        grp.drawRect(x, y, 2, 2);
      });
    };

    setPoints(0x0000FF/*teams.a.tshirt*/, teams.a.players);
    setPoints(0xFF0000/*teams.b.tshirt*/, teams.b.players);
    setPoints(0x000000, [this.game.ball]);
  }

};

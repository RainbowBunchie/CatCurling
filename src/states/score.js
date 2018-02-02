import game from '../game';
import {textstyleRight}from '../style';
import {textstyleCenter}from '../style';

let back;
let bg;
let level1;
let level2;
let level3;
let level4;
let level5;
let high;

function create(){

  let middleX = game.width/2;
  let middleY =game.height/2;
  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  back = game.add.sprite(middleX, game.height - 100, 'back');
  back.anchor.setTo(0.5);
  back.scale.setTo(0.5);
  back.inputEnabled=true;

  back.events.onInputUp.add(buttonClick);
  back.events.onInputOver.add(buttonHover,this);
  back.events.onInputOut.add(buttonHoverOut,this);

  let h1 = game.add.text(middleX, middleY-game.height/4, 'Here are your scores!', textstyleCenter);
  h1.anchor.setTo(0.5);

  level1=game.add.text(middleX, middleY, 'Level 1: ' + game.global.score1, textstyleRight)

  high = game.add.text(middleX, middleY-game.height/4, 'Here are your scores!', textstyleCenter);
  h1.anchor.setTo(0.5);

  level1=game.add.text(middleX, middleY, 'Level 1: ' + game.global.score1, textstyleRight);
}

function buttonClick(){
  game.state.start('menu');
}

function buttonHover(button){
  button.scale.setTo(0.6);
}

function buttonHoverOut(button){
  button.scale.setTo(0.5);
}

function update(){
  bg.tilePosition.x +=1 ;
  bg.tilePosition.y += 1;
}

export default{
    create,
    update
}

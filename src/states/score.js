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
let score1;
let score2;
let score3;
let score4;
let score5;
let submit;

function create(){

  let middleX = game.width/2;
  let middleY =game.height/2;
  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  back = game.add.sprite(50, game.height-50, 'back');
  back.anchor.setTo(0.5);
  back.scale.setTo(0.5);
  back.inputEnabled=true;

  back.events.onInputUp.add(buttonClick);
  back.events.onInputOver.add(buttonHover2);
  back.events.onInputOut.add(buttonHoverOut2);

  let h1 = game.add.text(middleX, middleY-game.height/4, 'Here are your scores!', textstyleCenter);
  h1.anchor.setTo(0.5);

  submit =  game.add.sprite(800, middleY+game.height/4,'submit');
  submit.scale.setTo(0.4);
  submit.anchor.setTo(0.5);
  submit.inputEnabled=true;
  submit.events.onInputUp.add(function(){
    game.state.start('highscore');
  });
  submit.events.onInputOver.add(buttonHover);
  submit.events.onInputOut.add(buttonHoverOut);
  //---------------LEVEL-----------------------------------


    level1=game.add.text(100, middleY-50, 'Level 1 ', textstyleRight);
    level1.anchor.setTo(0.5);

    score1= game.add.sprite(90, middleY,'scoreholder');
    score1.anchor.setTo(0.5);
    let scoreText1 = game.add.text(110, middleY, '-', textstyleRight);
    scoreText1.anchor.setTo(0.5);

if(game.global.unlock1==true) {
    scoreText1.setText(game.global.score1);
  }

    level2=game.add.text(320, middleY-50, 'Level 2 ', textstyleRight);
    level2.anchor.setTo(0.5);
    score2= game.add.sprite(310, middleY,'scoreholder');
    score2.anchor.setTo(0.5);
    let scoreText2 = game.add.text(330, middleY, '-', textstyleRight);
    scoreText2.anchor.setTo(0.5);

  if(game.global.unlock2==true) {
    scoreText2.setText(game.global.score2);
  }


    level3=game.add.text(middleX, middleY-50, 'Level 3 ', textstyleRight);
    level3.anchor.setTo(0.5);
    score3= game.add.sprite(middleX-10, middleY,'scoreholder');
    score3.anchor.setTo(0.5);
    let scoreText3 = game.add.text(middleX+10, middleY,'-', textstyleRight);
    scoreText3.anchor.setTo(0.5);
  if(game.global.unlock3==true) {
    scoreText3.setText(game.global.score3);
  }


    level4=game.add.text(780, middleY-50, 'Level 4 ', textstyleRight);
    level4.anchor.setTo(0.5);
    score4= game.add.sprite(770, middleY,'scoreholder');
    score4.anchor.setTo(0.5);
    let scoreText4 = game.add.text(790, middleY, '-', textstyleRight);
    scoreText4.anchor.setTo(0.5);
  if(game.global.unlock4==true) {
    scoreText4.setText(game.global.score4);
  }

    level5=game.add.text(game.width-100, middleY-50, 'Level 5 ', textstyleRight);
    level5.anchor.setTo(0.5);
    score5= game.add.sprite(game.width-90, middleY,'scoreholder');
    score5.anchor.setTo(0.5);
    let scoreText5 = game.add.text(game.width-70, middleY, '-', textstyleRight);
    scoreText5.anchor.setTo(0.5);
    if(game.global.unlock5==true) {
    scoreText5.setText(game.global.score5);
  }


//------------------------------LEVEL END--------------------------------------
  high = game.global.score1+game.global.score2+game.global.score3+game.global.score4+game.global.score5;

  let total =game.add.text(middleX-game.width/4, middleY+game.height/4, 'current Highscore: ', textstyleRight);
  total.anchor.setTo(0.5);

  let scoreholder = game.add.sprite(middleX, middleY+game.height/4,'scoreholder');
  scoreholder.anchor.setTo(0.5);

  let scoreText = game.add.text(middleX+20, middleY+game.height/4, high, textstyleRight);
  scoreText.anchor.setTo(0.5);
}

function buttonClick(){
  game.state.start('menu');
}

function buttonHover(){
  submit.scale.setTo(0.5);
}

function buttonHoverOut(){
  submit.scale.setTo(0.4);
}

function buttonHover2(){
  back.scale.setTo(0.6);
}

function buttonHoverOut2(){
  back.scale.setTo(0.5);
}

function update(){
  bg.tilePosition.x +=1 ;
  bg.tilePosition.y += 1;
}

export default{
    create,
    update
}

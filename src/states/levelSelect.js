import game from '../game';
import {textstyleRight}from '../style';
import {textstyleCenter}from '../style';

let back;
let next;
let bg;
let one;
let two;
let three;
let four;
let five;

function create(){

  let middleX = game.width/2;
  let middleY =game.height/2;
  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  let h1 = game.add.text(middleX, middleY-game.height/4, 'Play and win a Level to unlock', textstyleCenter);
  h1.anchor.setTo(0.5);

  back = game.add.sprite(50, game.height-50, 'back');
  back.anchor.setTo(0.5);
  back.scale.setTo(0.5);

  back.inputEnabled=true;

  back.events.onInputUp.add(buttonClick);
  back.events.onInputOver.add(buttonHover,this);
  back.events.onInputOut.add(buttonHoverOut,this);

  one = game.add.sprite(100, middleY, 'Level1-lock');
  one.anchor.setTo(0.5);
  one.scale.setTo(0.5);

  two = game.add.sprite(325, middleY, 'Level2-lock');
  two.anchor.setTo(0.5);
  two.scale.setTo(0.5);

  three = game.add.sprite(middleX, middleY, 'Level3-lock');
  three.anchor.setTo(0.5);
  three.scale.setTo(0.5);

  four = game.add.sprite(775, middleY, 'Level4-lock');
  four.anchor.setTo(0.5);
  four.scale.setTo(0.5);

  five = game.add.sprite(1000, middleY, 'Level5-lock');
  five.anchor.setTo(0.5);
  five.scale.setTo(0.5);

//_________________________LEVEL__________________
if(game.global.unlock1==true) {
  one.destroy();
  one = game.add.sprite(100, middleY, 'Level1');
  one.scale.setTo(0.5);
  one.anchor.setTo(0.5);
    one.inputEnabled=true;
    one.events.onInputUp.add(function(){
      selected(1);
    });
    one.events.onInputOver.add(buttonHover,this);
    one.events.onInputOut.add(buttonHoverOut,this);
}

if(game.global.unlock2==true) {
  two.destroy();
  two = game.add.sprite(325, middleY, 'Level2');
  two.scale.setTo(0.5);
  two.anchor.setTo(0.5);
  two.inputEnabled=true;
  two.events.onInputUp.add(function(){
    selected(2);
  });
  two.events.onInputOver.add(buttonHover,this);
  two.events.onInputOut.add(buttonHoverOut,this);
}

if(game.global.unlock3==true) {
  three.destroy();
  three = game.add.sprite(middleX, middleY, 'Level3');
  three.scale.setTo(0.5);
  three.anchor.setTo(0.5);
  three.inputEnabled=true;
  three.events.onInputUp.add(function(){
    selected(3);
  });
  three.events.onInputOver.add(buttonHover,this);
  three.events.onInputOut.add(buttonHoverOut,this);
}

if(game.global.unlock4==true) {
  four.destroy();
  four = game.add.sprite(775, middleY, 'Level4');
  four.scale.setTo(0.5);
  four.anchor.setTo(0.5);
  four.inputEnabled=true;
  four.events.onInputUp.add(function(){
    selected(4);
  });
  four.events.onInputOver.add(buttonHover,this);
  four.events.onInputOut.add(buttonHoverOut,this);
}

if(game.global.unlock5==true) {
  five.destroy();
  five = game.add.sprite(1000, middleY, 'Level5');
  five.scale.setTo(0.5);
  five.anchor.setTo(0.5);
  five.inputEnabled=true;
  five.events.onInputUp.add(function(){
    selected(5);
  });
  five.events.onInputOver.add(buttonHover,this);
  five.events.onInputOut.add(buttonHoverOut,this);
}
//_________________________LEVEL__________________

}

 function selected(level){
   let s ='level'+level+'';
   console.log(s);
    game.state.start(s);
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

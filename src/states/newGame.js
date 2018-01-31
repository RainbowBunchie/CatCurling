import game from '../game';


let back;
let prev;
let next;
let bg;
let play;
let instructions;
let instructions2;


function create(){

  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  instructions = game.add.sprite(game.width/2, game.height/2, 'in1');
  instructions.anchor.setTo(0.5);
  instructions.scale.setTo(0.5);


  next = game.add.sprite(instructions.x+instructions.width/2, instructions.y, 'next');
  next.anchor.setTo(0.5);
  next.scale.setTo(0.5);
  next.inputEnabled=true;

  next.events.onInputUp.add(nextFrame);
  next.events.onInputOver.add(buttonHover,this);
  next.events.onInputOut.add(buttonHoverOut,this);

  back = game.add.sprite(game.width/6, game.height - 100, 'back');
  back.anchor.setTo(0.5);
  back.scale.setTo(0.5);

  back.inputEnabled=true;

  back.events.onInputUp.add(buttonClick);
  back.events.onInputOver.add(buttonHover,this);
  back.events.onInputOut.add(buttonHoverOut,this);

}

function nextFrame(){
  instructions.alpha=0;
  next.alpha=0;
  instructions2 = game.add.sprite(game.width/2, game.height/2, 'in2');
  instructions2.scale.setTo(0.5);
  instructions2.anchor.setTo(0.5);

  prev = game.add.sprite(instructions.x-instructions.width/2, instructions.y, 'previous');
  prev.anchor.setTo(0.5);
  prev.scale.setTo(0.5);
  prev.inputEnabled=true;

  prev.events.onInputUp.add(previousFrame);
  prev.events.onInputOver.add(buttonHover,this);
  prev.events.onInputOut.add(buttonHoverOut,this);

  play = game.add.sprite(game.width/2, game.height - 100, 'menuPlay');
  play.anchor.setTo(0.5);
  play.scale.setTo(0.5);
  play.inputEnabled=true;

  play.events.onInputUp.add(start);
  play.events.onInputOver.add(buttonHover,this);
  play.events.onInputOut.add(buttonHoverOut,this);
}

function previousFrame(){
  instructions.alpha=1;
  instructions2.alpha=0;
  next.alpha=1;
  prev.alpha=0;
  play.alpha=0;
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

function start(){
  game.state.start('level1');
}

export default{
    create,
    update,
    start
}

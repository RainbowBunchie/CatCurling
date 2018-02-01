import game from '../game';



let back;
let prev;
let next;
let bg;
let play;
let instructions;
let instructions2;
let input;
let textstyleLeft;

function create(){

  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  instructions = game.add.sprite(game.width/2 + 125, game.height/2, 'highscore');
  instructions.anchor.setTo(0.5);
  instructions.scale.setTo(1.2);

  textstyleLeft = {
    padding: 15,
    width: 200,
    font: "30px Stringz",
    borderRadius: 10,
    borderColor: "#f0b46a",
    borderWidth: 3,
    fill: "#ffafd2",
    align: "left",
    boundsAlignH: "left",
    boundsAlignV: "left"
  };

  input = game.add.inputField(game.width/2, game.height/2, textstyleLeft);

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

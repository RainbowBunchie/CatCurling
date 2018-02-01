import game from '../game';
import save_highscore from '../../public/save_highscore';

let bg;
let play;
let highscore;
let input;
let highscoreText;
let inputstyleLeft;
let confirmbutton;
let score;
let name;
let id = 0;

function create(){
  this.game = game;

  score = this.endscore;

  console.log(this.endscore);

  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  highscore = game.add.sprite(game.width/2, game.height/2, 'highscore');
  highscore.anchor.setTo(0.5);
  highscore.scale.setTo(1.2);

  highscoreText = game.add.text(game.width/2, game.height/2-50, "Enter Your Name Here!", {font: "30px Stringz", fill: "#fff" });
  highscoreText.anchor.setTo(0.5);


  inputstyleLeft = {
    padding: 15,
    width: 200,
    font: "30px Stringz",
    borderRadius: 10,
    borderColor: "#f0b46a",
    borderWidth: 3,
    fill: "#ffafd2",
    align: "center",
    boundsAlignH: "center",
    boundsAlignV: "center"
  };

  input = game.add.inputField(game.width/2-120, game.height/2 + 50, inputstyleLeft);

  confirmbutton = game.add.sprite(game.width/2, 2*game.height/3+130, 'confirmbutton');
  confirmbutton.scale.setTo(0.8);
  confirmbutton.anchor.setTo(0.5);

  confirmbutton.events.onInputOver.add(buttonHover,this);
  confirmbutton.events.onInputOut.add(buttonHoverOut,this);
  confirmbutton.inputEnabled = true;
  confirmbutton.input.useHandCursor = true;
  confirmbutton.events.onInputUp.add(function(){
    let name;
    if(input.value != ""){
      name = input.value;
    }
    else{
      name = "Anonymous";
    }
    save_highscore(name, score, id);
    game.state.start('loading');

  });

  function buttonHover(button){
    button.scale.setTo(0.9);
  }

  function buttonHoverOut(button){
    button.scale.setTo(0.8);
  }

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

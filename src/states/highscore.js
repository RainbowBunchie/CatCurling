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
let back;

function create(){



  let score1 = game.global.score1;
  let score2 = game.global.score2;
  let score3 = game.global.score3;
  let score4 = game.global.score4;
  let score5 = game.global.score5;
  console.log(game.global.score1 + " " + game.global.score2 + " " + game.global.score3 + " " + game.global.score4 + " " + game.global.score5)


  score = score1+score2+score3+score4+score5;

  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  highscore = game.add.sprite(game.width/2, game.height/2, 'highscore');
  highscore.anchor.setTo(0.5);
  highscore.scale.setTo(1.2);

  highscoreText = game.add.text(game.width/2, game.height/2-50, "Enter Your Name Here!", {font: "30px Stringz", fill: "#fff" });
  highscoreText.anchor.setTo(0.5);

  back = game.add.sprite(50, game.height-50, 'back');
  back.anchor.setTo(0.5);
  back.scale.setTo(0.5);
  back.inputEnabled=true;

  back.events.onInputUp.add(buttonClick);
  back.events.onInputOver.add(buttonHover,this);
  back.events.onInputOut.add(buttonHoverOut,this);

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
    setTimeout(function(){
      window.location.href = "http://localhost:8080/highscore.html";
    }, 3000);
  });

  function buttonHover(button){
    button.scale.setTo(0.9);g
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

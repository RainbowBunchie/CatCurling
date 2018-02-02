import game from '../game';

let bg;
let score;
let newGame;
let select;
let credits;
let middleX;
let middleY;

function create(){
 console.log('score1: '+game.global.score1);
  middleX = game.width/2;
  middleY =game.height/2;

    bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
    bg.tileScale.y = 0.3;
    bg.tileScale.x = 0.3;

    newGame = game.add.sprite(middleX, middleY + 60, 'menuPlay');
    newGame.scale.setTo(0.5);
    newGame.anchor.setTo(0.5);
    newGame.inputEnabled=true;

    newGame.events.onInputUp.add(buttonClick);
    newGame.events.onInputOver.add(buttonHover,this);
    newGame.events.onInputOut.add(buttonHoverOut,this);

    select = game.add.sprite(middleX, middleY+145, 'menuLevel');
    select.scale.setTo(0.5);
    select.anchor.setTo(0.5);
    select.inputEnabled=true;

    select.events.onInputUp.add(buttonClick);
    select.events.onInputOver.add(buttonHover,this);
    select.events.onInputOut.add(buttonHoverOut,this);

    credits = game.add.sprite(middleX, middleY+230, 'menuCredits');
    credits.scale.setTo(0.5);
    credits.anchor.setTo(0.5);
    credits.inputEnabled=true;

    credits.events.onInputUp.add(buttonClick);
    credits.events.onInputOver.add(buttonHover,this);
    credits.events.onInputOut.add(buttonHoverOut,this);

    score = game.add.sprite(middleX+200, middleY+145, 'highscorebutton');
    score.scale.setTo(0.5);
    score.anchor.setTo(0.5);
    score.inputEnabled=true;

    score.events.onInputUp.add(buttonClick);
    score.events.onInputOver.add(buttonHover,this);
    score.events.onInputOut.add(buttonHoverOut,this);

    let logo = game.add.image(middleX ,middleY -150, 'logo');
    logo.anchor.setTo(0.5);

    //let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //space.onDown.addOnce(this.start,this);
}

function buttonHover(button){
  button.scale.setTo(0.6);
}

function buttonHoverOut(button){
  button.scale.setTo(0.5);
}

function buttonClick(button){
  switch(button) {
    case newGame:
        game.state.start('newGame');
        break;
    case select:
        game.state.start('levelSelect');
        break;
    case credits:
      game.state.start('credits');
    break;
    case score:
      game.state.start('score');
    break;
    default:
        let error = game.add.text(middleX,middleY, 'ERROR!!!!!', {fill: '#FFF'});
  }
}
function update(){
    //bg.image.y += 2;
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

import game from '../game';

let bg;
let settings;
let newGame;
let select;
let credits;
let middleX;
let middleY;

function create(){
  let highscore=game.global.score+game.global.score2;
  console.log('global score: '+highscore);
  middleX = game.width/2;
  middleY =game.height/2;

    bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
    bg.tileScale.y = 0.3;
    bg.tileScale.x = 0.3;

    newGame = game.add.sprite(middleX, middleY + 40, 'menuPlay');
    newGame.scale.setTo(0.5);
    newGame.anchor.setTo(0.5);
    newGame.inputEnabled=true;

    newGame.events.onInputUp.add(buttonClick);
    newGame.events.onInputOver.add(buttonHover,this);
    newGame.events.onInputOut.add(buttonHoverOut,this);

    select = game.add.sprite(middleX, middleY+115, 'menuLevel');
    select.scale.setTo(0.5);
    select.anchor.setTo(0.5);
    select.inputEnabled=true;

    select.events.onInputUp.add(buttonClick);
    select.events.onInputOver.add(buttonHover,this);
    select.events.onInputOut.add(buttonHoverOut,this);

    credits = game.add.sprite(middleX, middleY+190, 'menuCredits');
    credits.scale.setTo(0.5);
    credits.anchor.setTo(0.5);
    credits.inputEnabled=true;

    credits.events.onInputUp.add(buttonClick);
    credits.events.onInputOver.add(buttonHover,this);
    credits.events.onInputOut.add(buttonHoverOut,this);

    settings = game.add.sprite(middleX, middleY +265, 'menuSetting');
    settings.scale.setTo(0.5);
    settings.anchor.setTo(0.5);
    settings.inputEnabled=true;

    settings.events.onInputUp.add(buttonClick);
    settings.events.onInputOver.add(buttonHover,this);
    settings.events.onInputOut.add(buttonHoverOut,this);

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
    case settings:
      game.state.start('menuSettings');
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

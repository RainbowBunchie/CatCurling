import game from '../game';

let bg;
let button;
function create(){
    bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
    bg.tileScale.y = 0.3;
    bg.tileScale.x = 0.3;
    button = game.add.sprite(game.width/2, game.height/1.5, 'playbutton');
    button.scale.setTo(0.5);
    button.anchor.setTo(0.5);
    button.inputEnabled=true;
    button.events.onInputUp.add(buttonClick);
    button.events.onInputOver.add(buttonHover);
    button.events.onInputOut.add(buttonHoverOut);
    //button.input.useHandCursor = true;

    let logo = game.add.image(game.width/2 ,game.height/4 , 'logo');
    logo.anchor.setTo(0.5);

    //let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //space.onDown.addOnce(this.start,this);
}

function buttonHover(){
  button.scale.setTo(0.7);
}

function buttonHoverOut(){
  button.scale.setTo(0.5);
}

function buttonClick(){
  let pText = game.add.text(game.width/2 ,game.height/2+20 , "button works", { fill: '#ffffff' });
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

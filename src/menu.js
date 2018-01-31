import game from '../game';

let bg;
function create(){
    console.log('menu wurde gestartet');
    //game.state.start('score');
    bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
    bg.tileScale.y = 0.3;
    bg.tileScale.x = 0.3;
    let logo = game.add.image(game.width/2 ,game.height/4 , 'logo');
    logo.anchor.setTo(0.5);
    let text = game.add.text(game.width/2 ,game.height/2+20 , "press space to start", { fill: '#ffffff' });
    text.anchor.setTo(0.5);
    let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.addOnce(this.start,this);
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

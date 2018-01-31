import game from '../game';

function preload(){
  console.log('booting...');
  game.load.image('bg', 'assets/img/BG.png');
  game.load.image('rahmen', 'assets/img/rahmen.png');
  game.load.image('bar','assets/img/bar.png');
  game.load.image('logo','assets/img/logo.png');
}

function create(){
  let bg;
  let logo = game.add.image(game.width/2 ,game.height/4 , 'logo');
  logo.anchor.setTo(0.5);
  bg  =game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.state.start('loading');
}
export default{
    preload,
    create
}

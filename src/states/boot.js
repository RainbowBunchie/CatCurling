import game from '../game';

function preload(){
  console.log('booting...');
  game.load.image('bg', 'assets/img/BG.png');
  game.load.image('rahmen', 'assets/img/rahmen.png');
  game.load.image('bar','assets/img/bar.png');
  game.load.image('logo','assets/img/logo.png');
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.state.start('loading');
}
export default{
    preload,
    create
}

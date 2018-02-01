import game from '../game';

let bg;

function preload(){
  bg = game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;
  let logo = game.add.image(game.width/2 ,game.height/4 , 'logo');
  logo.anchor.setTo(0.5);

  let progress= game.load.progress;
  let loadingLabel = game.add.text(80,150,'loading...',{font: '30px Courier', fill: '#fff'});
  game.load.image('player', 'assets/sprites/kitty.png');
  game.load.image('couch-long', 'assets/img/furniture/couch-1.png');
  game.load.image('couch-short', 'assets/img/furniture/couch-2.png');
  game.load.image('tv-table', 'assets/img/furniture/tv-table.png');
  game.load.image('table', 'assets/img/furniture/table.png' );
  game.load.image('chairs', 'assets/img/furniture/chairs-table.png');
  game.load.image('plant', 'assets/img/furniture/plant.png');
  game.load.image('goal', 'assets/img/furniture/goal.png');
  game.load.image('desk', 'assets/img/furniture/desk.png');
  game.load.image('deskchair', 'assets/img/furniture/desk-chair.png');
  game.load.image('arrow', 'assets/sprites/arrow-top.png');
  game.load.image('analog', 'assets/sprites/arrow-bottom.png');
  game.load.image('coffeetable', 'assets/img/furniture/coffee-table.svg');
  game.load.image('scoreholder', 'assets/img/gui/score-holder.svg');
  game.load.image('levelholder', 'assets/img/gui/level-holder.svg');
  game.load.image('settingsbutton', 'assets/img/gui/settings-button.svg');
  game.load.image('pausebutton', 'assets/img/gui/pause-button.svg');
  game.load.image('dust', 'assets/sprites/dust.png');
  game.load.image('menu', 'assets/img/gui/menu.png');
  game.load.image('playbutton', 'assets/img/gui/playbutton.png');
  game.load.image('transparent', 'assets/img/gui/transparency.png');
  game.load.image('homebutton', 'assets/img/gui/homebutton.png');
  game.load.image('restartbutton', 'assets/img/gui/restartbutton.png');
  game.load.image('raisebutton', 'assets/img/gui/raisebutton.png');
  game.load.image('lowerbutton', 'assets/img/gui/lowerbutton.png');
  game.load.image('muteonbutton', 'assets/img/gui/mute.png');
  game.load.image('muteoffbutton', 'assets/img/gui/nomute.png');
  game.load.image('shotsholder', 'assets/img/gui/shotsholder.png');
  game.load.image('shot', 'assets/img/gui/shot.png');
  game.load.image('highscore', 'assets/img/highscore.png');

  game.add.plugin(Fabrique.Plugins.InputField);

  game.load.audio('background-music', ['assets/audio/background.mp3', 'assets/audio/background.ogg']);
  game.load.audio('collect', 'assets/audio/collect.ogg');
  game.load.audio('bump', 'assets/audio/bump.ogg');

  game.load.image('menuPlay', 'assets/buttons/playbutton.png');
  game.load.image('menuSetting', 'assets/buttons/settings2.png');
  game.load.image('menuLevel', 'assets/buttons/levelsbutton.png');
  game.load.image('menuCredits', 'assets/buttons/credits.png');
  game.load.image('back', 'assets/buttons/back.png');

  game.load.image('in1', 'assets/instructions/instructions-1.png');
  game.load.image('in2', 'assets/instructions/instructions-2.png');
  game.load.image('next', 'assets/instructions/next-button.png');
  game.load.image('previous', 'assets/instructions/back-button.png');

  let intID;
  game.load.onLoadStart.add(function() {
      intID = setInterval(update, 5);
  })
  game.load.onLoadComplete.add(function() {
      clearInterval(intID);
      game.state.start('menu');
  })
}

function create(){
}

function update(){

    let text = game.add.text(game.width/2, game.height/2+40, "progress: "+ game.load.progress, { fill: '#ffffff' });
    text.anchor.setTo(0.5);
    bg.tilePosition.x +=1 ;
    bg.tilePosition.y += 1;
    console.log(game.load.progress);
}

export default{
    preload,
    create,
    update
}

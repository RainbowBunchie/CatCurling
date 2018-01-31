import game from './game';

let dusts;
let shots;
let furniture;
let player;
let cursors;
let arrow;
let catchFlag = false;
let launchVelocity = 0;
let analog;
let score = 0;
let scoretext;
let leveltext;
let Xvector;
let Yvector;
let goalInner;

function create(){
  analog = game.add.sprite(gameFunctions.player,gameFunctions.player,'analog');
  analog.width = 8;

  //analog.rotation = 220;
  analog.alpha = 0;
  analog.anchor.setTo(0.5, 1);
  analog.scale.setTo(0.5)

  arrow = game.add.sprite(player,player,'arrow');
  arrow.anchor.setTo(0.5,0);
  arrow.alpha = 0;
  arrow.scale.setTo(0.5);

  player = game.add.sprite(850, 550, 'player');
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.anchor.set(0.5);

  player.body.collideWorldBounds = true;
  player.body.bounce.set(0.9);
  player.scale.setTo(0.5,0.5);
  player.body.drag.set(20,20);


//Enable input
  player.inputEnabled=true;
  player.input.start(0, true);
  player.events.onInputDown.add(gameFunctions.set);
  player.events.onInputUp.add(gameFunctions.launch);
  //game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

  let scoregroup = game.add.group();
  scoregroup.x = game.width-165;

  const scoreholder = game.add.sprite(0, 0,'scoreholder');
  scoreholder.name = 'goal';
  game.physics.enable(scoreholder, Phaser.Physics.ARCADE);
  scoreholder.body.collideWorldBounds = true;
  scoreholder.body.immovable = true;
  scoreholder.scale.setTo(1, 1);
  scoregroup.add(scoreholder);

  scoretext = game.add.text(0, 0, score, textstyleRight);
  scoretext.setTextBounds(35, 13, 100, 10);
  scoregroup.add(scoretext);
  scoregroup.y = 10;

  let settingsbutton = game.add.sprite(10, 10,'settingsbutton');
  settingsbutton.scale.setTo(1,1);

  // PAUSING THE GAME

  let pausebutton = game.add.sprite(20 + settingsbutton.width, 10,'pausebutton');

  pausebutton.inputEnabled = true;

  pausebutton.events.onInputUp.add(function(){
      game.paused = true;
  });

}

function handlePause(){
  game.paused= true; //if player clicks outside game and game pauses automatically

  transparent = game.add.sprite(0,0, 'transparent');

  menu = game.add.sprite(game.width/2,game.height/2,'menu');
  menu.scale.setTo(0.9,0.9);
  menu.anchor.setTo(0.5, 0.5);

  pausetext = game.add.text(game.width/2, 115, `GAME PAUSED`, textstyleCenter);
  pausetext.anchor.setTo(0.5,1);


  playbutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 + 30,'playbutton');
  playbutton.scale.setTo(0.5,0.5);
  playbutton.anchor.setTo(0.5,1);

  //playbutton.inputEnabled = true;

  pausescore = game.add.sprite(game.width/2,game.height/2 + 60, 'scoreholder');
  pausescore.anchor.setTo(0.5,0.5);
  pausescore.scale.setTo(1.2,1.2);

  scorepause = game.add.text(0,0,score.toString(), textstyleRight);
  scorepause.setTextBounds(game.width/2-75, game.height/2 + 40, 144, 10);

  leveltextpause = game.add.text(0, 0, 'Level ' + level, {
          font: "5em Stringz",
          fill: "#fff",
          align: "center",
          boundsAlignH: "center",
          boundsAlignV: "center"
        });
  leveltextpause.setTextBounds(game.width/2-72, game.height/2-70, 150, 10);

}

function unpause(){
  if (game.paused == true){
    scorepause.destroy();
    leveltextpause.destroy();
    pausescore.destroy();
    transparent.destroy();
    menu.destroy();
    pausetext.destroy();
    playbutton.destroy();
    game.paused = false;
  }
}

function set(player,pointer) {
if(player.body.velocity.x === 0 && player.body.velocity.y === 0){
    catchFlag = true;
    game.camera.follow(null);

    player.body.moves = false;
    player.body.velocity.setTo(0, 0);
    arrow.reset(player.x, player.y);
    analog.reset(player.x, player.y);
}


}

function launch() {

  if(player.body.velocity.x === 0 && player.body.velocity.y === 0){
    catchFlag = false;
    player.body.moves = true;
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
    shots -=1;
    arrow.alpha = 0;
    analog.alpha = 0;

    Xvector = (arrow.x - player.x) * 3;
    Yvector = (arrow.y - player.y) * 3;

    player.body.velocity.setTo(Xvector, Yvector);
  }
}


function calcOverlap(obj1,obj2){
  let dx = obj1.x-obj2.x;
  let dy = obj1.y-obj2.y;
  let result = Math.sqrt((Math.pow(dx,2)+Math.pow(dy,2)));
  return result;
}

function gameOver() {
  player.kill();
  let textstyleCenter = {
          font: "2.8em Stringz",
          fill: "#fff",
          align: "center",
          boundsAlignH: "center",
          boundsAlignV: "center"
        };
  let over = game.add.text(game.width * 0.5, game.height * 0.5, "Game over", textstyleCenter);
 restart();
}

function restart(){
  player.resetPosition();
}


function collisionHandler (obj1, obj2) {

  if((player.body.velocity.x == 0 ) && (player.body.velocity.y == 0) ){

    if(obj2 == goalInner){
      if (calcOverlap(player.body, goalInner.body)<10){
        animateScore(300);

        player.kill();
      }
    }

    else if (obj2 == goal){
      if (calcOverlap(player.body, goal.body)<70){
        animateScore(100);
        player.kill();
      }
    }
  }
}

//triggered when cat overlaps with dust
function collectDust(player, dust){
  dust.kill();
  animateScore(50);
}

function animateScore(amount){
  game.add.tween(scoretext).to({score:score+amount},700,"Linear", true);
  score += amount;

}

export default{
    animateScore,
    collectDust,
    collisionHandler,
    restart,
    gameOver,
    calcOverlap,
    launch,
    set,
    unpause,
    handlePause,
    create
}

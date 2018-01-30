import 'pixi';
import 'p2';
import 'phaser';
import defaults from './config';
import furnitureTpl from './module-assets/furniture';
import pkg from '../package.json';

const config = Object.assign(defaults, {
  state: {
    start,
    loadStart,
    fileComplete,
    loadComplete,
    create,
    preload,
    update,
    render
  }
})

const game = new Phaser.Game(config);

function start() {

      // Splash
    game.load.image('bg','assets/img/BG.png');
    game.load.image('bar','assets/img/rahmen.png');
    game.load.image('progress','assets/img/bar.png');
    game.load.script('logo','assets/img/logo.png');

    game.load.start();
    console.log('start');

}

function loadStart() {
  let BG = game.add.tileSprite(0, 0, 800, 600, 'bg');
	text.setText("Loading ...");
  console.log('loadstart');
}

//	This callback is sent the following parameters:
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {

	text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);

	var newImage = game.add.image(x, y, 'bar');

	newImage.scale.set(0.3);

	x += newImage.width + 20;

	if (x > 700)
	{
		x = 32;
		y += 332;
	}
 console.log('filecomplete');
}

function loadComplete() {

	text.setText("Load Complete");
  console.log('loadcomplete');

}


function preload() {

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
  game.load.image('shotsholder', 'assets/img/gui/shotsholder.png');
  game.load.image('shot', 'assets/img/gui/shot.png');

}

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
let level = 1;
let leveltext;

let Xvector;
let Yvector;
let goal;
let goalInner;

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

   game.load.onLoadStart.add(loadStart, this);
   game.load.onFileComplete.add(fileComplete, this);
   game.load.onLoadComplete.add(loadComplete, this);

  let textstyleRight = {
          font: "2.8em Stringz",
          fill: "#fff",
          align: "right",
          boundsAlignH: "right",
          boundsAlignV: "right"
        };

  let textstyleCenter = {
          font: "2.8em Stringz",
          fill: "#fff",
          align: "center",
          boundsAlignH: "center",
          boundsAlignV: "center"
        };



  shots = 4;

  furniture = game.add.group();

	game.stage.backgroundColor = '#f5cf99';

	let couchLong = furnitureTpl(game,'couch-long',0,0,0.35,0.35);
  furniture.add(couchLong);

  let couchShort = furnitureTpl(game,'couch-short',0,couchLong.height-2,0.35,0.35);
  furniture.add(couchShort);

  let tvTable = furnitureTpl(game,'tv-table',60,game.height,0.35,0.35);
  furniture.add(tvTable);

  let chairs = furnitureTpl(game,'chairs',(game.width/2 - 55),(game.height - 243),0.35,0.35);
  furniture.add(chairs);

  let table = furnitureTpl(game,'table',game.width/2,game.height,0.35,0.35);
  furniture.add(table);

  let plant = furnitureTpl(game,'plant',game.width/5 * 3,10,0.45,0.45);
  furniture.add(plant);

  let deskchair = furnitureTpl(game,'deskchair',game.width-130,game.height/4 + 45,0.45,0.45);
  deskchair.rotation = 0.2;
  furniture.add(deskchair);

  let desk = furnitureTpl(game,'desk',game.width,game.height/4,0.45,0.45);
  furniture.add(desk);

  let coffeetable = furnitureTpl(game,'coffeetable',160,130,0.9,0.9);
  coffeetable.rotation = 0.1;
  furniture.add(coffeetable);

  // GOAL

  goal = game.add.sprite(50, 270,'goal');
  game.physics.enable(goal, Phaser.Physics.ARCADE);
  goal.body.collideWorldBounds = true;
  goal.body.immovable = true;
  goal.scale.setTo(0.6 , 0.6);
  goal.body.setSize(200, 200, 0, 0);

  goalInner = game.add.sprite(50, 270,'goal');
  game.physics.enable(goalInner, Phaser.Physics.ARCADE);
  goalInner.body.collideWorldBounds = true;
  goalInner.body.immovable = true;
  goalInner.scale.setTo(0.6 , 0.6);
  goalInner.body.setSize(20, 20, 90,90);

  //DUSTS

  dusts = game.add.group();
  dusts.enableBody = true;

  let dust = dusts.create(650, 250, 'dust');
  let dust2 = dusts.create(250, 450, 'dust');
  let dust3 = dusts.create(480, 180, 'dust');
  dust.scale.setTo(0.2,0.2);
  dust2.scale.setTo(0.2, 0.2);
  dust3.scale.setTo(0.2,0.2);

  // GAME CHARACTERS:

  analog = game.add.sprite(player,player,'analog');
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
  game.physics.enable([player], Phaser.Physics.ARCADE);
  player.anchor.set(0.5);

	player.body.collideWorldBounds = true;
	player.body.bounce.set(0.9);
  player.scale.setTo(0.5,0.5);
  player.body.drag.set(20,20);


//Enable input
  player.inputEnabled=true;
  player.input.start(0, true);
  player.events.onInputDown.add(set);
  player.events.onInputUp.add(launch);
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

  // GUI ELEMENTS

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
  scoregroup.y = 70;

  // SHOTS

  let shotsGroup = game.add.group();

  let shotsHolder = game.add.sprite(0, 0, 'shotsholder');

  shotsGroup.add(shotsHolder);

  displayShots(shots);

  let shotsText = game.add.text(10,7, "SHOTS", textstyleCenter);
  shotsHolder.scale.setTo(0.73,0.73);

  shotsGroup.add(shotsText);

  shotsGroup.x = game.width -256;
  shotsGroup.y = 12;


  // SETTINGS MENU
  let showSettings = false;

  let homebutton;
  let restartbutton;

  let settingsbutton = game.add.sprite(10, 10,'settingsbutton');
  settingsbutton.scale.setTo(1,1);
  settingsbutton.inputEnabled = true;
  settingsbutton.input.useHandCursor = true;

  settingsbutton.events.onInputUp.add(function(){
    getSettingsMenu();
  });

  //WENN IN SETTINGS GEPAUSED WIRD -> SETTINGS KANN NICHT MEHR GESCHLOSSEN WERDEN?

  function getSettingsMenu(){

    transparent = game.add.sprite(0,0, 'transparent');

    menu = game.add.sprite(game.width/2,game.height/2,'menu');
    menu.scale.setTo(0.9,0.9);
    menu.anchor.setTo(0.5, 0.5);

    menutext = game.add.text(game.width/2, 115, `SETTINGS`, textstyleCenter);
    menutext.anchor.setTo(0.5,1);

    playbutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 + 30,'playbutton');
    playbutton.scale.setTo(0.45,0.45);
    playbutton.anchor.setTo(0.5,1);
    playbutton.inputEnabled = true;
    playbutton.input.useHandCursor = true;
    playbutton.events.onInputUp.add(function(){
      removeSettingsMenu();
    });

    homebutton = game.add.sprite(game.width/2 - playbutton.width - 40,menu.height/2 + game.height/2 + 20,'homebutton');
    homebutton.scale.setTo(0.4,0.4);
    homebutton.anchor.setTo(0.5,1);

    restartbutton = game.add.sprite(game.width/2 + playbutton.width + 40,menu.height/2 + game.height/2 + 20,'restartbutton');
    restartbutton.scale.setTo(0.4, 0.4);
    restartbutton.anchor.setTo(0.5,1);

    showSettings = true;
  }

  //game.input.onDown.add(removeSettingsMenu, self);

  function removeSettingsMenu(){
    if (showSettings == true){
      restartbutton.destroy();
      homebutton.destroy();
      menu.destroy();
      transparent.destroy();
      menutext.destroy();
      playbutton.destroy();
      showSettings = false;
    }
  }


  // PAUSING THE GAME

  let pausebutton = game.add.sprite(20 + settingsbutton.width, 10,'pausebutton');
  pausebutton.inputEnabled = true;
  pausebutton.input.useHandCursor = true;

  pausebutton.events.onInputUp.add(function(){
    console.log("pause");
      game.paused = true;
  });

  game.onPause.add(handlePause);

  let menu;
  let menutext;
  let playbutton;
  let transparent;
  let pausescore;
  let leveltextpause;
  let scorepause;

  function handlePause(){
    game.paused= true; //if player clicks outside game and game pauses automatically

    transparent = game.add.sprite(0,0, 'transparent');

    menu = game.add.sprite(game.width/2,game.height/2,'menu');
    menu.scale.setTo(0.9,0.9);
    menu.anchor.setTo(0.5, 0.5);

    menutext = game.add.text(game.width/2, 115, `GAME PAUSED`, textstyleCenter);
    menutext.anchor.setTo(0.5,1);


    playbutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 + 30,'playbutton');
    playbutton.scale.setTo(0.45,0.45);
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

  game.input.onDown.add(unpause, self);

  function unpause(){
    if (game.paused == true){
      scorepause.destroy();
      leveltextpause.destroy();
      pausescore.destroy();
      transparent.destroy();
      menu.destroy();
      menutext.destroy();
      playbutton.destroy();
      game.paused = false;
    }
  }

  let levelgroup = game.add.group();

  let levelholder = game.add.sprite(0, 0,'levelholder');
  levelholder.anchor.setTo(0.5,0);
  levelgroup.add(levelholder);

  leveltext = game.add.text(0, 7, `Level ${level.toString()}`, textstyleCenter);
  leveltext.anchor.setTo(0.5,0);
  levelgroup.add(leveltext);

  levelgroup.x=game.width/2;
  levelgroup.y = 10;

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
    updateShots();
    arrow.alpha = 0;
    analog.alpha = 0;

    Xvector = (arrow.x - player.x) * 3;
    Yvector = (arrow.y - player.y) * 3;

    player.body.velocity.setTo(Xvector, Yvector);
  }
}

function updateShots(){
  shots-=1;
  reduceShots(shots);
}

let shot;
let shotsleft

function displayShots(shots){
  shotsleft = game.add.group();
  let x = 950;
  while (shots > 0){
    shot = game.add.sprite(x, 22, 'shot');
    shot.scale.setTo(0.75,0.75);
    x += 20;
    shots -= 1;
    shotsleft.add(shot);
  }
}
function reduceShots(shots){
  console.log(shotsleft.length);
  shotsleft.destroy();
  displayShots(shots);
}

function update() {

	arrow.rotation = game.physics.arcade.angleBetween(arrow, player)- 3.14 / 2;

  game.physics.arcade.collide(furniture, player);

    if (catchFlag === true)
    {
        //  Track the ball sprite to the mouse
        arrow.x = game.input.activePointer.worldX;
        arrow.y = game.input.activePointer.worldY;

        arrow.alpha = 1;
        analog.alpha = 1;
        analog.rotation = arrow.rotation;
        analog.height = game.physics.arcade.distanceBetween(arrow, player)-20;
        launchVelocity = analog.height-100;

    }

    if (shots == 0 && (player.body.velocity.x ==0 && player.body.velocity.y ==0)) {gameOver();}
    player.body.velocity.setTo( player.body.velocity.x *0.99, player.body.velocity.y*0.99);

    game.physics.arcade.overlap(player, goalInner, collisionHandler, null, this);
    game.physics.arcade.overlap(player, goal, collisionHandler, null, this);

    // increase Score when cat moves over dust

    game.physics.arcade.overlap(player, dusts, collectDust, null, this);

    scoretext.text=~~scoretext.score;
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
  //player.resetPosition();
}


function collisionHandler (obj1, obj2) {

  if((player.body.velocity.x == 0 ) && (player.body.velocity.y == 0) ){
    if(obj2 == goalInner){
      if (calcOverlap(player.body, goalInner.body)<10){
        animateScore(shots*20);
        animateScore(300);
        player.kill();
      }
    }

    else if (obj2 == goal){
      if (calcOverlap(player.body, goal.body)<70){
        animateScore(shots*20);
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
  console.log("score increased by " + amount);
  game.add.tween(scoretext).to({score:score+amount},700,"Linear", true);
  score += amount;

}

function render() {

/*  game.debug.cameraInfo(game.camera, 32, 64);
  game.debug.spriteCoords(player, 32, 150);
  game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 550, 32, 'rgb(0,255,0)');
  game.debug.bodyInfo(player, 32, 32);
  game.debug.body(player);
  game.debug.body(goal);
  game.debug.body(goalInner);
   game.debug.text("Overlap: inner"+ calcOverlap(player.body, goalInner.body), 250, 250, 'rgb(0,255,0)');
   game.debug.text("Overlap: outer"+ calcOverlap(player.body, goal.body), 250, 290, 'rgb(0,255,0)');*/
  // game.debug.text("Shots left: "+ shots, 250, 350, 'rgb(0,255,0)');

}

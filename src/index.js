import 'pixi';
import 'p2';
import 'phaser';
import defaults from './config';
import furnitureTpl from './module-assets/furniture';
import pkg from '../package.json';

const config = Object.assign(defaults, {
  state: {
    create,
    preload,
    update,
    render
  }
})

const game = new Phaser.Game(config);


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
  game.load.image('dust', 'assets/sprites/dust.png')
}

let dusts;

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



  furniture = game.add.group();

	game.stage.backgroundColor = '#f5cf99';

	let couchLong = furnitureTpl(game,'couch-long',0,0,0.35,0.35);
  furniture.add(couchLong);

  let couchShort = furnitureTpl(game,'couch-short',0,couchLong.height-2,0.35,0.35);
  furniture.add(couchShort);

  let tvTable = furnitureTpl(game,'tv-table',60,game.height,0.35,0.35);
  furniture.add(tvTable);

  // let chairs = furnitureTpl(game,'chairs',(game.width/2 - 55),(game.height - 243),0.35,0.35);
  // furniture.add(chairs);

  // let table = furnitureTpl(game,'table',game.width/2,game.height,0.35,0.35);
  // furniture.add(table);

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
  scoregroup.y = 10;

  let settingsbutton = game.add.sprite(10, 10,'settingsbutton');
  settingsbutton.scale.setTo(1,1);

  let pausebutton = game.add.sprite(20 + settingsbutton.width, 10,'pausebutton');
  pausebutton.inputEnabled = true;
  pausebutton.events.onInputUp.add(function(){
    console.log("aufruf!!");
    if (game.paused === true){
      game.paused = false;
    }
    else{
      game.paused = true;
    }
  });

  game.onPause.add(handlePause);

  function handlePause(){
    console.log("pause");
  }

  /*game.input.onDown.add(unpause, self);
  function unpause(){
    game.paused = false;
  }*/



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

    arrow.alpha = 0;
    analog.alpha = 0;

    Xvector = (arrow.x - player.x) * 3;
    Yvector = (arrow.y - player.y) * 3;

    player.body.velocity.setTo(Xvector, Yvector);
  }
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

    player.body.velocity.setTo( player.body.velocity.x *0.99, player.body.velocity.y*0.99);

    game.physics.arcade.overlap(player, goalInner, collisionHandler, null, this);
    game.physics.arcade.overlap(player, goal, collisionHandler, null, this);

    // increase Score when cat moves over dust

    game.physics.arcade.overlap(player, dusts, collectDust, null, this);

    scoretext.text=~~scoretext.score;
}

function calcOverlap(obj1,obj2){
  let dx = (obj1.x+obj1.width/2)-(obj2.x+obj2.width/2);
  let dy = (obj1.y+obj1.height/2)-(obj2.y+obj2.height/2);
  let result = Math.sqrt((Math.pow(dx,2)+Math.pow(dy,2)));
  return result;
}


function collisionHandler (obj1, obj2) {

  if((player.body.velocity.x == 0 ) && (player.body.velocity.y == 0) ){

    if(obj2 == goalInner){
      if (calcOverlap(player.body, goalInner.body)<15){
        animateScore(300);

        player.kill();
      }
      //else animateScore(100);
    }

    else if (obj2 == goal){
      if (calcOverlap(player.body, goal.body)<66){
        animateScore(100);
        player.kill();
      }
    }
 //scoretext.setText(score.toString());

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

function render() {
  game.debug.text("Drag the sprite and release to launch", 32, 32, 'rgb(0,255,0)');
  game.debug.cameraInfo(game.camera, 32, 64);
  game.debug.spriteCoords(player, 32, 150);
  game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 550, 32, 'rgb(0,255,0)');
  game.debug.bodyInfo(player, 32, 32);
  game.debug.body(player);
  game.debug.body(goal);
  game.debug.body(goalInner);
   game.debug.text("Overlap: inner"+ calcOverlap(player.body, goalInner.body), 250, 250, 'rgb(0,255,0)');
   game.debug.text("Overlap: outer"+ calcOverlap(player.body, goal.body), 250, 290, 'rgb(0,255,0)');
   
}

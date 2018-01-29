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
  game.load.image('arrow', 'assets/sprites/arrow-top.svg');
  game.load.image('analog', 'assets/sprites/arrow-bottom.svg');
  game.load.image('coffeetable', 'assets/img/furniture/coffee-table.svg');
  game.load.image('scoreholder', 'assets/img/gui/score-holder.svg');
  game.load.image('levelholder', 'assets/img/gui/level-holder.svg');
  game.load.image('settingsbutton', 'assets/img/gui/settings-button.svg');
  game.load.image('pausebutton', 'assets/img/gui/pause-button.svg');
}

let furniture;

let player;
let cursors;
let arrow;
let catchFlag = false;
let launchVelocity = 0;
let analog;

let score = 0;
let scoretext;

let Xvector;
let Yvector;
let goal;

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

  let textstyle = {
          font: "3em Stringz",
          fill: "#fff",
          align: "right",
          boundsAlignH: "right",
          boundsAlignV: "right"
        };


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
  goal.name = 'goal';
  game.physics.enable(goal, Phaser.Physics.ARCADE);
  goal.body.collideWorldBounds = true;
  goal.body.immovable = true;
  goal.scale.setTo(0.6 , 0.6);

  goal.body.setSize(100, 100, 50, 50);

  // GUI ELEMENTS

  let scoregroup =  game.add.group();
  scoregroup.x = game.width-165;

  const scoreholder = game.add.sprite(0, 0,'scoreholder');
  scoreholder.name = 'goal';
  game.physics.enable(scoreholder, Phaser.Physics.ARCADE);
  scoreholder.body.collideWorldBounds = true;
  scoreholder.body.immovable = true;
  scoreholder.scale.setTo(1, 1);
  scoregroup.add(scoreholder);

  scoretext = game.add.text(0, 0, score.toString(), textstyle);
  scoretext.setTextBounds(40, 12, 100, 10);
  scoregroup.add(scoretext);

  let settingsbutton = game.add.sprite(10, 10,'settingsbutton');
  settingsbutton.scale.setTo(1,1);

  let pausebutton = game.add.sprite(20 + settingsbutton.width, 10,'pausebutton');

  // GAME CHARACTERS:

  analog = game.add.sprite(player,player,'analog');
  //analog.width=8;
  //analog.rotation = 220;
  analog.alpha = 0;
  analog.anchor.setTo(0.5, 1);
  analog.scale.setTo(0.5)

  arrow = game.add.sprite(player,player,'arrow');
  arrow.anchor.setTo(0.5,1);
  arrow.alpha = 1;
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

}

function set(player,pointer) {

    catchFlag = true;
    game.camera.follow(null);

    player.body.moves = false;
    player.body.velocity.setTo(0, 0);
    arrow.reset(player.x, player.y);
    analog.reset(player.x, player.y);

}

function launch() {

    catchFlag = false;
    player.body.moves = true;
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

    arrow.alpha = 0;
    analog.alpha = 0;

    Xvector = (arrow.x - player.x) * 3;
    Yvector = (arrow.y - player.y) * 3;

    player.body.velocity.setTo(Xvector, Yvector);

}

function update() {

	arrow.rotation = game.physics.arcade.angleBetween(arrow, player);

  game.physics.arcade.collide(furniture, player);

    if (catchFlag === true)
    {
        //  Track the ball sprite to the mouse
        arrow.x = game.input.activePointer.worldX;
        arrow.y = game.input.activePointer.worldY;

        arrow.alpha = 1;
        analog.alpha = 1;
        analog.rotation = arrow.rotation - 3.14 / 2;
        analog.height = game.physics.arcade.distanceBetween(arrow, player);
        launchVelocity = analog.height-100;
    }

    player.body.velocity.setTo( player.body.velocity.x *0.99, player.body.velocity.y*0.99);
    /* WENN SCORE GEÄNDERT WIRD ->
    scoretext.setText(score.toString());
    */
    game.physics.arcade.collide(player, goal, collisionHandler, null, this);

}

function collisionHandler (obj1, obj2) {
  if(player.body.velocity < 10 )
    player.kill();

}

function render() {

	//game.debug.bodyInfo(sprite, 16, 24);
	// game.debug.body(sprite);
	// game.debug.body(player);
  game.debug.text("Drag the sprite and release to launch", 32, 32, 'rgb(0,255,0)');
  game.debug.cameraInfo(game.camera, 32, 64);
  game.debug.spriteCoords(player, 32, 150);
  game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 550, 32, 'rgb(0,255,0)');
  game.debug.bodyInfo(player, 32, 32);
  game.debug.body(player);
  game.debug.body(goal);

}

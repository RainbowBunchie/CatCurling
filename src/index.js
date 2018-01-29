import 'pixi';
import 'p2';
import 'phaser';
import defaults from './config';
import furnitureTpl from './module-assets/furniture';
import pkg from '../package.json';

// This is the entry point of your game.

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

	game.load.image('player', 'assets/kitty.svg');
  game.load.image('couch-long', 'assets/img/furniture/couch-1.png');
  game.load.image('couch-short', 'assets/img/furniture/couch-2.png');
  game.load.image('tv-table', 'assets/img/furniture/tv-table.png');
  game.load.image('table', 'assets/img/furniture/table.png' );
  game.load.image('chairs', 'assets/img/furniture/chairs-table.png');
  game.load.image('plant', 'assets/img/furniture/plant.png');
  game.load.image('goal', 'assets/img/furniture/goal.png');
  game.load.image('desk', 'assets/img/furniture/desk.png');
  game.load.image('deskchair', 'assets/img/furniture/desk-chair.png');
  game.load.image('arrow', 'assets/sprites/arrow.svg');
  game.load.image('analog', 'assets/sprites/arrow.svg');

}

var player;
var cursors;
var arrow;
var catchFlag = false;
var launchVelocity = 0;

var sprite3;
var sprite4;

let analog;
let tvtable;
let table;
let chairs;
let plant;
let goal;
let desk;
let deskchair;
let couchLong;
let furniture;

function create() {

  furniture = game.add.group();

  game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = '#f5cf99';

  
	couchLong = furnitureTpl(game,'couch-long',0,0,0.35,0.35);
  furniture.add(couchLong);

  sprite4 = game.add.sprite(0, couchLong.height-2, 'couch-short');
  sprite4.name = 'couch-short';
  game.physics.enable(sprite4, Phaser.Physics.ARCADE);
  sprite4.body.collideWorldBounds = true;
  sprite4.body.checkCollision.up = true;
  sprite4.body.checkCollision.down = true;
  sprite4.body.immovable = true;
  sprite4.scale.setTo(0.35,0.35);

  furniture.add(sprite4);

  tvtable = game.add.sprite(60,game.height,'tv-table');
  tvtable.name = 'tvtable';
  game.physics.enable(tvtable, Phaser.Physics.ARCADE);
  tvtable.body.collideWorldBounds = true;
  tvtable.body.checkCollision.up = true;
  tvtable.body.checkCollision.down = true;
  tvtable.body.immovable = true;
  tvtable.scale.setTo(0.35,0.35);
  furniture.add(tvtable);


  chairs = game.add.sprite((game.width/2 - 55),(game.height - 243),'chairs');
  chairs.name = 'chairs';
  game.physics.enable(chairs, Phaser.Physics.ARCADE);
  chairs.body.collideWorldBounds = true;
  chairs.body.checkCollision.up = true;
  chairs.body.checkCollision.down = true;
  chairs.body.immovable = true;
  chairs.scale.setTo(0.35,0.35);

  furniture.add(chairs);

  table = game.add.sprite(game.width/2,game.height,'table');
  table.name = 'tvtable';
  game.physics.enable(table, Phaser.Physics.ARCADE);
  table.body.collideWorldBounds = true;
  table.body.checkCollision.up = true;
  table.body.checkCollision.down = true;
  table.body.immovable = true;
  table.scale.setTo(0.35,0.35);

  furniture.add(table);

  plant = game.add.sprite(game.width/5 * 3, 10,'plant');
  plant.name = 'plant';
  game.physics.enable(plant, Phaser.Physics.ARCADE);
  plant.body.collideWorldBounds = true;
  plant.body.checkCollision.up = true;
  plant.body.checkCollision.down = true;
  plant.body.immovable = true;
  plant.scale.setTo(0.45,0.45);

  furniture.add(plant);


  deskchair = game.add.sprite(game.width-130, game.height/4 + 45,'deskchair');
  deskchair.name = 'deskchair';
  game.physics.enable(deskchair, Phaser.Physics.ARCADE);
  deskchair.body.collideWorldBounds = true;
  deskchair.body.checkCollision.up = true;
  deskchair.body.checkCollision.down = true;
  deskchair.body.immovable = true;
  deskchair.scale.setTo(0.45,0.45);
  deskchair.rotation = 0.2;

  furniture.add(deskchair);

  desk = game.add.sprite(game.width, game.height/4,'desk');
  desk.name = 'desk';
  game.physics.enable(desk, Phaser.Physics.ARCADE);
  desk.body.collideWorldBounds = true;
  desk.body.checkCollision.up = true;
  desk.body.checkCollision.down = true;
  desk.body.immovable = true;
  desk.scale.setTo(0.45,0.45);

  furniture.add(desk);

  analog = game.add.sprite(200,450,'analog');
  analog.width=8;
  analog.rotation = 220;
  analog.alpha = 0;
  analog.anchor.setTo(0.5, 0.0);

  arrow = game.add.sprite(200,450,'arrow');
  arrow.anchor.setTo(0.1,0.5);
  arrow.alpha =0;


// GAME CHARACTERS:

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

  // GOAL

  goal = game.add.sprite(50, 270,'goal');
  goal.name = 'goal';
  plant.body.collideWorldBounds = true;
  game.physics.enable(goal, Phaser.Physics.ARCADE);
  goal.body.immovable = true;
  goal.scale.setTo(0.6,0.6);

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

    let Xvector = (arrow.x - player.x) * 3;
    let Yvector = (arrow.y - player.y) * 3;

    player.body.velocity.setTo(Xvector, Yvector);

}

function update() {

	arrow.rotation = game.physics.arcade.angleBetween(arrow, player);
    
    if (catchFlag === true)
    {
        //  Track the ball sprite to the mouse  
        player.x = game.input.activePointer.worldX; 
        player.y = game.input.activePointer.worldY;
        
        arrow.alpha = 1;    
        analog.alpha = 0.5;
        analog.rotation = arrow.rotation - 3.14 / 2;
        analog.height = game.physics.arcade.distanceBetween(arrow, player);    
        launchVelocity = analog.height;
    }

}

function render() {

	//game.debug.bodyInfo(sprite, 16, 24);

	// game.debug.body(sprite);
	// game.debug.body(player);
    game.debug.text("Drag the sprite and release to launch", 32, 32, 'rgb(0,255,0)');
    game.debug.cameraInfo(game.camera, 32, 64);
    game.debug.spriteCoords(player, 32, 150);
    game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 550, 32, 'rgb(0,255,0)');

}

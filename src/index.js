import 'pixi';
import 'p2';
import 'phaser';

import pkg from '../package.json';

// This is the entry point of your game.

const config = {
  width: 1100,
  height: 600,
  renderer: Phaser.AUTO,
  parent: '',
  state: {
    preload,
    create,
    update,
    render
  },
  transparent: false,
  antialias: true,
  physicsConfig: { arcade: true },
};

const game = new Phaser.Game(config);


function preload() {

	game.load.image('atari', 'assets/img/study.png');
  game.load.image('couch-long', 'assets/img/furniture/couch-1.png');
  game.load.image('couch-short', 'assets/img/furniture/couch-2.png');
  game.load.image('tv-table', 'assets/img/furniture/tv-table.png');
  game.load.image('table', 'assets/img/furniture/table.png' );
  game.load.image('chairs', 'assets/img/furniture/chairs-table.png');
  game.load.image('plant', 'assets/img/furniture/plant.png');
  game.load.image('goal', 'assets/img/furniture/goal.png');
  game.load.image('desk', 'assets/img/furniture/desk.png');
  game.load.image('deskchair', 'assets/img/furniture/desk-chair.png');
  game.load.image('coffeetable', 'assets/img/furniture/coffee-table.svg');
  game.load.image('scoreholder', 'assets/img/gui/score-holder.svg');
  game.load.image('levelholder', 'assets/img/gui/level-holder.svg');
  game.load.image('settingsbutton', 'assets/img/gui/settings-button.svg');
  game.load.image('pausebutton', 'assets/img/gui/pause-button.svg');

}

var sprite;
var sprite2;
var sprite3;
var sprite4;

let tvtable;
let table;
let chairs;
let plant;
let goal;
let desk;
let deskchair;
let coffeetable;

let furniture;

function create() {

  furniture = game.add.group();

  game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = '#f5cf99';

	sprite = game.add.sprite(0, 0, 'couch-long');
	sprite.name = 'couch-long';
	game.physics.enable(sprite, Phaser.Physics.ARCADE);
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.up = true;
  sprite.body.checkCollision.right = true;
	sprite.body.checkCollision.down = true;
	sprite.body.immovable = true;
  sprite.scale.setTo(0.35,0.35);

  furniture.add(sprite);

  sprite4 = game.add.sprite(0, sprite.height-2, 'couch-short');
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


  coffeetable = game.add.sprite(160, 130,'coffeetable');
  desk.name = 'coffeetable';
  game.physics.enable(coffeetable, Phaser.Physics.ARCADE);
  coffeetable.body.collideWorldBounds = true;
  coffeetable.body.checkCollision.up = true;
  coffeetable.body.checkCollision.down = true;
  coffeetable.body.immovable = true;
  coffeetable.scale.setTo(0.9 , 0.9);
  coffeetable.rotation = 0.1;


  furniture.add(coffeetable);

  // GOAL

  goal = game.add.sprite(50, 270,'goal');
  goal.name = 'goal';
  plant.body.collideWorldBounds = true;
  game.physics.enable(goal, Phaser.Physics.ARCADE);
  goal.body.immovable = true;
  goal.scale.setTo(0.6,0.6);

  // GUI ELEMENTS


// GAME CHARACTERS:

	sprite2 = game.add.sprite(50, 150, 'atari');
	sprite2.name = 'gameboy';

	game.physics.enable(sprite2, Phaser.Physics.ARCADE);
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);
  sprite2.scale.setTo(0.3,0.3);


	sprite3 = game.add.sprite(500, 160, 'atari');
  sprite3.scale.setTo(0.3,0.3);


	game.physics.enable(sprite3, Phaser.Physics.ARCADE);

	sprite3.name = 'gameboy2';
	sprite3.body.collideWorldBounds = true;
	sprite3.body.bounce.setTo(1, 1);

	sprite2.body.velocity.y = -400;
	sprite3.body.velocity.x = -400;

}

function update() {

	game.physics.arcade.collide(furniture, sprite2);
  game.physics.arcade.collide(furniture, sprite3);

}

function render() {

	//game.debug.bodyInfo(sprite, 16, 24);

	// game.debug.body(sprite);
	// game.debug.body(sprite2);

}

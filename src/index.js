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

}

var sprite;
var sprite2;
var sprite3;
var sprite4;

let tvtable;

let furniture;

function create() {

  furniture = game.add.group();

  game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = '#f5cf99';

	//	In this example the little Gameboy sprite can pass through the top/bottom of the Atari sprite
	//	Because it's set to ignore collisions on its top/bottom faces.

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

  furniture.add(tvtable)


	sprite2 = game.add.sprite(50, 400, 'atari');
	sprite2.name = 'gameboy';

	game.physics.enable(sprite2, Phaser.Physics.ARCADE);
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);
  sprite2.scale.setTo(0.3,0.3);


	sprite3 = game.add.sprite(600, 120, 'atari');
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

	//game.physics.arcade.collide(sprite, sprite3);

}

function render() {

	//game.debug.bodyInfo(sprite, 16, 24);

	// game.debug.body(sprite);
	// game.debug.body(sprite2);

}

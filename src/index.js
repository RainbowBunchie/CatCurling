import 'pixi';
import 'p2';
import 'phaser';

import pkg from '../package.json';

// This is the entry point of your game.

const config = {
  width: 800,
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

	game.load.spritesheet('gameboy', 'assets/img/study.png', 40, 60);
	game.load.image('atari', 'assets/img/study.png');

}

var sprite;
var sprite2;
var sprite3;

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#000';

	//	In this example the little Gameboy sprite can pass through the top/bottom of the Atari sprite
	//	Because it's set to ignore collisions on its top/bottom faces.

	sprite = game.add.sprite(300, 200, 'atari');
	sprite.name = 'atari';
	game.physics.enable(sprite, Phaser.Physics.ARCADE);
	sprite.body.collideWorldBounds = true;
	sprite.body.checkCollision.up = false;
	sprite.body.checkCollision.down = false;
	sprite.body.immovable = true;

	sprite2 = game.add.sprite(350, 400, 'atari');
	sprite2.name = 'gameboy';

	game.physics.enable(sprite2, Phaser.Physics.ARCADE);
	sprite2.body.collideWorldBounds = true;
	sprite2.body.bounce.setTo(1, 1);

	sprite3 = game.add.sprite(0, 210, 'atari');

	game.physics.enable(sprite3, Phaser.Physics.ARCADE);

	sprite3.name = 'gameboy2';
	sprite3.body.collideWorldBounds = true;
	sprite3.body.bounce.setTo(1, 1);

	sprite2.body.velocity.y = -50;
	sprite3.body.velocity.x = 50;

}

function update() {

	game.physics.arcade.collide(sprite, sprite2);
	game.physics.arcade.collide(sprite, sprite3);

}

function render() {

	game.debug.bodyInfo(sprite, 16, 24);

	// game.debug.body(sprite);
	// game.debug.body(sprite2);

}

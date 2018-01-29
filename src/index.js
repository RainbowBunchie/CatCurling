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

	game.load.image('player', 'assets/sprites/kitty.svg');
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
let deskchair;
let coffeetable;

let scoretext;

function create() {

  let textstyle = {
          font: "3em Stringz",
          fill: "#fff",
          align: "right"
        };

  furniture = game.add.group();

  game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = '#f5cf99';


	let couchLong = furnitureTpl(game,'couch-long',0,0,0.35,0.35);
  furniture.add(couchLong);

  let couchShort = furnitureTpl(game,'couch-short',0,couchLong.height-2,0.35,0.35);
  furniture.add(couchShort);

  let tvTable = furnitureTpl(game,'tv-table',60,game.height,0.35,0.35);
  furniture.add(couchShort);

  let chairs = furnitureTpl(game,'chairs',(game.width/2 - 55),(game.height - 243),0.35,0.35);
  furniture.add(chairs);

  let table = furnitureTpl(game,'table',game.width/2,game.height,0.35,0.35);
  furniture.add(table);

  let plant = furnitureTpl(game,'plant',game.width/5 * 3,10,0.45,0.45);
  furniture.add(plant);

  let deskchair = furnitureTpl(game,'deskchair',game.width-130,game.height/4 + 45,0.45,0.45);
  deskchair.rotation = 0.2;
  furniture.add(deskchair);

  let desk = furnitureTpl(game, 'desk', game.width, game.height/4, 0.45, 0.45);
  furniture.add(desk);


  analog = game.add.sprite(200,450,'analog');
  analog.width=8;
  analog.rotation = 220;
  analog.alpha = 0;
  analog.anchor.setTo(0.5, 0.0);

  arrow = game.add.sprite(200,450,'arrow');
  arrow.anchor.setTo(0.1,0.5);
  arrow.alpha =0;

  coffeetable = game.add.sprite(160, 130,'coffeetable');
  coffeetable.name = 'coffeetable';
  game.physics.enable(coffeetable, Phaser.Physics.ARCADE);
  coffeetable.body.collideWorldBounds = true;
  coffeetable.body.checkCollision.up = true;
  coffeetable.body.checkCollision.down = true;
  coffeetable.body.immovable = true;
  coffeetable.scale.setTo(0.9 , 0.9);
  coffeetable.rotation = 0.1;

  furniture.add(coffeetable);

  // GOAL

  let goal = game.add.sprite(50, 270,'goal');
  goal.name = 'goal';
  game.physics.enable(goal, Phaser.Physics.ARCADE);
  goal.body.collideWorldBounds = true;
  goal.body.immovable = true;
  goal.scale.setTo(0.6 , 0.6);

  // GUI ELEMENTS

  const scoreholder = game.add.sprite(game.width-160, 0,'scoreholder');
  scoreholder.name = 'goal';
  game.physics.enable(scoreholder, Phaser.Physics.ARCADE);
  scoreholder.body.collideWorldBounds = true;
  scoreholder.body.immovable = true;
  scoreholder.scale.setTo(1, 1);

  scoretext = game.add.text(0, 0, "100", textstyle);
  scoretext.setTextBounds(0,0,800,100);

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
  let score = 0;

	arrow.rotation = game.physics.arcade.angleBetween(arrow, player);

  game.physics.arcade.collide(furniture, player);
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
    /*game.debug.text("Drag the sprite and release to launch", 32, 32, 'rgb(0,255,0)');
    game.debug.cameraInfo(game.camera, 32, 64);
    game.debug.spriteCoords(player, 32, 150);
    game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 550, 32, 'rgb(0,255,0)');*/

}

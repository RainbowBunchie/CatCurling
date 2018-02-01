import 'phaser';
import game from '../game';
import {textstyleCenter}from '../style';


export function getGoal(x,y){
  let goal = game.add.sprite(x, y,'goal');
  goal.anchor.setTo(0.5);
  game.physics.enable(goal, Phaser.Physics.ARCADE);
  goal.body.collideWorldBounds = true;
  goal.body.immovable = true;
  goal.scale.setTo(0.6 , 0.6);
  goal.body.setSize(200, 200, 0, 0);
  return goal;
}

export function getPlayer(x, y, set, launch){
  let player = game.add.sprite(x, y, 'player');
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
  return player;
}

export function getAnalog(player){
    let analog = game.add.sprite(player,player,'analog');
    analog.width = 8;
    analog.alpha = 0;
    analog.anchor.setTo(0.5, 1);
    analog.scale.setTo(0.5);
    return analog;
}

export function getArrow(player){
  let arrow = game.add.sprite(player,player,'arrow');
  arrow.anchor.setTo(0.5,0);
  arrow.alpha = 0;
  arrow.scale.setTo(0.5);
  return arrow;
}

// SHOTS

let shotsleft;
let shot;

export function updateShots(shots){
  shotsleft.destroy();
  displayShots(shots);
}

export function displayShots(shots){
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

// GAME LOGIC

export function calcOverlap(obj1,obj2){
  let x1 = obj1.x+(obj1.width/2);
  let x2= obj2.x+(obj2.width/2);
  let y1 = obj1.y+(obj1.height/2);
  let y2= obj2.y+(obj2.height/2);
  let dx = x1-x2;
  let dy = y1-y2;
  let result = Math.sqrt((Math.pow(dx,2)+Math.pow(dy,2)));
  return result;
}

export function getLevelDisplay(level){
  let levelgroup = game.add.group();

  let levelholder = game.add.sprite(0, 0,'levelholder');
  levelholder.anchor.setTo(0.5,0);
  levelgroup.add(levelholder);

  let leveltext = game.add.text(0, 7, `Level ${level.toString()}`, textstyleCenter);
  leveltext.anchor.setTo(0.5,0);
  levelgroup.add(leveltext);

  levelgroup.x=game.width/2;
  levelgroup.y = 10;
}

export function getShotsDisplay(shots){
  let shotsGroup = game.add.group();
  let shotsHolder = game.add.sprite(0, 0, 'shotsholder');

  shotsGroup.add(shotsHolder);

  displayShots(shots);

  let shotsText = game.add.text(10,7, "SHOTS", textstyleCenter);
  shotsHolder.scale.setTo(0.73);

  shotsGroup.add(shotsText);

  shotsGroup.x = game.width -256;
  shotsGroup.y = 12;
}

export function addDust(x, y, dusts){
  let dust = dusts.create(x, y, 'dust');
  dust.scale.setTo(0.2, 0.2);
}
let tmpvelocityx;
let tmpvelocityy;
let pausedLastframe=false;

export function checkIfPaused(player, paused){
  if (paused){
    if(!pausedLastframe){
      tmpvelocityx = player.body.velocity.x;
      tmpvelocityy = player.body.velocity.y;
    }
    player.body.velocity.setTo(0,0);
    pausedLastframe = true;
  }
  if (!paused && pausedLastframe){
    player.body.velocity.setTo(tmpvelocityx,tmpvelocityy);
    pausedLastframe = false;
  }
}

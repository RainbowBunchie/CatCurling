import 'pixi';
import 'p2';
import 'phaser';
import game from '../game';
import {textstyleRight}from '../style';
import {textstyleCenter}from '../style';
import furnitureTpl from '../module-assets/furniture';
import pkg from '../../package.json';

let dusts;
let shots;
let furniture;
let player;
let cursors;
let arrow;
let catchFlag = false;
let launchVelocity = 0;
let analog;
let levelscore = 0;
let scoretext;
let leveltext;
let Xvector;
let Yvector;
let goal;
let level;
let transparent;
let menu;
let scorepause;
let music;
let collect;
let bump;
let soundValue;
let paused = false;

function create() {

  level = 1;
  shots = 3;
  music = game.add.audio('background-music');
  music.volume = 2;
  collect = game.add.audio('collect');
  bump = game.add.audio('bump');
  music.play();

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

  goal = game.add.sprite(50, 300,'goal');
  goal.anchor.setTo(0.5);
  game.physics.enable(goal, Phaser.Physics.ARCADE);
  goal.body.collideWorldBounds = true;
  goal.body.immovable = true;
  goal.scale.setTo(0.6 , 0.6);
  goal.body.setSize(200, 200, 0, 0);


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
    scoreholder.name = 'scoreholder';
    game.physics.enable(scoreholder, Phaser.Physics.ARCADE);
    scoreholder.body.collideWorldBounds = true;
    scoreholder.body.immovable = true;
    scoreholder.scale.setTo(1, 1);
    scoregroup.add(scoreholder);

    scoretext = game.add.text(0, 0, levelscore, textstyleRight);
    scoretext.setTextBounds(35, 13, 100, 10);
    scoregroup.add(scoretext);
    scoregroup.y = 70;

    // SHOTS

    let shotsGroup = game.add.group();

    let shotsHolder = game.add.sprite(0, 0, 'shotsholder');

    shotsGroup.add(shotsHolder);

    displayShots(shots);

    let shotsText = game.add.text(10,7, "SHOTS", textstyleCenter);
    shotsHolder.scale.setTo(0.73);

    shotsGroup.add(shotsText);

    shotsGroup.x = game.width -256;
    shotsGroup.y = 12;


    // SETTINGS MENU
    let showSettings = false;

    let homebutton;
    let restartbutton;
    let raisebutton;
    let lowerbutton;
    let mutebutton;
    let soundText;

    // ----------------------  buttons -----------------------

    let settingsbutton = game.add.sprite(45, 45,'settingsbutton');
    settingsbutton.scale.setTo(1);
    settingsbutton.anchor.setTo(0.5);
    settingsbutton.inputEnabled = true;
    settingsbutton.input.useHandCursor = true;

    settingsbutton.events.onInputUp.add(function(){
      if (showSettings == false){
        getSettingsMenu();
      }
    });

    settingsbutton.events.onInputOver.add(buttonHover,this);
    settingsbutton.events.onInputOut.add(buttonHoverOut,this);

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

      playbutton.events.onInputOver.add(buttonHover,this);
      playbutton.events.onInputOut.add(buttonHoverOut,this);

      raisebutton = game.add.sprite(game.width/3,menu.height/2 + game.height/2 - 120,'raisebutton');
      raisebutton.scale.setTo(0.6,0.6);
      raisebutton.anchor.setTo(0.5,1);
      raisebutton.inputEnabled = true;
      raisebutton.input.useHandCursor = true;
      raisebutton.events.onInputUp.add(function(){
        music.pause();
        music.volume += 1;
        music.resume();
        console.log("raise: " + music.volume);
        if(music.volume > 10)
          music.volume = 10;
        if(music.volume == 1){
          soundValue = music.volume;
          onDeMuteButton();
        }
        soundText.setText(`${~~music.volume}`);
      });

      raisebutton.events.onInputOver.add(buttonHover,this);
      raisebutton.events.onInputOut.add(buttonHoverOut,this);

      lowerbutton = game.add.sprite(2*game.width/3,menu.height/2 + game.height/2 - 120,'lowerbutton');
      lowerbutton.scale.setTo(0.6,0.6);
      lowerbutton.anchor.setTo(0.5,1);
      lowerbutton.inputEnabled = true;
      lowerbutton.input.useHandCursor = true;
      lowerbutton.events.onInputUp.add(function(){
        music.pause();
        music.volume -= 1;
        music.resume();
        if(music.volume < 0)
          music.volume = 0;
        if(music.volume <= 0)
          onMuteButton();
        soundText.setText(`${~~music.volume}`);
      });

      lowerbutton.events.onInputOver.add(buttonHover,this);
      lowerbutton.events.onInputOut.add(buttonHoverOut,this);

      mutebutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 - 120, 'muteoffbutton');
      mutebutton.scale.setTo(0.6,0.6);
      mutebutton.anchor.setTo(0.5,1);
      mutebutton.inputEnabled = true;
      mutebutton.input.useHandCursor = true;
      mutebutton.events.onInputUp.add(function(){
        onMuteButton();
      });

      mutebutton.events.onInputOver.add(buttonHover,this);
      mutebutton.events.onInputOut.add(buttonHoverOut,this);

      function onMuteButton(){
        soundValue = music.volume;
        mutebutton.destroy();
        mutebutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 - 120, 'muteonbutton');
        mutebutton.scale.setTo(0.6,0.6);
        mutebutton.anchor.setTo(0.5,1);
        mutebutton.inputEnabled = true;
        mutebutton.input.useHandCursor = true;
        if(soundValue > 0){
          mutebutton.events.onInputUp.add(function(){
            onDeMuteButton();
          });
        }
        music.volume = 0;
        soundText.setText(`${~~music.volume}`);
      }

      function onDeMuteButton(){
        mutebutton.destroy();
        mutebutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 - 120, 'muteoffbutton');
        mutebutton.scale.setTo(0.6,0.6);
        mutebutton.anchor.setTo(0.5,1);
        mutebutton.inputEnabled = true;
        mutebutton.input.useHandCursor = true;
        mutebutton.events.onInputUp.add(function(){
          onMuteButton();
        });
        music.volume = soundValue;
        soundText.setText(`${~~music.volume}`);
      }

      soundText = game.add.text(game.width/2, menu.height/2 + game.height/2 - 250, `${~~music.volume}`, {
          font: "6em Stringz",
          fill: "#fff",
          align: "center",
          boundsAlignV: "center"
          });
      soundText.anchor.setTo(0.5,1);

      homebutton = game.add.sprite(game.width/2 - playbutton.width - 40,menu.height/2 + game.height/2 + 20,'homebutton');
      homebutton.scale.setTo(0.4);
      homebutton.anchor.setTo(0.5);
      homebutton.inputEnabled = true;
      homebutton.input.useHandCursor = true;
      homebutton.events.onInputUp.add(function(){
        levelscore = 0;
        music.stop();
        game.state.start('loading');
      });

      homebutton.events.onInputOver.add(buttonHover,this);
      homebutton.events.onInputOut.add(buttonHoverOut,this);

      restartbutton = game.add.sprite(game.width/2 + playbutton.width + 40,menu.height/2 + game.height/2 + 20,'restartbutton');
      restartbutton.scale.setTo(0.4, 0.4);
      restartbutton.anchor.setTo(0.5,1);
      restartbutton.inputEnabled = true;
      restartbutton.input.useHandCursor = true;
      restartbutton.events.onInputUp.add(function(){
        levelscore = 0;
        music.stop();
        game.state.start('level1');
      });

      restartbutton.events.onInputOver.add(buttonHover,this);
      restartbutton.events.onInputOut.add(buttonHoverOut,this);

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
        raisebutton.destroy();
        lowerbutton.destroy();
        mutebutton.destroy();
        soundText.destroy();
        showSettings = false;
      }
    }
    // PAUSING THE GAME

    let pausebutton = game.add.sprite(125, 45,'pausebutton');
    pausebutton.anchor.setTo(0.5);

    pausebutton.events.onInputOver.add(buttonHover,this);
    pausebutton.events.onInputOut.add(buttonHoverOut,this);

    pausebutton.inputEnabled = true;
    pausebutton.input.useHandCursor = true;

    pausebutton.events.onInputUp.add(function(){
        handlePause();
    });

    let menu;
    let menutext;
    let playbutton;
    let transparent;
    let pausescore;
    let leveltextpause;
    let scorepause;

    function handlePause(){
      if (showSettings){
        removeSettingsMenu();
      }
      if (!paused){
          paused = true;
          music.pause();
          transparent = game.add.sprite(0,0, 'transparent');

          menu = game.add.sprite(game.width/2,game.height/2,'menu');
          menu.scale.setTo(0.9,0.9);
          menu.anchor.setTo(0.5, 0.5);

          menutext = game.add.text(game.width/2, 115, `GAME PAUSED`, textstyleCenter);
          menutext.anchor.setTo(0.5,1);

          playbutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 + 30,'playbutton');
          playbutton.scale.setTo(0.45,0.45);
          playbutton.anchor.setTo(0.5,1);
          playbutton.inputEnabled = true;
          playbutton.input.useHandCursor = true;
          playbutton.events.onInputUp.add(function(){
            unpause();
          });

          pausescore = game.add.sprite(game.width/2,game.height/2 + 60, 'scoreholder');
          pausescore.anchor.setTo(0.5,0.5);
          pausescore.scale.setTo(1.2,1.2);

          scorepause = game.add.text(0,0,levelscore.toString(), textstyleRight);
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
    }

    //game.input.onDown.add(unpause, self);

    function unpause(){
      console.log("unpause aufruf");
      if (paused == true){
        music.resume();
        console.log("UNPAUSE")
        pausebutton.scale.setTo(1);
        scorepause.destroy();
        leveltextpause.destroy();
        pausescore.destroy();
        transparent.destroy();
        menu.destroy();
        menutext.destroy();
        playbutton.destroy();
        paused = false;
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



function buttonHover(button){
  button.scale.setTo(1.1);
}

function buttonHoverOut(button){
  button.scale.setTo(1);
}


function set(player,pointer) {
  if(player.body.speed<10){
    catchFlag = true;
    game.camera.follow(null);

    player.body.moves = false;
    player.body.velocity.setTo(0, 0);
    arrow.reset(player.x, player.y);
    analog.reset(player.x, player.y);
  }
}

function launch() {
if(player.body.speed<10){

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
let tmpvelocityx;
let tmpvelocityy;
let pausedLastframe=false;

function update() {
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

	arrow.rotation = game.physics.arcade.angleBetween(arrow, player)- 3.14 / 2;

  if(player.body.blocked.up || player.body.blocked.down || player.body.blocked.left || player.body.blocked.right){
    bump.play();
  }

  game.physics.arcade.collide(furniture, player, function(){
    bump.play();
  });

    if (catchFlag === true)
    {
        arrow.x = game.input.activePointer.worldX;
        arrow.y = game.input.activePointer.worldY;

        arrow.alpha = 1;
        analog.alpha = 1;
        analog.rotation = arrow.rotation;
        analog.height = game.physics.arcade.distanceBetween(arrow, player)-20;
        launchVelocity = analog.height-100;

    }

    if (shots == 0 && (player.body.velocity.x ==0 && player.body.velocity.y ==0)) {
      gameOver();
    }
    player.body.velocity.setTo( player.body.velocity.x *0.99, player.body.velocity.y*0.99);

    game.physics.arcade.overlap(player, goal, collisionHandler, null, this);

    // increase Score when cat moves over dust

    game.physics.arcade.overlap(player, dusts, collectDust, null, this);

    scoretext.text=~~scoretext.score;
}

function calcOverlap(obj1,obj2){
  let x1 = obj1.x+(obj1.width/2);
  let x2= obj2.x+(obj2.width/2);
  let y1 = obj1.y+(obj1.height/2);
  let y2= obj2.y+(obj2.height/2);
  let dx = x1-x2;
  let dy = y1-y2;
  let result = Math.sqrt((Math.pow(dx,2)+Math.pow(dy,2)));
  return result;
}

let gameLost = false;

function gameOver() {
  if (gameLost == false){
    let transparent = game.add.sprite(0,0, 'transparent');
  }
  gameLost = true;

  menu = game.add.sprite(game.width/2,game.height/2,'menu');
  menu.scale.setTo(0.9);
  menu.anchor.setTo(0.5);
  let menutext;
  menutext = game.add.text(game.width/2, 100, `GAME OVER`, textstyleCenter);
  menutext.anchor.setTo(0.5);

  let restartbutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 + 20,'restartbutton');
  restartbutton.scale.setTo(0.45);
  restartbutton.anchor.setTo(0.5);
  restartbutton.inputEnabled = true;
  restartbutton.input.useHandCursor = true;
  restartbutton.events.onInputUp.add(function(){
    gameLost = false;
    levelscore = 0;
    music.stop();
    game.state.start('level1');
  });
  let gameoverscore = game.add.sprite(game.width/2,game.height/2 + 60, 'scoreholder');
  gameoverscore.anchor.setTo(0.5,0.5);
  gameoverscore.scale.setTo(1.2,1.2);

  let scoregameover = game.add.text(0,0,levelscore.toString(), textstyleRight);
  scoregameover.setTextBounds(game.width/2-75, game.height/2 + 40, 144, 10);

  let leveltextpause = game.add.text(0, 0, 'aww ;-; you ran out of shots', textstyleCenter);
  leveltextpause.setTextBounds(game.width/2-200, game.height/2-50, 150, 10);

  let homebutton;
  homebutton = game.add.sprite(game.width/2 - restartbutton.width - 40,menu.height/2 + game.height/2 + 20,'homebutton');
  homebutton.scale.setTo(0.4);
  homebutton.anchor.setTo(0.5);
  homebutton.inputEnabled = true;
  homebutton.input.useHandCursor = true;
  homebutton.events.onInputUp.add(function(){
    gameLost = false;
    levelscore = 0;
    music.stop();
    game.state.start('loading');
  });
}

let gameIsWon = false;
let inGoal = false;

function collisionHandler (obj1, obj2) {
  if (!gameIsWon && !inGoal){
    if((player.body.velocity.x == 0 ) && (player.body.velocity.y == 0) ){
        if (calcOverlap(player.body, goal.body)<20){
          animateScore(shots*20);
          animateScore(300);
          gameWon();
        }
        else if (calcOverlap(player.body, goal.body)<60){
          animateScore(shots*20);
          animateScore(100);
          gameWon();
        }

    }
  }
}

function gameWon(){
  if (gameIsWon == false){
    let transparent = game.add.sprite(0,0, 'transparent');
  }
  menu = game.add.sprite(game.width/2,game.height/2,'menu');
  menu.scale.setTo(0.9,0.9);
  menu.anchor.setTo(0.5, 0.5);
  let menutext;
  menutext = game.add.text(game.width/2, 115, `VICTORY`, textstyleCenter);
  menutext.anchor.setTo(0.5,1);

  let nextlevel =  game.add.sprite(game.width/2 ,menu.height/2 + game.height/2 + 20,'playbutton');
  nextlevel.scale.setTo(0.4,0.4);
  nextlevel.anchor.setTo(0.5,1);
  nextlevel.inputEnabled = true;
  nextlevel.input.useHandCursor = true;

  let restartbutton = game.add.sprite(game.width/2 + nextlevel.width + 40,menu.height/2 + game.height/2 + 20,'restartbutton');
  restartbutton.scale.setTo(0.41);
  restartbutton.anchor.setTo(0.5);
  restartbutton.inputEnabled = true;
  restartbutton.input.useHandCursor = true;
  restartbutton.events.onInputUp.add(function(){
    gameIsWon = false;
    levelscore = 0;
    music.stop();
    game.state.start('level1');
  });

  let homebutton = game.add.sprite(game.width/2 - restartbutton.width - 40,menu.height/2 + game.height/2 + 20,'homebutton');
  homebutton.scale.setTo(0.4);
  homebutton.anchor.setTo(0.5);
  homebutton.inputEnabled = true;
  homebutton.input.useHandCursor = true;
  homebutton.events.onInputUp.add(function(){
    gameIsWon = false;
    levelscore = 0;
    music.stop();
    game.state.start('loading');
  });



  let pausescore = game.add.sprite(game.width/2,game.height/2 + 60, 'scoreholder');
  pausescore.anchor.setTo(0.5,0.5);
  pausescore.scale.setTo(1.2,1.2);

  let scorepause = game.add.text(0,0,levelscore.toString(), textstyleRight);
  scorepause.setTextBounds(game.width/2-75, game.height/2 + 40, 144, 10);

  let leveltextpause = game.add.text(0, 0, 'Level ' + level, {
          font: "5em Stringz",
          fill: "#fff",
          align: "center",
          boundsAlignH: "center",
          boundsAlignV: "center"
        });

  leveltextpause.setTextBounds(game.width/2-72, game.height/2-70, 150, 10);

  gameIsWon = true;
}

//triggered when cat overlaps with dust
function collectDust(player, dust){
  collect.play();
  dust.kill();
  game.time.events.add(30, function () {
    animateScore(50);
  });
}

function animateScore(amount){
  levelscore += amount;
  game.add.tween(scoretext).to({score:levelscore},700,"Linear", true);

}

function render() {
/*
  game.debug.cameraInfo(game.camera, 32, 64);
  game.debug.spriteCoords(player, 32, 150);
  game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 550, 32, 'rgb(0,255,0)');
  game.debug.bodyInfo(player, 32, 32);
  game.debug.body(player);
  game.debug.body(goal);
   game.debug.text("Overlap: inner"+ calcOverlap(player.body, goal.body), 250, 250, 'rgb(0,255,0)');
   game.debug.text("SPEEEEEED"+ player.body.speed, 400, 400, 'rgb(0,255,0)');
   game.debug.text("Overlap: outer"+ calcOverlap(player.body, goal.body), 250, 290, 'rgb(0,255,0)');
   game.debug.text("Shots left: "+ shots, 250, 350, 'rgb(0,255,0)');
*/
}

export default{
    create,
    update,
    render
}

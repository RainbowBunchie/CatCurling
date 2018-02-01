import 'pixi';
import 'p2';
import 'phaser';
import game from '../game';
import {textstyleRight}from '../style';
import {textstyleCenter}from '../style';
import furnitureTpl from '../module-assets/furniture';
import {getGoal, getPlayer, getAnalog, getArrow, updateShots, displayShots, calcOverlap, getLevelDisplay, getShotsDisplay, addDust, checkIfPaused} from '../module-assets/functions';
import pkg from '../../package.json';

let level = 1;
let shots;
let goal;
let player;
let dusts;
let furniture;
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
let transparent;
let menu;
let scorepause;
let music;
let collect;
let bump;
let soundValue;
let paused = false;
let gameoverhelper;

function create() {
  shots =3;

  //MUSIC

  music = game.add.audio('background-music');
  music.volume = 2;
  collect = game.add.audio('collect');
  bump = game.add.audio('bump');
  music.play();

  //CREATE THE FURNITURE

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

  let deskchair = furnitureTpl(game,'deskchair',game.width-130,game.height/4 + 45,0.45,0.45, 0.2);
  furniture.add(deskchair);

  let desk = furnitureTpl(game,'desk',game.width,game.height/4,0.45,0.45);
  furniture.add(desk);

  let coffeetable = furnitureTpl(game,'coffeetable',160,130,0.9,0.9, 0.1);
  furniture.add(coffeetable);

  // GOAL
  goal = getGoal(80,300);

  //DUSTS

  dusts = game.add.group();
  dusts.enableBody = true;

  addDust(650, 250, dusts);
  addDust(250, 450, dusts);
  addDust(480, 180, dusts);

  // GAME CHARACTERS:

  analog = getAnalog(player);
  arrow = getArrow(player);

  // PLAYER
  player = getPlayer(850, 550, set, launch);


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
    getShotsDisplay(shots);

    // SETTINGS MENU
    let showSettings = false;

    // ----------------------  buttons -----------------------

    let restartbutton;
    let raisebutton;
    let lowerbutton;
    let mutebutton;
    let homebutton;
    let soundText;

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
      showSettings = true;

      transparent = game.add.sprite(0,0, 'transparent');

      menu = game.add.sprite(game.width/2,game.height/2,'menu');
      menu.scale.setTo(0.9);
      menu.anchor.setTo(0.5);

      menutext = game.add.text(game.width/2, 115, `SETTINGS`, textstyleCenter);
      menutext.anchor.setTo(0.5,1);

      playbutton = game.add.sprite(menu.x,menu.y + menu.height/2 ,'playbutton');
      playbutton.scale.setTo(0.5);
      playbutton.anchor.setTo(0.5);
      playbutton.inputEnabled = true;
      playbutton.input.useHandCursor = true;
      playbutton.events.onInputUp.add(function(){
        removeSettingsMenu();
        console.log("hello");
      });
      playbutton.events.onInputOver.add(buttonHoverSmall,this);
      playbutton.events.onInputOut.add(buttonHoverOutSmall,this);

      raisebutton = game.add.sprite(menu.x + menu.width/4,menu.y+40,'raisebutton');
      raisebutton.scale.setTo(0.5);
      raisebutton.anchor.setTo(0.5);
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
      raisebutton.events.onInputOver.add(buttonHoverSmall,this);
      raisebutton.events.onInputOut.add(buttonHoverOutSmall,this);

      lowerbutton = game.add.sprite(menu.x - menu.width/4,menu.y+40,'lowerbutton');
      lowerbutton.scale.setTo(0.5);
      lowerbutton.anchor.setTo(0.5);
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
      lowerbutton.events.onInputOver.add(buttonHoverSmall,this);
      lowerbutton.events.onInputOut.add(buttonHoverOutSmall,this);

      mutebutton = game.add.sprite(menu.x,menu.y+40, 'muteoffbutton');
      mutebutton.scale.setTo(0.5);
      mutebutton.anchor.setTo(0.5);
      mutebutton.inputEnabled = true;
      mutebutton.input.useHandCursor = true;
      mutebutton.events.onInputUp.add(function(){
        onMuteButton();
      });
      mutebutton.events.onInputOver.add(buttonHoverSmall,this);
      mutebutton.events.onInputOut.add(buttonHoverOutSmall,this);

      function onMuteButton(){
        soundValue = music.volume;
        mutebutton.destroy();
        mutebutton = game.add.sprite(menu.x,menu.y+40, 'muteonbutton');
        mutebutton.scale.setTo(0.5);
        mutebutton.anchor.setTo(0.5);
        mutebutton.inputEnabled = true;
        mutebutton.input.useHandCursor = true;
        mutebutton.events.onInputOver.add(buttonHoverSmall,this);
        mutebutton.events.onInputOut.add(buttonHoverOutSmall,this);
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
        mutebutton = game.add.sprite(menu.x,menu.y+40, 'muteoffbutton');
        mutebutton.scale.setTo(0.5);
        mutebutton.anchor.setTo(0.5);
        mutebutton.inputEnabled = true;
        mutebutton.input.useHandCursor = true;
        mutebutton.events.onInputOver.add(buttonHoverSmall,this);
        mutebutton.events.onInputOut.add(buttonHoverOutSmall,this);
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

      homebutton = game.add.sprite(menu.x-menu.height/3,menu.y + menu.height/2,'homebutton');
      homebutton.scale.setTo(0.5);
      homebutton.anchor.setTo(0.5);
      homebutton.inputEnabled = true;
      homebutton.input.useHandCursor = true;
      homebutton.events.onInputOver.add(buttonHoverSmall,this);
      homebutton.events.onInputOut.add(buttonHoverOutSmall,this);
      homebutton.events.onInputUp.add(function(){
        levelscore = 0;
        music.stop();
        game.state.start('loading');
      });

      restartbutton = game.add.sprite(menu.x+menu.height/3,menu.y + menu.height/2,'restartbutton');
      restartbutton.scale.setTo(0.5);
      restartbutton.anchor.setTo(0.5);
      restartbutton.inputEnabled = true;
      restartbutton.input.useHandCursor = true;
      restartbutton.events.onInputOver.add(buttonHoverSmall,this);
      restartbutton.events.onInputOut.add(buttonHoverOutSmall,this);
      restartbutton.events.onInputUp.add(function(){
        levelscore = 0;
        music.stop();
        game.state.start('level1');
      });
    }


    function removeSettingsMenu(){
      console.log("remove "+ showSettings );
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
      showSettings = true;
      if (!paused){
          paused = true;
          music.pause();
          transparent = game.add.sprite(0,0, 'transparent');

          menu = game.add.sprite(game.width/2,game.height/2,'menu');
          menu.scale.setTo(0.9,0.9);
          menu.anchor.setTo(0.5, 0.5);

          menutext = game.add.text(game.width/2, 115, `GAME PAUSED`, textstyleCenter);
          menutext.anchor.setTo(0.5,1);

          playbutton = game.add.sprite(menu.x,menu.y + menu.height/2 ,'playbutton');
          playbutton.scale.setTo(0.5);
          playbutton.anchor.setTo(0.5);
          playbutton.inputEnabled = true;
          playbutton.input.useHandCursor = true;
          playbutton.events.onInputUp.add(function(){
            unpause();
          });

          playbutton.events.onInputOver.add(buttonHoverSmall,this);
          playbutton.events.onInputOut.add(buttonHoverOutSmall,this);

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
        showSettings = false;
      }
    }
    getLevelDisplay(level);
}

function buttonHover(button){
  button.scale.setTo(1.1);
}

function buttonHoverOut(button){
  button.scale.setTo(1);
}

function buttonHoverSmall(button){
  button.scale.setTo(0.6);
}

function buttonHoverOutSmall(button){
  button.scale.setTo(0.5);
}

function set(player,pointer) {
  if(player.body.speed<20){
    catchFlag = true;
    game.camera.follow(null);
    player.body.moves = false;
    player.body.velocity.setTo(0, 0);
    arrow.reset(player.x, player.y);
    analog.reset(player.x, player.y);
  }
}

function launch() {
  if(player.body.speed<20){
    catchFlag = false;
    player.body.moves = true;
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
    shots-=1;
    updateShots(shots);
    arrow.alpha = 0;
    analog.alpha = 0;

    Xvector = (arrow.x - player.x) * 3;
    Yvector = (arrow.y - player.y) * 3;

    player.body.velocity.setTo(Xvector, Yvector);
  }
}


function update() {

  checkIfPaused(player, paused);

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
    player.body.velocity.setTo( player.body.velocity.x *0.99, player.body.velocity.y*0.99);

    game.physics.arcade.overlap(player, goal, collisionHandler, null, this);

    // increase Score when cat moves over dust

    game.physics.arcade.overlap(player, dusts, collectDust, null, this);

    scoretext.text=~~scoretext.score;

    if ((shots == 0 && player.body.speed == 0) && gameIsWon!=true) {
      if (gameoverhelper!=true){
      gameOver();
    }
    }

}

let gameLost = false;


function gameOver() {

  console.log('gameover function');
 //if(gameLost==true){
  let transparent = game.add.sprite(0,0, 'transparent');

  menu = game.add.sprite(game.width/2,game.height/2,'menu');
  menu.scale.setTo(0.9);
  menu.anchor.setTo(0.5);
  let menutext;
  menutext = game.add.text(game.width/2, 100, `GAME OVER`, textstyleCenter);
  menutext.anchor.setTo(0.5);

  let restartbutton = game.add.sprite(menu.x+menu.height/3,menu.y + menu.height/2,'restartbutton');
  restartbutton.scale.setTo(0.5);
  restartbutton.anchor.setTo(0.5);
  restartbutton.inputEnabled = true;
  restartbutton.input.useHandCursor = true;
  restartbutton.events.onInputUp.add(function(){
    gameLost = false;
    levelscore = 0;
    music.stop();
    game.state.start('level1');
  });
  restartbutton.events.onInputOver.add(buttonHoverSmall,this);
  restartbutton.events.onInputOut.add(buttonHoverOutSmall,this);

  let highscorebutton = game.add.sprite(menu.x+menu.width/2,menu.y,'highscorebutton');
  highscorebutton.scale.setTo(0.5);
  highscorebutton.anchor.setTo(0.5);
  highscorebutton.inputEnabled = true;
  highscorebutton.input.useHandCursor = true;
  highscorebutton.events.onInputOver.add(buttonHoverSmall,this);
  highscorebutton.events.onInputOut.add(buttonHoverOutSmall,this);
  highscorebutton.events.onInputUp.add(function(){
    game.state.states['highscore'].endscore = levelscore;
    game.state.start('highscore');
  });


  let gameoverscore = game.add.sprite(game.width/2,game.height/2 + 60, 'scoreholder');
  gameoverscore.anchor.setTo(0.5);
  gameoverscore.scale.setTo(1.2);

  let scoregameover = game.add.text(0,0,levelscore.toString(), textstyleRight);
  scoregameover.setTextBounds(game.width/2-75, game.height/2 + 40, 144, 10);

  let leveltextpause = game.add.text(0, 0, 'aww ;-; you ran out of shots', textstyleCenter);
  leveltextpause.setTextBounds(game.width/2-200, game.height/2-50, 150, 10);

  let homebutton;
  homebutton = game.add.sprite(menu.x-menu.height/3,menu.y + menu.height/2,'homebutton');
  homebutton.scale.setTo(0.4);
  homebutton.anchor.setTo(0.5);
  homebutton.inputEnabled = true;
  homebutton.input.useHandCursor = true;
  homebutton.events.onInputOver.add(buttonHoverSmall,this);
  homebutton.events.onInputOut.add(buttonHoverOutSmall,this);
  homebutton.events.onInputUp.add(function(){
    gameLost = false;
    levelscore = 0;
    music.stop();
    game.state.start('loading');
  });

gameoverhelper=true;
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
            gameIsWon=true;
    let transparent = game.add.sprite(0,0, 'transparent');

  menu = game.add.sprite(game.width/2,game.height/2,'menu');
  menu.scale.setTo(0.9,0.9);
  menu.anchor.setTo(0.5, 0.5);
  let menutext;
  menutext = game.add.text(game.width/2, 115, `VICTORY`, textstyleCenter);
  menutext.anchor.setTo(0.5,1);

  let nextlevel =  game.add.sprite(menu.x,menu.y + menu.height/2,'playbutton');
  nextlevel.scale.setTo(0.5);
  nextlevel.anchor.setTo(0.5);
  nextlevel.inputEnabled = true;
  nextlevel.input.useHandCursor = true;

  nextlevel.events.onInputOver.add(buttonHoverSmall,this);
  nextlevel.events.onInputOut.add(buttonHoverOutSmall,this);

  let restartbutton = game.add.sprite(menu.x+menu.width/3,menu.y + menu.height/2,'restartbutton');
  restartbutton.scale.setTo(0.5);
  restartbutton.anchor.setTo(0.5);
  restartbutton.inputEnabled = true;
  restartbutton.input.useHandCursor = true;
  restartbutton.events.onInputUp.add(function(){
    gameIsWon = false;
    levelscore = 0;
    music.stop();
    game.state.start('level1');
  });

  restartbutton.events.onInputOver.add(buttonHoverSmall,this);
  restartbutton.events.onInputOut.add(buttonHoverOutSmall,this);

  let homebutton = game.add.sprite(menu.x-menu.width/3,menu.y + menu.height/2,'homebutton');
  homebutton.scale.setTo(0.5);
  homebutton.anchor.setTo(0.5);
  homebutton.inputEnabled = true;
  homebutton.input.useHandCursor = true;
  homebutton.events.onInputOver.add(buttonHoverSmall,this);
  homebutton.events.onInputOut.add(buttonHoverOutSmall,this);
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

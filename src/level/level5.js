import 'pixi';
import 'p2';
import 'phaser';
import game from '../game';
import {textstyleRight}from '../style';
import {textstyleCenter}from '../style';
import furnitureTpl from '../module-assets/furniture';
import {getGoal, getPlayer, getAnalog, getArrow, updateShots, displayShots, calcOverlap, getLevelDisplay, getShotsDisplay, addDust, checkIfPaused, getButton} from '../module-assets/functions';
import pkg from '../../package.json';

let level = 5;
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
let meow1, meow2, meow3;
let sounds = [];
let totalscore = game.global.score1+game.global.score2+game.global.score3+game.global.score4+game.global.score5;

function create() {
  shots = 1;
  //MUSIC
  music = game.add.audio('background-music');
  music.volume = 0.5;
  collect = game.add.audio('collect');
  bump = game.add.audio('bump');
  music.play();
  meow1 = game.add.audio('meow1');
  meow2 = game.add.audio('meow2');
  meow3 = game.add.audio('meow3');
  sounds.push(music, collect, bump, meow1, meow2, meow3);

  //CREATE THE FURNITURE

  furniture = game.add.group();

  let couchLong = furnitureTpl(game,'couch-long',0,0,0.35,0.35);
  furniture.add(couchLong);

  let couchShort = furnitureTpl(game,'couch-short',0,couchLong.height-2,0.35,0.35);
  furniture.add(couchShort);

  let plant = furnitureTpl(game,'plant',game.width/5 * 3,10,0.45,0.45);
  furniture.add(plant);

  let coffeetable = furnitureTpl(game,'coffeetable',160,130,0.9,0.9, 0.1);
  furniture.add(coffeetable);

  let chairs = furnitureTpl(game,'chairs',(game.width/2 - 55),(game.height - 243),0.35,0.35);
  furniture.add(chairs);

  let table = furnitureTpl(game,'table',game.width/2,game.height,0.35,0.35);
  furniture.add(table);

	game.stage.backgroundColor = '#f5cf99';

  // GOAL
  goal = getGoal(1000,500);

  //DUSTS

  dusts = game.add.group();
  dusts.enableBody = true;

  addDust(900, 480, dusts);
  addDust(450, 50, dusts);

  // GAME CHARACTERS:

  analog = getAnalog(player);
  arrow = getArrow(player);

  // PLAYER
  player = getPlayer(70, 550, set, launch);

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

    scoretext = game.add.text(0, 0, totalscore, textstyleRight);
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


    let settingsbutton = getButton(45,45, 'settingsbutton', 1, 0.5, 0);

    settingsbutton.events.onInputUp.add(function(){
      if (showSettings == false){
        getSettingsMenu();
      }
    });

    function getSettingsMenu(){
      showSettings = true;

      transparent = game.add.sprite(0,0, 'transparent');

      menu = game.add.sprite(game.width/2,game.height/2,'menu');
      menu.scale.setTo(0.9);
      menu.anchor.setTo(0.5);

      menutext = game.add.text(game.width/2, 115, `SETTINGS`, textstyleCenter);
      menutext.anchor.setTo(0.5,1);

      playbutton = getButton(menu.x,menu.y + menu.height/2 ,'playbutton', 0.5, 0.5, 1);
      playbutton.events.onInputUp.add(function(){
        removeSettingsMenu();
        console.log("hello");
      });


      raisebutton = getButton(menu.x + menu.width/4,menu.y+40,'raisebutton', 0.5, 0.5, 1);
      raisebutton.events.onInputUp.add(function(){
        music.pause();
        music.volume += 1/10;
        music.resume();
        console.log("raise: " + music.volume);
        if(music.volume > 1)
          music.volume = 1;
        if(music.volume == 1){
          soundValue = music.volume;
          onDeMuteButton();
        }
        soundText.setText(`${Math.round(music.volume*10)}`);
      });

      lowerbutton = getButton(menu.x - menu.width/4,menu.y+40,'lowerbutton', 0.5, 0.5, 1);
      lowerbutton.events.onInputUp.add(function(){
        music.pause();
        music.volume -= 1/10;
        music.resume();
        if(music.volume < 0)
          music.volume = 0;
        if(music.volume <= 0)
          onMuteButton();
        soundText.setText(`${Math.round(music.volume*10)}`);
      });

      mutebutton = getButton(menu.x,menu.y+40, 'muteoffbutton', 0.5, 0.5, 1);
      mutebutton.events.onInputUp.add(function(){
        onMuteButton();
      });

      function onMuteButton(){
        soundValue = music.volume;
        mutebutton.destroy();
        mutebutton = getButton(menu.x,menu.y+40, 'muteonbutton', 0.5, 0.5, 1);
        if(soundValue > 0){
          mutebutton.events.onInputUp.add(function(){
            onDeMuteButton();
          });
        }
        for(let sound of sounds){
          sound.volume = 0;
        }
        soundText.setText(`${Math.round(music.volume*10)}`);
      }

      function onDeMuteButton(){
        mutebutton.destroy();
        mutebutton = getButton(menu.x,menu.y+40, 'muteoffbutton', 0.5, 0.5, 1);
        mutebutton.events.onInputUp.add(function(){
          onMuteButton();
        });
        for(let sound of sounds){
          sound.volume = 0;
        }
        soundText.setText(`${Math.round(music.volume*10)}`);
      }

      soundText = game.add.text(game.width/2, menu.height/2 + game.height/2 - 250, `${~~music.volume}`, {
          font: "6em Stringz",
          fill: "#fff",
          align: "center",
          boundsAlignV: "center"
          });
      soundText.anchor.setTo(0.5,1);
      soundText.setText(`${Math.round(music.volume*10)}`);

      homebutton = getButton(menu.x-menu.height/3,menu.y + menu.height/2,'homebutton', 0.5, 0.5, 1);
      homebutton.events.onInputUp.add(function(){
        levelscore = 0;
        music.stop();
        game.state.start('loading');
      });

      restartbutton = getButton(menu.x+menu.height/3,menu.y + menu.height/2,'restartbutton', 0.5, 0.5, 1);
      restartbutton.events.onInputUp.add(function(){
        levelscore = 0;
        music.stop();
        game.state.start('level5');
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

    let pausebutton = getButton(125, 45,'pausebutton', 1, 0.5, 0);
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

          playbutton = getButton(menu.x,menu.y + menu.height/2 ,'playbutton', 0.5, 0.5, 1);
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

    if ((shots <= 0 && player.body.speed == 0) && gameIsWon!=true) {
      if (gameoverhelper!=true){
        gameOver();
      }
    }

    // random meow
    let a = Math.random();
    if(a <0.01){
      let b = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
      switch(b){
        case 1: meow1.play();
        break;
        case 2: meow2.play();
        break;
        case 3: meow3.play();
        break;
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

  let restartbutton = getButton(menu.x+menu.height/3,menu.y + menu.height/2,'restartbutton', 0.5, 0.5, 1);
  restartbutton.events.onInputUp.add(function(){
    gameLost = false;
    levelscore = 0;
    music.stop();
    gameoverhelper = false;
    game.state.start('level5');
  });

  let highscorebutton = getButton(menu.x+menu.width/2,menu.y,'highscorebutton', 0.5, 0.5, 1);
  highscorebutton.events.onInputUp.add(function(){
    game.state.start('score');
  });

  let gameoverscore = game.add.sprite(game.width/2,game.height/2 + 60, 'scoreholder');
  gameoverscore.anchor.setTo(0.5);
  gameoverscore.scale.setTo(1.2);

  let scoregameover = game.add.text(0,0,game.global.score1 + game.global.score2, textstyleRight);
  scoregameover.setTextBounds(game.width/2-75, game.height/2 + 40, 144, 10);

  let leveltextpause = game.add.text(0, 0, 'aww ;-; you ran out of shots', textstyleCenter);
  leveltextpause.setTextBounds(game.width/2-200, game.height/2-50, 150, 10);

  let homebutton;
  homebutton = getButton(menu.x-menu.height/3,menu.y + menu.height/2,'homebutton', 0.5, 0.5, 1);
  homebutton.events.onInputUp.add(function(){
    gameLost = false;
    gameoverhelper = false;
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
  game.global.score2=levelscore;
  game.global.unlock2 = true;

  gameIsWon=true;
  let transparent = game.add.sprite(0,0, 'transparent');
  function stopMusic(){
    music.stop();
  }

  menu = game.add.sprite(game.width/2,game.height/2,'menu');
  menu.scale.setTo(0.9,0.9);
  menu.anchor.setTo(0.5, 0.5);
  let menutext;
  menutext = game.add.text(game.width/2, 115, `VICTORY`, textstyleCenter);
  menutext.anchor.setTo(0.5,1);

  let nextlevel = getButton(menu.x,menu.y + menu.height/2,'playbutton', 0.5, 0.5, 1);
  nextlevel.events.onInputUp.add(function(){
    stopMusic();
    game.state.start('score');
  });

  let restartbutton = getButton(menu.x+menu.width/3,menu.y + menu.height/2,'restartbutton', 0.5, 0.5, 1);
  restartbutton.events.onInputUp.add(function(){
    gameIsWon = false;
    levelscore = 0;
    stopMusic();
    game.state.start('level5');
  });

  let homebutton = getButton(menu.x-menu.width/3,menu.y + menu.height/2,'homebutton', 0.5, 0.5, 1);
  homebutton.events.onInputUp.add(function(){
    gameIsWon = false;
    levelscore = 0;
    stopMusic();
    gameIsWon = false;
    game.state.start('loading');
  });

  let pausescore = game.add.sprite(game.width/2,game.height/2 + 60, 'scoreholder');
  pausescore.anchor.setTo(0.5,0.5);
  pausescore.scale.setTo(1.2,1.2);

  let scorepause = game.add.text(0,0,game.global.score1 + game.global.score2, textstyleRight);
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

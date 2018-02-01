import game from '../game';


let back;
let next;
let bg;

function create(){
  let middleX = game.width/2;
  let middleY =game.height/2;
  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  // start

  let playbutton;
  let homebutton;
  let restartbutton;
  let raisebutton;
  let lowerbutton;
  let mutebutton;
  let soundText;
  let menu;
  let textstyleCenter, textstyleRight;
  let menutext;
  let music;

  music = game.add.audio('background-music');
  music.volume = 2;

  textstyleRight = {
          font: "2.8em Stringz",
          fill: "#fff",
          align: "right",
          boundsAlignH: "right",
          boundsAlignV: "right"
        };

  textstyleCenter = {
          font: "2.8em Stringz",
          fill: "#fff",
          align: "center",
          boundsAlignV: "center"
        };

  menu = game.add.sprite(game.width/2,game.height/2,'menu');
  menu.scale.setTo(0.9,0.9);
  menu.anchor.setTo(0.5, 0.5);

  menutext = game.add.text(game.width/2, 115, `SETTINGS`, textstyleCenter);
  menutext.anchor.setTo(0.5,1);

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

  mutebutton = game.add.sprite(game.width/2,menu.height/2 + game.height/2 - 120, 'muteoffbutton');
  mutebutton.scale.setTo(0.6,0.6);
  mutebutton.anchor.setTo(0.5,1);
  mutebutton.inputEnabled = true;
  mutebutton.input.useHandCursor = true;
  mutebutton.events.onInputUp.add(function(){
    onMuteButton();
  });

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


    //end

  back = game.add.sprite(middleX, game.height - 100, 'back');
  back.anchor.setTo(0.5);
  back.scale.setTo(0.5);

  back.inputEnabled=true;

  back.events.onInputUp.add(buttonClick);
  back.events.onInputOver.add(buttonHover,this);
  back.events.onInputOut.add(buttonHoverOut,this);

}

function buttonClick(){
  game.state.start('menu');
}

function buttonHover(button){
  button.scale.setTo(0.6);
}

function buttonHoverOut(button){
  button.scale.setTo(0.5);
}

function update(){
  bg.tilePosition.x +=1 ;
  bg.tilePosition.y += 1;
}

export default{
    create,
    update
}

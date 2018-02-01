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

  let logo = game.add.image(middleX ,middleY -150, 'logo');
  logo.anchor.setTo(0.5);

  let text = game.add.text(middleX,middleY+100, 'Background Music: Alex McCulloch\nMeow Sound: http://audiosoundclips.com\n8-Bit-Sounds: https://jdwasabi.itch.io\nRest: https://hendracle-interactive.itch.io  ', {fill: '#FFF', align: "center", boundsAlignH: "center", boundsAlignV: "center"});
  text.anchor.setTo(0.5);

  back = game.add.sprite(middleX, game.height - 50, 'back');
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

import game from '../game';


let back;
let next;
let bg;
let one;
let two;

function create(){

  game.global.score2+=2;
  let middleX = game.width/2;
  let middleY =game.height/2;
  bg=game.add.tileSprite(0, 0, 1100, 600, "bg");
  bg.tileScale.y = 0.3;
  bg.tileScale.x = 0.3;

  back = game.add.sprite(middleX, game.height - 100, 'back');
  back.anchor.setTo(0.5);
  back.scale.setTo(0.5);

  back.inputEnabled=true;

  back.events.onInputUp.add(buttonClick);
  back.events.onInputOver.add(buttonHover,this);
  back.events.onInputOut.add(buttonHoverOut,this);

  one = game.add.sprite(middleX, middleY, 'back');
  one.anchor.setTo(0.5);
  one.scale.setTo(0.5);

  one.inputEnabled=true;

  one.events.onInputUp.add(function(){
    selected(1);
  });
  one.events.onInputOver.add(buttonHover,this);
  one.events.onInputOut.add(buttonHoverOut,this);



two = game.add.sprite(middleX, middleY+100, 'back');
two.anchor.setTo(0.5);
two.scale.setTo(0.5);

two.inputEnabled=true;

two.events.onInputUp.add(function(){
  selected(2);
});
two.events.onInputOver.add(buttonHover,this);
two.events.onInputOut.add(buttonHoverOut,this);

}

 function selected(level){
   let s ='level'+level+'';
   console.log(s);
    game.state.start(s);
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

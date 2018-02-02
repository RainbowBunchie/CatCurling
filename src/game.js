import 'pixi';
import 'p2';
import 'phaser';
import config from './config';



const game = new Phaser.Game(config);

game.global = {
 score1 : 0,
 score2 : 0,
 score3 : 0,
 score4: 0,
 score5: 0,
 unlock1 : false,
 unlock2 : false,
 unlock3 : false,
 unlock4 : false,
 unlock5 : false

}

export default game;

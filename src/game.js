import 'pixi';
import 'p2';
import 'phaser';
import config from './config';



const game = new Phaser.Game(config);

game.global = {
 score : 0,
 score2 : 0
}

export default game;

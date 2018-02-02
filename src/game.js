import 'pixi';
import 'p2';
import 'phaser';
import config from './config';

const game = new Phaser.Game(config);
game.global = {
 score : 1
}
export default game;

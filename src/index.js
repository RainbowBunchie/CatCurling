import game from './game';
import level1 from './level/level1';
import bootState from './states/boot';
import menuState from './states/menu';
import scoreState from './states/score';
import loadingState from './states/loading';

game.state.add('booting', bootState);
game.state.add('loading', loadingState);
game.state.add('menu', menuState);
game.state.add('level1', level1);
game.state.add('score', scoreState);

game.state.start('booting');

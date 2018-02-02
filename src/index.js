import game from './game';
import level1 from './level/level1';
import level2 from './level/level2';
import level3 from './level/level3';
import level4 from './level/level4';
import level5 from './level/level5';
import score from './states/score';
import bootState from './states/boot';
import menuState from './states/menu';
import loadingState from './states/loading';
import newGame from './states/newGame';
import credits from './states/credits';
import menuSettings from './states/menuSettings';
import levelSelect from './states/levelSelect';
import highscore from './states/highscore';

game.state.add('booting', bootState);
game.state.add('loading', loadingState);
game.state.add('menu', menuState);

game.state.add('level1', level1);
game.state.add('level2', level2);
game.state.add('level3', level3);
game.state.add('level4', level4);
game.state.add('level5', level5);
game.state.add('score', score);
game.state.add('newGame', newGame);
game.state.add('levelSelect', levelSelect);
game.state.add('credits', credits);
game.state.add('menuSettings', menuSettings);

game.state.add('highscore', highscore);

game.state.start('booting');

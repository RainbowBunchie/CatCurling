import game from './game';
import level1 from './level/level1';
import level2 from './level/level2';
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
game.state.add('newGame', newGame);
game.state.add('levelSelect', levelSelect);
game.state.add('credits', credits);
game.state.add('menuSettings', menuSettings);

game.state.add('highscore', highscore);

game.state.start('booting');

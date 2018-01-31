import game from './game';
import level1 from './level/level1';
import bootState from './states/boot';
import menuState from './states/menu';
import loadingState from './states/loading';
import newGame from './states/newGame';
import credits from './states/credits';
import menuSettings from './states/menuSettings';
import levelSelect from './states/levelSelect';

game.state.add('booting', bootState);
game.state.add('loading', loadingState);
game.state.add('menu', menuState);

game.state.add('level1', level1);

game.state.add('newGame', newGame);
game.state.add('levelSelect', levelSelect);
game.state.add('credits', credits);
game.state.add('menuSettings', menuSettings);

game.state.start('booting');

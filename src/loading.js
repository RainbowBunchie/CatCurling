import 'phaser';

loadScripts: function () {
  },

  loadBgm: function () {
  },

  loadImages: function () {
  },

  loadFonts: function () {
  },

  // The preload function then will call all of the previously defined functions:
  preload: function () {
    // object z-index is set to when object was added.
    // background
    game.add.sprite(0, 0, 'bg');
    // my logo
    var logo = game.add.sprite(game.world.centerX-120, 100, 'logo');
    // loading bar
    var loadingBar = game.add.sprite(game.world.centerX-(387/2), 400, "loading");
    // my logo was too big, so i use scale to set it down, not optimal but it works for now, plus later on
    // I am going to show you a neet trick with scale, although really in production you should never do this, especially
    // for a splash screen!
    //myLogo.scale.setTo(0.5);
    // add text that says its loading
    var status = game.add.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    this.load.setPreloadSprite(loadingBar);
  }
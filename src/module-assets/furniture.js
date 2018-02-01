import 'phaser';

export default function (game, spriteName, posX=0, posY=0,scaleX=0.5,scaleY=0.5, rotation = 0) {
  const sprite = game.add.sprite(posX, posY, spriteName);
  game.physics.enable(sprite, Phaser.Physics.ARCADE);
  sprite.body.collideWorldBounds = true;
  sprite.body.checkCollision.up = true;
  sprite.body.checkCollision.right = true;
  sprite.body.checkCollision.down = true;
  sprite.body.checkCollision.left = true;
  sprite.body.immovable = true;
  sprite.scale.setTo(scaleX,scaleY);
  sprite.rotation = rotation;
  return sprite;
}

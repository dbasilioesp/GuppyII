import 'phaser-ce'

export class Player extends Phaser.Sprite {

  constructor(game, position) {
    super(game, position.x, position.y, 'submarine', 'Sub-01.png')

    this.game.physics.arcade.enable(this);
    this.body.allowGravity = true;
    this.anchor.set(0.5, 0.5);
  }

}

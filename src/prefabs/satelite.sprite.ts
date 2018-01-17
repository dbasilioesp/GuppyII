import 'phaser-ce'

export class Satelite extends Phaser.Sprite {

  constructor(game, position) {
    super(game, position.x, position.y, 'satelite')

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.allowGravity = false;
    this.anchor.set(0.5, 0.5);

    let frames = Phaser.Animation.generateFrameNames('coin', 1, 3, '.png', 1)
    this.animations.add('idle', frames, 2, true, false);
    this.animations.play('idle');
  }

}

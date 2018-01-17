import 'phaser-ce'

export class PlayersGroup extends Phaser.Group {

  constructor(game) {
    super(game)
  }

  public overlapSatelites (satelites: Phaser.Group) {
    this.game.physics.arcade.overlap(this, satelites, this.catchSatelite, null, this);
  }

  private catchSatelite (player, satelite) {
    satelite.kill()
  }

}

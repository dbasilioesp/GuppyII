import 'phaser'


class TitleState extends Phaser.State {

  private params

  public init (params) {
    this.params = params
  }

  public create (): void {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    this.game.add.sprite(0, 0, 'background_title');
    this.game.add.button(gameWidth - 220, gameHeight - 130, 'start_button', this.changeToMapState, this);
    this.game.add.button(gameWidth - 220, gameHeight - 85, 'credits_button', this.changeToCreditsState, this);
  }

  private changeToMapState (): void {
    this.game.state.start("map", true, false, this.params);
  }

  private changeToCreditsState (): void {
    this.game.state.start('credits', true, false, this.params);
  }

}

export default TitleState

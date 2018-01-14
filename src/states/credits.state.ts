import 'phaser'


class CreditsState extends Phaser.State {

  private params

  public init (params) {
    this.params = params
  }

  public create (): void {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    this.game.add.sprite(0, 0, 'background_credits');

    this.game.add.button(this.game.world.width - 80, this.game.world.height - 70, 'sair_button', this.changeToTitleState, this);
  }

  private changeToTitleState (): void {
    this.game.state.start("title", true, false, this.params);
  }
}

export default CreditsState

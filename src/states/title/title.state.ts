import 'phaser'


class TitleState extends Phaser.State {

  private levelData
  private params

  public init (levelData: object, params: any) {
    this.levelData = levelData
    this.params = params
  }

  public create (): void {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    this.game.add.sprite(0, 0, 'background');
    this.game.add.button(gameWidth - 220, gameHeight - 130, 'start_button', this.changeToMapState, this);
    this.game.add.button(gameWidth - 220, gameHeight - 85, 'credits_button', this.changeToCreditsState, this);
  }

  private changeToMapState (): void {
    this.game.state.start("loadfile", true, false, 'map', 'map.json', this.params);
  }

  private changeToCreditsState (): void {
    this.game.state.start('loadfile', true, false, 'credits', 'credits.json', this.params);
  }

}

export default TitleState

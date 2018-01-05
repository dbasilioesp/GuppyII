import 'phaser-ce'

export default class LevelFileState extends Phaser.State {

  private nextState
  private levelFile
  private params

  public init (nextState: string, levelFile: string, params: any) {
    this.nextState = nextState
    this.levelFile = levelFile
    this.params = params
  }

  public preload () {
    this.load.text('level', `levels/${this.levelFile}`)
  }

  public create () {
    const text = this.game.cache.getText('level')
    const data = JSON.parse(text)
    this.game.state.start('loadsprites', true, false, data, this.nextState, this.params)
  }

}

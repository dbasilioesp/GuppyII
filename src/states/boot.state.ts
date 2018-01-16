import 'phaser-ce'
import config from '../config'

class BootState extends Phaser.State {

  public init (): void {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  public create (): void {
    const firstState = config.level.firstState
    const params = { nextLevel: config.level.nextLevel }
    this.game.state.start("loading", true, false, firstState, params);
    this.configSound()
  }

  private configSound (): void {
    this.game.sound.mute = !config.sound.active;
  }

}

export default BootState

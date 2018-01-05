import 'phaser'


class BootState extends Phaser.State {

  public init (): void {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  public create (): void {
    const nextState = 'map'
    const levelFile = 'map.json'
    const params = { nextLevel: 1 }
    this.game.state.start("loadfile", true, false, nextState, levelFile, params);
  }

}

export default BootState

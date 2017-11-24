import 'phaser'


class BootState extends Phaser.State {

  public init (): void {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  public create (): void {
    this.game.state.start("title", true, false);
  }

}

export default BootState

import 'phaser'

let imgCapa = require('assets/images/capa.png')


class TitleState extends Phaser.State {

  public init (): void {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  public preload (): void {
    this.load.image('background', imgCapa);
  }

  public create (): void {
    this.game.add.sprite(0, 0, 'background');
  }

}

export default TitleState

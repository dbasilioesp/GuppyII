import 'phaser'

let imgCapa = require('assets/images/capa.png')


class Title extends Phaser.State {

  public preload (): void {
    this.load.image('background', imgCapa);
  }

  public create (): void {
    this.game.add.sprite(0, 0, 'background');
  }

}

export default Title

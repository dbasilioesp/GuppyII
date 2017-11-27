import 'phaser'

const imgBackground = require('assets/images/underwater_temple_by_unidcolor-d3cm0fr.jpg')

class MapState extends Phaser.State {

  public preload (): void {
    this.load.image('background', imgBackground);
  }

  public create (): void {
    this.game.add.sprite(0, 0, 'background');
  }

}

export default MapState
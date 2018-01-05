import 'p2'
import 'pixi'
import 'phaser'

import BootState from './states/boot/boot.state'
import LoadFileState from './states/boot/loadfile.state'
import LoadSpritesState from './states/boot/loadsprites.state'
import TitleState from './states/title/title.state'
import MapState from './states/map/map.state'
import PlayState from './states/play/play.state'

class App extends Phaser.Game {

  constructor(config: Phaser.IGameConfig) {
    super(config)
    this.state.add('boot', BootState)
    this.state.add('loadfile', LoadFileState)
    this.state.add('loadsprites', LoadSpritesState)
    this.state.add('title', TitleState)
    this.state.add('map', MapState)
    this.state.add('play', PlayState)
    this.state.start('boot')
  }

}

function startApp (): void {

  let gameWidth: number = 800;
  let gameHeight: number = 600;

  let gameConfig: Phaser.IGameConfig = {
    width: gameWidth,
    height: gameHeight,
    renderer: Phaser.AUTO,
    parent: '',
    resolution: 1
  };

  new App(gameConfig);

}

window.onload = () => {

  startApp()

}

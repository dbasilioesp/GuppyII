import 'p2'
import 'pixi'
import 'phaser'

import BootState from './states/boot.state'
import LoadingState from './states/loading.state'
import TitleState from './states/title.state'
import CreditsState from './states/credits.state'
import MapState from './states/map.state'
import PlayState from './states/play.state'
import SandboxState from './states/sandbox.state'

class App extends Phaser.Game {

  constructor(config: Phaser.IGameConfig) {
    super(config)
    this.state.add('boot', BootState)
    this.state.add('loading', LoadingState)
    this.state.add('title', TitleState)
    this.state.add('credits', CreditsState)
    this.state.add('map', MapState)
    this.state.add('play', PlayState)
    this.state.add('sandbox', SandboxState)
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

import 'p2'
import 'pixi'
import 'phaser'

import Title from './states/title'

class App extends Phaser.Game {

  constructor(config: Phaser.IGameConfig) {
    super(config)

    this.state.add('title', Title)

    this.state.start('title')
  }

}

function startApp(): void {

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

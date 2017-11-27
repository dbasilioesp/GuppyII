import 'phaser'

let imgBackground = require('assets/images/capa.png')
let imgStartButton = require('assets/images/start_games.png')
let imgCreditsButton = require('assets/images/credits.png')


class TitleState extends Phaser.State {

  public init (): void {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  public preload (): void {
    this.load.image('background', imgBackground)
    this.load.image('start_button', imgStartButton)
    this.load.image('credits_button', imgCreditsButton)
  }

  public create (): void {
    const gameWidth = this.game.world.width
    const gameHeight = this.game.world.height

    this.game.add.sprite(0, 0, 'background');
    this.game.add.button(gameWidth - 220, gameHeight - 130, 'start_button', this.changeToMapState, this);
    this.game.add.button(gameWidth - 220, gameHeight - 85, 'credits_button', this.changeToCreditsState, this);
  }

  private changeToMapState (): void {
    this.game.state.start("map", true, false);
  }

  private changeToCreditsState (): void {
    this.game.state.start('credits', true, false);
  }

}

export default TitleState

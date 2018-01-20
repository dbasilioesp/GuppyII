import 'phaser-ce'


export class Pause {

  private game: Phaser.Game
  private keyPause
  private menu: Phaser.Group

  constructor(game) {
    this.game = game

    this.createMenu()

    this.keyPause = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.keyPause.onDown.add(this.pauseGame, this);
  }

  private createMenu () {
    let w = this.game.width
    let h = this.game.height

    let fade = this.game.add.graphics(0, 0)
    fade.beginFill(0x000000)
    fade.drawRect(0, 0, this.game.width, this.game.height)
    fade.alpha = 0.5

    let continueOption: Phaser.Text = this.game.add.text(w / 2, h / 2 - 50, 'Continuar', { font: '30px Arial', fill: '#fff' })
    continueOption.anchor.setTo(0.5, 0.5)
    continueOption.inputEnabled = true
    continueOption.events.onInputDown.add(this.pauseGame, this)

    let exitOption = this.game.add.text(w / 2, h / 2 - 0, 'Sair', { font: '30px Arial', fill: '#fff' })
    exitOption.anchor.setTo(0.5, 0.5)
    exitOption.inputEnabled = true
    exitOption.events.onInputDown.add(this.exitGame, this)

    this.menu = this.game.add.group()
    this.menu.add(fade)
    this.menu.add(continueOption)
    this.menu.add(exitOption)
    this.menu.alpha = 0
    this.menu.visible = false
    this.menu.fixedToCamera = true
  }

  private pauseGame () {
    this.game.paused = !this.game.paused
    this.menu.alpha = this.menu.alpha ? 0 : 1
    this.menu.visible = !this.menu.visible
  }

  private exitGame () {
    this.game.paused = false
    this.game.state.start('boot', false, true)
  }

}

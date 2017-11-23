import 'phaser'

class Title extends Phaser.State {

  public init(): void {
    const centerX = this.game.world.centerX
    const centerY = this.game.world.centerY

    const style = { font: "65px Georgia", fill: "#ff0044", align: "center" };

    const text = this.game.add.text(centerX, centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);

    text.anchor.set(0.5);

  }

}

export default Title

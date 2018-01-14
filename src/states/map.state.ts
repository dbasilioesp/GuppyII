import 'phaser-ce'

class MapState extends Phaser.State {

  private params
  private player
  private nextLevel
  private points: Array<Object>
  private levels = []
  private timer

  public init (params): void {
    this.params = params
    this.nextLevel = this.params.nextLevel
  }

  public create (): void {
    this.game.add.sprite(0, 0, 'background_map');
    this.setTimer()
    this.setPoints()
    this.setSubmarine()
  }

  private setTimer () {
    this.timer = this.time.create();
    this.timer.add(Phaser.Timer.SECOND * 1, this.startState, this);
  }

  private startTimer () {
    this.timer.start();
  }

  private setPoints (): void {

    this.points = [
      { x: 280, y: 350 },
      { x: 650, y: 400 }
    ];

    this.points.forEach((point: any) => {
      const level = this.game.add.graphics(0, 0);
      level.beginFill(0xFFFFFF);
      level.drawCircle(point.x, point.y, 10);
      this.levels.push(level);
    });

  }

  private setSubmarine () {
    this.player = this.game.add.sprite(0, 0, 'submarine');
    this.player.anchor.set(0.5, 0.5);

    let previousPoint
    let nextPoint

    if (this.nextLevel === 1) {
      previousPoint = this.points[0];
    } else {
      previousPoint = this.points[this.nextLevel - 2];
    }

    nextPoint = this.points[this.nextLevel - 1]

    this.player.position.set(previousPoint.x, previousPoint.y + 18);
    this.game.add.tween(this.player)
      .to({ x: nextPoint.x, y: nextPoint.y + 18 }, 2000, Phaser.Easing.Power1, true, 2000)
      .onComplete.add(this.startTimer, this);

  }

  private startState () {
    const isLastLevel = this.levels.length === this.nextLevel;
    this.params.isLastLevel = isLastLevel
    this.params.actualLevel = this.nextLevel
    this.game.state.start('play', true, false, this.params);
  }

}

export default MapState

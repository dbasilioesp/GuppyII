import 'phaser-ce'
import { TilemapFactory } from '../../libs/tilemap.factory'

export default class SandboxState extends Phaser.State {

  private levelData
  private params
  private tilemapFactory


  public init (levelData: object, params: any) {
    this.levelData = levelData
    this.params = params

    this.game.stage.backgroundColor = 0x000000;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;
  }

  public create () {
    this.setTilemap()
  }

  private setTilemap () {
    let map = this.levelData.map
    this.tilemapFactory = new TilemapFactory(this.game)
    this.tilemapFactory.build(map.key, map.tilesets)
  }

}

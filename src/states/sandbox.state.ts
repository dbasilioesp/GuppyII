import 'phaser-ce'
import { maps } from '../schemes/tiles'
import { TilemapFactory } from '../libs/tilemap.factory'

export default class SandboxState extends Phaser.State {

  private data
  private params
  private tilemapFactory

  public init (data, params) {
    this.data = data
    this.params = params

    this.game.stage.backgroundColor = 0xFFFFFF;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;
  }

  public create () {
    this.setTilemap()
  }

  private setTilemap () {
    let map = maps.sandbox
    this.tilemapFactory = new TilemapFactory(this.game)
    this.tilemapFactory.build(map.key, map.tilesets)
  }

}

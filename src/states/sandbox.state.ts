import 'phaser-ce'
import { maps } from '../schemes/tiles'
import { TilemapManager } from '../libs/tilemap.manager'

export default class SandboxState extends Phaser.State {

  private data
  private params
  private tilemapManager

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
    this.tilemapManager = new TilemapManager(this.game)
    this.tilemapManager.build(map.key, map.tilesets)
  }

}

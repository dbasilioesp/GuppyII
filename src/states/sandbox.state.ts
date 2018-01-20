import 'phaser-ce'
import { maps } from '../schemes/tiles'
import { TilemapManager } from '../libs/tilemap.manager'
import { Pause } from '../prefabs/pause'

export default class SandboxState extends Phaser.State {

  private data
  private params
  private tilemapManager
  private pause: Pause

  public init (data, params) {
    this.data = data
    this.params = params

    this.game.stage.backgroundColor = 0xFFFFFF;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;
  }

  public create () {
    // this.setTilemap()

    let ambientMusic = this.game.add.audio('banks_music', 1, true);
    ambientMusic.play();

    this.pause = new Pause(this.game)

  }

  private setTilemap () {
    let map = maps.sandbox
    this.tilemapManager = new TilemapManager(this.game)
    this.tilemapManager.build(map.key, map.tilesets)
  }

}

import 'phaser-ce'
import { TilemapFactory } from '../libs/tilemap.factory'

export default class PlayState extends Phaser.State {

  private params
  private actualLevel
  private map
  private mask
  private layers
  private ambientMusic
  private sonarMusic
  private explosionSound
  private coinSound
  private tilemapFactory

  public init (params) {
    this.params = params
    this.actualLevel = this.params.actualLevel

    this.game.stage.backgroundColor = 0x000000;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;
  }

  public create () {
    this.setMask()
    this.setTilemap()
    this.setSound()
  }

  private setMask () {
    this.mask = this.game.add.graphics(0, 0);
    this.mask.beginFill(0xffffff);
    this.mask = this.mask.drawCircle(0, 0, 60);
    this.mask.width = 800;
    this.mask.height = 800;
  }

  private setSound () {
    this.ambientMusic = this.game.add.audio('banks_music', 1, true);
    this.sonarMusic = this.game.add.audio('sonar_music', 0.7, true);

    this.ambientMusic.play();
    this.sonarMusic.play();

    this.explosionSound = this.game.add.audio('explosion_sound', 0.7);
    this.coinSound = this.game.add.audio('coin_sound', 0.7);
  }


  private setTilemap () {
    let data = this.params.data
    let map = data.maps["level01"]
    console.log(map)
    this.tilemapFactory = new TilemapFactory(this.game)
    this.tilemapFactory.build(map.key, map.tilesets)
  }

}

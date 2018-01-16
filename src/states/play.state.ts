import 'phaser-ce'
import { maps } from '../schemes/tiles'
import { TilemapFactory } from '../libs/tilemap.factory'
import { Satelite } from '../prefabs/satelite.prefab'
import { Player } from '../prefabs/player.prefab'

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

  private satelites: Phaser.Group
  private players: Phaser.Group

  public init (params) {
    this.params = params
    this.actualLevel = this.params.actualLevel

    this.game.stage.backgroundColor = 0x000000;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;

    let level = maps['level_' + this.actualLevel]
    this.tilemapFactory = new TilemapFactory(this.game)
    this.tilemapFactory.build(level.key, level.tilesets)
  }

  public create () {
    this.setGroups()
    this.setMask()
    this.setSound()

    this.tilemapFactory.addPrefab('satelites', this.createSatelites, this)
    this.tilemapFactory.addPrefab('player', this.createPlayer, this)
    this.tilemapFactory.addCollider(this.players, null, this)
  }

  public update () {
    this.tilemapFactory.mapCollisions()
  }

  private setGroups () {
    this.satelites = this.game.add.group();
    this.players = this.game.add.group();
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

  private createSatelites (object) {
    let position = this.tilemapFactory.objectPosition(object);
    let satelite = new Satelite(this.game, position)
    satelite.mask = this.mask
    this.satelites.add(satelite)
  }

  private createPlayer (object) {
    let position = this.tilemapFactory.objectPosition(object);
    let player = new Player(this.game, position)
    player.mask = this.mask
    this.players.add(player)
  }

}

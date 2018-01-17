import 'phaser-ce'
import { maps } from '../schemes/tiles'
import { TilemapManager } from '../libs/tilemap.manager'
import { Satelite } from '../prefabs/satelite.sprite'
import { Player } from '../prefabs/player.sprite'
import { PlayersGroup } from '../prefabs/players.group'

export default class PlayState extends Phaser.State {

  private params
  private actualLevel
  private mask
  private ambientMusic
  private sonarMusic
  private explosionSound
  private coinSound

  private tilemapManager: TilemapManager
  private satelites: Phaser.Group
  private players: PlayersGroup

  public init (params) {
    this.params = params
    this.actualLevel = this.params.actualLevel

    this.game.stage.backgroundColor = 0x000000;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;

    let level = maps['level_' + this.actualLevel]
    this.tilemapManager = new TilemapManager(this.game)
    this.tilemapManager.build(level.key, level.tilesets)
  }

  public create () {
    this.setGroups()
    this.setMask()
    this.setSound()

    this.tilemapManager.addPrefab('player', this.createPlayer, this)
    this.tilemapManager.addPrefab('satelites', this.createSatelites, this)
    this.tilemapManager.addCollider(this.players, null, this)
  }

  public update () {
    this.tilemapManager.mapCollisions()
    this.players.overlapSatelites(this.satelites)
  }

  private setGroups () {
    this.satelites = this.game.add.group();
    this.players = new PlayersGroup(this.game);
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
    let position = this.tilemapManager.objectPosition(object);
    let satelite = new Satelite(this.game, position)
    satelite.mask = this.mask
    this.satelites.add(satelite)
  }

  private createPlayer (object) {
    let position = this.tilemapManager.objectPosition(object);
    let player = new Player(this.game, position)
    player.mask = this.mask
    this.players.add(player)
  }

}

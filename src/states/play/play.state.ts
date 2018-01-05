import 'phaser-ce'

export default class PlayState extends Phaser.State {

  private levelData
  private params
  private actualLevel
  private map
  private mask
  private layers
  private ambientMusic
  private sonarMusic
  private explosionSound
  private coinSound

  public init (levelData: object, params: any) {
    this.levelData = levelData
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
    // this.bossMusic = this.game.add.audio('boss_music', 1, true);
    this.sonarMusic = this.game.add.audio('sonar_music', 0.7, true);

    this.ambientMusic.play();
    this.sonarMusic.play();

    this.explosionSound = this.game.add.audio('explosion_sound', 0.7);
    this.coinSound = this.game.add.audio('coin_sound', 0.7);
  }


  private setTilemap () {

    // create map and set tileset
    this.map = this.game.add.tilemap(this.levelData.map.key);
    let tilesetIndex = 0;
    this.map.tilesets.forEach(function (tileset) {
      this.map.addTilesetImage(tileset.name, this.levelData.map.tilesets[tilesetIndex]);
      tilesetIndex += 1;
    }, this);

    this.layers = {};
    this.map.layers.forEach(function (layer) {
      this.layers[layer.name] = this.map.createLayer(layer.name);
      this.layers[layer.name].mask = this.mask;
      if (layer.properties.collision) { // collision layer
        this.map.setCollisionByExclusion([-1], true, layer.name);
      }
    }, this);

    this.layers[this.map.layer.name].resizeWorld();

  }

}

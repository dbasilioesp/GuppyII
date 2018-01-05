import 'phaser-ce'


export default class LoadSpritesState extends Phaser.State {

  private levelData
  private nextState
  private params

  public init (levelData, nextState, params) {
    this.levelData = levelData
    this.nextState = nextState
    this.params = params
  }

  public preload () {
    let asset
    const assets = this.levelData.assets;

    for (let assetKey in assets) { // load assets according to asset key
      if (assets.hasOwnProperty(assetKey)) {
        asset = assets[assetKey];
        switch (asset.type) {
          case "image":
            this.load.image(assetKey, asset.source);
            break;
          case "spritesheet":
            this.load.spritesheet(assetKey, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
            break;
          case "tilemap":
            this.load.tilemap(assetKey, asset.source, null, Phaser.Tilemap.TILED_JSON);
            break;
          case "atlasJSONHash":
            this.load.atlasJSONHash(assetKey, asset.source, asset.texture);
            break;
          case "audio":
            this.load.audio(assetKey, asset.source);
            break;
          default: break;
        }

      }
    }

  }

  public create () {

    this.game.state.start(this.nextState, true, false, this.levelData, this.params)

  }

}

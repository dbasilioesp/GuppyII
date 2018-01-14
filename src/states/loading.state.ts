import 'phaser-ce'

export default class LoadingState extends Phaser.State {

  private data
  private nextState
  private params
  private progressText

  public init (nextState, params) {
    this.nextState = nextState
    this.params = params
    this.data = this.params.data
    this.game.stage.backgroundColor = 0xffffff
  }

  public create () {
    this.loadAssets(this.data.assets)
    this.setProgress()
  }

  private loadAssets (assets) {
    for (let assetKey in assets) {
      if (assets.hasOwnProperty(assetKey)) {
        let asset = assets[assetKey];
        switch (asset.type) {
          case "image":
            this.load.image(assetKey, asset.source);
            break;
          case "spritesheet":
            this.load.spritesheet(assetKey, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing)
            break;
          case "tilemap":
            this.load.tilemap(assetKey, asset.source, null, Phaser.Tilemap.TILED_JSON)
            break;
          case "atlasJSONHash":
            this.load.atlasJSONHash(assetKey, asset.source, asset.texture)
            break;
          case "audio":
            this.load.audio(assetKey, asset.source)
            break;
          default: break;
        }
      }
    }
  }

  private setProgress () {
    this.progressText = this.game.add.text(this.game.world.centerX - 30, this.game.world.centerY, '0%', { fill: '#000000' })
    this.game.load.onFileComplete.add(this.loadProgress, this)
    this.game.load.onLoadComplete.add(this.loadComplete, this)
    this.game.load.start()
  }

  private loadProgress (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.progressText.setText(progress + "%")
  }

  private loadComplete () {
    this.game.state.start(this.nextState, true, false, this.params)
  }

}

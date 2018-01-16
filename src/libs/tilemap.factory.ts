import 'phaser-ce'

export class TilemapFactory {

  private game: Phaser.Game
  public map
  public layers = {}

  constructor(game) {
    this.game = game
  }

  public build (mapKey, tilesets) {

    let tilesetIndex = 0;

    this.map = this.game.add.tilemap(mapKey);

    this.map.tilesets.forEach(function (tileset) {
      this.map.addTilesetImage(tileset.name, tilesets[tilesetIndex]);
      tilesetIndex += 1;
    }, this);

    this.map.layers.forEach(function (layer) {
      this.layers[layer.name] = this.map.createLayer(layer.name);
      if (layer.properties.collision) {
        this.map.setCollisionByExclusion([-1], true, layer.name);
      }
    }, this);

    this.layers[this.map.layer.name].resizeWorld();

    this.setPrefabs(this.map.objects)

  }

  private setPrefabs (objects) {

    for (let objectKey in objects) {
      if (this.map.objects.hasOwnProperty(objectKey)) {
        // create layer objects
        if (objectKey === 'satelites') {
          // this.map.objects[objectLayer].forEach(this.createSatelites, this);
        }

        if (objectKey === 'player') {
          // this.createPlayer(this.map.objects[objectLayer][0]);
        }

        if (objectKey === 'minas') {
          // this.map.objects[objectLayer].forEach(this.createMines, this);
        }

        if (objectKey === 'boss') {
          // this.createBoss(this.map.objects[objectLayer][0]);
        }

        if (objectKey === 'final') {
          // this.createFinal(this.map.objects[objectLayer][0]);
        }

        if (objectKey === 'lives') {
          // this.map.objects[objectLayer].forEach(this.createLive, this);
        }
      }
    }

  }

}

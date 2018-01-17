import 'phaser-ce'
import * as _ from 'lodash'

export class TilemapManager {

  private game: Phaser.Game
  public map
  public layers = {}
  private colliders = []
  private prefabs = []

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
  }

  public addCollider (object, callback, state) {
    this.colliders.push({ object: object, callback: callback, state: state })
  }

  public mapCollisions () {

    this.map.layers.forEach(function (layer) {
      if (layer.properties.collision) {

        _.forEach(this.colliders, (collider) => {
          if (collider.callback) {
            this.game.physics.arcade.collide(collider.object, this.layers[layer.name], collider.callback, null, collider.state);
          } else {
            this.game.physics.arcade.collide(collider.object, this.layers[layer.name]);
          }
        })

      }
    }, this);

  }

  public addPrefab (prefabKey, callback, state) {
    let objects = this.map.objects
    let objectsArray = _.get(objects, prefabKey)

    if (objectsArray) {
      objectsArray.forEach(callback, state);
    }
  }

  public objectPosition (object) {
    let objectY
    let position

    // tiled coordinates starts in the bottom left corner
    objectY = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
    position = {
      x: object.x + (this.map.tileHeight / 2),
      y: objectY
    }

    return position
  }

}

export const tiles = {
  tilemap_level_01: {
    type: 'tilemap',
    source: 'assets/maps/level-01.json'
  },
  tileset_submarine: {
    type: 'image',
    source: 'assets/images/submarine-tiles.png'
  },
  tilemap_sandbox: {
    type: 'tilemap',
    source: 'assets/maps/sandbox/sandbox.json'
  },
  tileset_sandbox: {
    type: 'image',
    source: 'assets/maps/sandbox/tileset-sandbox.jpg'
  }
}

export const maps = {
  level01: {
    key: 'tilemap_level_01',
    tilesets: [
      'tileset_submarine'
    ]
  },
  sandbox: {
    key: 'tilemap_sandbox',
    tilesets: [
      'tileset_sandbox'
    ]
  }
}

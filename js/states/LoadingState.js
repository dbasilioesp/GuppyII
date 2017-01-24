var GameJam17 = GameJam17 || {};

GameJam17.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

GameJam17.LoadingState.prototype = Object.create(Phaser.State.prototype);
GameJam17.LoadingState.prototype.constructor = GameJam17.LoadingState;

GameJam17.LoadingState.prototype.init = function (level_data, next_state, extra_parameters) {
    "use strict";
    this.level_data = level_data;
    this.next_state = next_state;
    this.extra_parameters = extra_parameters;
};

GameJam17.LoadingState.prototype.preload = function () {
    "use strict";
    var assets, asset_loader, asset_key, asset;
    assets = this.level_data.assets;
    for (asset_key in assets) { // load assets according to asset key
        if (assets.hasOwnProperty(asset_key)) {
            asset = assets[asset_key];
            switch (asset.type) {
            case "image":
                this.load.image(asset_key, asset.source);
                break;
            case "spritesheet":
                this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
                break;
            case "tilemap":
                this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
                break;
            case "atlasJSONHash":
                this.load.atlasJSONHash(asset_key, asset.source, asset.texture);
                break;
            case "audio":
                this.load.audio(asset_key, asset.source);
                break;
            }

        }
    }
    
    if (this.level_data.user_input) {
        this.load.text("user_input", this.level_data.user_input);
    }
};

GameJam17.LoadingState.prototype.create = function () {
    "use strict";

    this.timer = null;
    this.loadingText = this.game.add.text(32, 32, 'Loading...', { fill: '#ffffff' });

    if (this.extra_parameters && this.extra_parameters.show_loading) {
        
        this.game.load.onLoadComplete.add(this.loadComplete, this);
        this.game.load.start();

    } else {
        this.startState();
    }

};


GameJam17.LoadingState.prototype.loadComplete = function() {

    this.timer = this.time.create();
    this.timer.add(Phaser.Timer.SECOND * 3, this.fadeScreenToStart, this);
    this.timer.start();

};

GameJam17.LoadingState.prototype.fadeScreenToStart = function() {

    this.game.add.tween(this.loadingText)
        .to({alpha: 0}, 500, Phaser.Linear, true)
        .onComplete.add(function(){
            this.startState();
        }, this);

};


GameJam17.LoadingState.prototype.startState = function () {

    this.game.state.start(this.next_state, true, false, this.level_data, this.extra_parameters);

};
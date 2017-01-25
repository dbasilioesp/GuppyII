var GameJam17 = GameJam17 || {};

GameJam17.TitleState = function () {
	"use strict";
	GameJam17.GameState.call(this);
};

GameJam17.TitleState.prototype = Object.create(GameJam17.GameState.prototype);
GameJam17.TitleState.prototype.constructor = GameJam17.TitleState;

GameJam17.TitleState.prototype.init = function (level_data) {
	"use strict";
	this.level_data = level_data;
	this.game.stage.backgroundColor = 0x000000;

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
};

GameJam17.TitleState.prototype.create = function () {

	this.game.add.sprite(0, 0, 'background');

	this.ambientMusic = this.game.add.audio('aitua_music', 1, true);
	this.ambientMusic.play();

	this.game.add.button(this.game.world.width - 220, this.game.world.height - 130, 'start_button', this.mapState, this);
	this.game.add.button(this.game.world.width - 220, this.game.world.height - 85, 'credits_button', this.creditsState, this);

	this.fadeIn();
};

GameJam17.TitleState.prototype.mapState = function () {
	this.fadeOut(500, function(){
		this.ambientMusic.stop();
		this.ambientMusic.destroy(true);
		this.game.cache.removeSound('aitua_music');
		this.game.state.start("BootState", true, false, "assets/levels/map.json", "MapState", {nextLevel: 1});
	}, this);
};

GameJam17.TitleState.prototype.creditsState = function () {
	this.fadeOut(500, function(){
		this.game.state.start("BootState", true, false, "assets/levels/credits.json", "CreditsState");
	}, this);
};
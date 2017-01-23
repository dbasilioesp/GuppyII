var GameJam17 = GameJam17 || {};

GameJam17.TitleState = function () {
	"use strict";
	Phaser.State.call(this);
};

GameJam17.TitleState.prototype = Object.create(Phaser.State.prototype);
GameJam17.TitleState.prototype.constructor = GameJam17.TitleState;

GameJam17.TitleState.prototype.init = function (level_data) {
	"use strict";
	this.level_data = level_data;
	this.game.stage.backgroundColor = 0x000000;

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
};

GameJam17.TitleState.prototype.create = function () {

	this.game.add.sprite(0, 0, 'background');

	this.game.add.button(this.game.world.width - 220, this.game.world.height - 130, 'start_button', this.startGame, this);
	this.game.add.button(this.game.world.width - 220, this.game.world.height - 85, 'credits_button', this.credits, this);

	this.ambientMusic = this.game.add.audio('ambient_music', 1, true);
	this.ambientMusic.play();

};


GameJam17.TitleState.prototype.startGame = function () {
	this.ambientMusic.stop();
	this.game.state.start("BootState", true, false, "assets/levels/level1.json", "SubmarineState");
};

GameJam17.TitleState.prototype.credits = function () {
	this.ambientMusic.stop();
	this.game.state.start("BootState", true, false, "assets/levels/credits.json", "CreditsState");
};
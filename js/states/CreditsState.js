var GameJam17 = GameJam17 || {};

GameJam17.CreditsState = function () {
	"use strict";
	Phaser.State.call(this);
};

GameJam17.CreditsState.prototype = Object.create(Phaser.State.prototype);
GameJam17.CreditsState.prototype.constructor = GameJam17.CreditsState;

GameJam17.CreditsState.prototype.init = function (level_data) {
	"use strict";
	this.level_data = level_data;
	this.game.stage.backgroundColor = 0x000000;

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
};

GameJam17.CreditsState.prototype.create = function () {

	this.game.add.sprite(0, 0, 'background');
	this.game.add.button(this.game.world.width - 80, this.game.world.height - 70, 'sair_button', this.titleScreen, this);	
};


GameJam17.CreditsState.prototype.titleScreen = function () {
	this.game.state.start("BootState", true, false, "assets/levels/title.json", "TitleState");
};
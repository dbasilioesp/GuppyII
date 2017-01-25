var GameJam17 = GameJam17 || {};

GameJam17.WinState = function () {
	"use strict";
	GameJam17.GameState.call(this);
};

GameJam17.WinState.prototype = Object.create(GameJam17.GameState.prototype);
GameJam17.WinState.prototype.constructor = GameJam17.WinState;

GameJam17.WinState.prototype.init = function (level_data) {
	"use strict";
	this.level_data = level_data;
	this.game.stage.backgroundColor = 0x000000;

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
};

GameJam17.WinState.prototype.create = function () {

	this.game.add.sprite(0, 0, 'background');
	this.fadeIn();
	
};
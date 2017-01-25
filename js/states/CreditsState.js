var GameJam17 = GameJam17 || {};

GameJam17.CreditsState = function () {
	"use strict";
	GameJam17.GameState.call(this);
};

GameJam17.CreditsState.prototype = Object.create(GameJam17.GameState.prototype);
GameJam17.CreditsState.prototype.constructor = GameJam17.CreditsState;

GameJam17.CreditsState.prototype.init = function (level_data) {
	"use strict";
	this.level_data = level_data;
	this.game.stage.backgroundColor = 0x000000;
};

GameJam17.CreditsState.prototype.create = function () {
	this.game.add.sprite(0, 0, 'background');
	this.game.add.button(this.game.world.width - 80, this.game.world.height - 70, 'sair_button', this.titleState, this);	

	this.fadeOut();
};

GameJam17.CreditsState.prototype.titleState = function () {
	this.fadeIn(300, function(){
		this.game.state.start("BootState", true, false, "assets/levels/title.json", "TitleState");
	}, this);
};
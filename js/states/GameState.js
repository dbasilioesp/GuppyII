var GameJam17 = GameJam17 || {};

GameJam17.GameState = function () {
	"use strict";
	Phaser.State.call(this);
};

GameJam17.GameState.prototype = Object.create(Phaser.State.prototype);
GameJam17.GameState.prototype.constructor = GameJam17.GameState;

GameJam17.GameState.prototype.fadeIn = function (duration, functionCall, context, delay) {

	context = context || this;
	duration = duration || 500;
	delay = delay || 0;

	this.preloadFade = this.game.add.graphics(0, 0);
	this.preloadFade.beginFill(0x000000);
	this.preloadFade.drawRect(0, 0, this.game.width, this.game.height);

	this.game.add.tween(this.preloadFade)
		.to({alpha: 0}, duration, Phaser.Linear, true, delay)
		.onComplete.add(function(){
			this.preloadFade.destroy();

			if (functionCall) {
				functionCall.call(context);
			}

		}, this);

};

GameJam17.GameState.prototype.fadeOut = function (duration, functionCall, context, delay) {

	context = context || this;
	duration = duration || 500;
	delay = delay || 0;

	this.preloadFade = this.game.add.graphics(0, 0);
	this.preloadFade.beginFill(0x000000);
	this.preloadFade.drawRect(0, 0, this.game.width, this.game.height);
	this.preloadFade.alpha = 0;

	this.game.add.tween(this.preloadFade)
		.to({alpha: 1}, duration, Phaser.Linear, true, delay)
		.onComplete.add(function(){
			
			if (functionCall) {
				functionCall.call(context);
			}
			
		}, this);
};
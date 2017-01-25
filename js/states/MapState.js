var GameJam17 = GameJam17 || {};

GameJam17.MapState = function () {
	"use strict";
	GameJam17.GameState.call(this);
};

GameJam17.MapState.prototype = Object.create(GameJam17.GameState.prototype);
GameJam17.MapState.prototype.constructor = GameJam17.MapState;

GameJam17.MapState.prototype.init = function (level_data, extra_parameters) {
	"use strict";
	this.level_data = level_data;
	this.extra_parameters = extra_parameters;
	this.game.stage.backgroundColor = 0x0288D1;

	// tempoarary
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;

	this.nextLevel = this.extra_parameters.nextLevel;
	this.previousLevel = this.nextLevel - 1;
	this.isFirstLevel = this.extra_parameters.isFirstLevel;

};

GameJam17.MapState.prototype.create = function (level_data) {
	
	var point;
	
	this.levels = [];
	this.timer = this.time.create();
	this.timer.add(Phaser.Timer.SECOND * 2, this.startState, this);

	this.points = [
		{x: 100, y: 450},
		{x: 280, y: 280}
		// {x: 500, y: 250},
		// {x: 700, y: 450}
	];

	this.player = this.game.add.sprite(0, 0, 'submarine');

	for (var i = 0; i < this.points.length; i++) {
		var level;
		point = this.points[i];
		
		level = this.game.add.graphics(0, 0);
		level.beginFill(0xFFFFFF);
		level.drawCircle(point.x, point.y, 10);

		this.levels[i] = level;
	}

	
	var submarine, previousPoint, nextPoint;

	if (this.nextLevel === 1) {
		previousPoint = this.points[0];
	} else {
		previousPoint = this.points[this.nextLevel - 2];
	}
	
	nextPoint = this.points[this.nextLevel - 1];
	this.player.position.set(previousPoint.x - 16, previousPoint.y + 16);

	this.game.add.tween(this.player)
		.to({x: nextPoint.x - 16, y: nextPoint.y + 16}, 2000, Phaser.Easing.InOut, true, 2000)
		.onComplete.add(function(){
			this.timer.start();
		}, this);

	this.fadeIn();
};

GameJam17.MapState.prototype.startState = function () {
	var levelConfig, isLastLevel, extraParameters;

	levelConfig  = "assets/levels/level" + this.nextLevel + ".json";
	isLastLevel = this.levels.length === this.nextLevel;

	extraParameters = {
		showLoading: true,
		isLastLevel: isLastLevel,
		actualLevel: this.nextLevel
	};

	this.fadeOut(500, function(){
		this.game.state.start('BootState', true, false, levelConfig, "SubmarineState", extraParameters);
	}, this);
};
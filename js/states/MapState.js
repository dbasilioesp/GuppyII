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
	
	this.nextLevel = this.extra_parameters.nextLevel;
	this.previousLevel = this.nextLevel - 1;
	this.isFirstLevel = this.extra_parameters.isFirstLevel;

};

GameJam17.MapState.prototype.create = function (level_data) {
	
	var point;
	
	this.levels = [];
	this.timer = this.time.create();
	this.timer.add(Phaser.Timer.SECOND * 1, this.startState, this);

	this.points = [
		{x: 280, y: 350},
		{x: 650, y: 400}
	];

	this.background = this.game.add.sprite(0, 0, 'background');
	this.player = this.game.add.sprite(0, 0, 'submarine');
	this.player.anchor.set(0.5, 0.5);
	
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
	this.player.position.set(previousPoint.x, previousPoint.y + 18);

	this.game.add.tween(this.player)
		.to({x: nextPoint.x, y: nextPoint.y + 18}, 2000, Phaser.Easing.InOut, true, 2000)
		.onComplete.add(function(){
			this.timer.start();
		}, this);

	this.fadeOut();
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

	this.fadeIn(300, function(){
		this.game.state.start('BootState', true, false, levelConfig, "SubmarineState", extraParameters);
	}, this);
};
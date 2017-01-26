var GameJam17 = GameJam17 || {};

GameJam17.SubmarineState = function () {
	"use strict";
	GameJam17.GameState.call(this);
};

GameJam17.SubmarineState.prototype = Object.create(GameJam17.GameState.prototype);
GameJam17.SubmarineState.prototype.constructor = GameJam17.SubmarineState;

GameJam17.SubmarineState.prototype.init = function (level_data, extra_parameters) {
	"use strict";
	var tileset_index;
	this.level_data = level_data;
	this.extra_parameters = extra_parameters;
	this.actualLevel = this.extra_parameters.actualLevel;

	this.game.stage.backgroundColor = 0x000000;
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.gravity.y = 400;

	// create map and set tileset
	this.map = this.game.add.tilemap(level_data.map.key);
	tileset_index = 0;
	this.map.tilesets.forEach(function (tileset) {
		this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]);
		tileset_index += 1;
	}, this);
};


GameJam17.SubmarineState.prototype.create = function (level_data) {

	var centerX = this.game.world.centerX;
	var centerY = this.game.world.centerY;

	// Mask

	this.mask = this.game.add.graphics(0, 0);
	this.mask.beginFill(0xffffff);
	this.mask = this.mask.drawCircle(0, 0, 60);
	
	// Map

	this.layers = {};
	this.map.layers.forEach(function (layer) {
		this.layers[layer.name] = this.map.createLayer(layer.name);
		this.layers[layer.name].mask = this.mask;
		if (layer.properties.collision) { // collision layer
			this.map.setCollisionByExclusion([-1], true, layer.name);
		}
	}, this);

	// Groups

	this.satelites = this.game.add.group();
	this.satelites.enableBody = true;

	this.mines = this.game.add.group();
	this.mines.enableBody = true;

	this.playerBullets = this.game.add.group();
	this.playerBullets.enableBody = true;

	this.bossBullets = this.game.add.group();
	this.bossBullets.enableBody = true;

	for (object_layer in this.map.objects) {
		if (this.map.objects.hasOwnProperty(object_layer)) {
			// create layer objects
			if (object_layer === 'satelites') {
				this.map.objects[object_layer].forEach(this.createSatelites, this);
			}

			if (object_layer === 'player') {
				this.createPlayer(this.map.objects[object_layer][0]);
			}

			if (object_layer === 'minas') {
				this.map.objects[object_layer].forEach(this.createMines, this);
			}

			if (object_layer === 'boss') {
				this.createBoss(this.map.objects[object_layer][0]);
			}
		}
	}

	this.layers[this.map.layer.name].resizeWorld();

	this.life = this.game.add.sprite(15, 15, 'life');
	this.life.fixedToCamera = true;

	this.setSonar(120);

	this.ambientMusic = this.game.add.audio('banks_music', 1, true);
	this.bossMusic = this.game.add.audio('boss_music', 1, true);
	this.sonarMusic = this.game.add.audio('sonar_music', 0.7, true);

	this.ambientMusic.play();
	this.sonarMusic.play();

	this.explosionSound = this.game.add.audio('explosion_sound', 0.7);
	this.coinSound = this.game.add.audio('coin_sound', 0.7);

	// Cursors

	this.cursors = this.game.input.keyboard.createCursorKeys();

	this.wasd = {
		up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
	};

	this.fadeOut(1500);
};

GameJam17.SubmarineState.prototype.update = function () {

	this.map.layers.forEach(function (layer) {
		if (layer.properties.collision) {
			this.game.physics.arcade.collide(this.player, this.layers[layer.name]);
			this.game.physics.arcade.collide(this.playerBullets, this.layers[layer.name], this.bulletCollide, null, this);
		}
	}, this);

	this.game.physics.arcade.overlap(this.player, this.satelites, this.catchSatelite, null, this);
	this.game.physics.arcade.collide(this.player, this.mines, this.playerDie, null, this);
	this.game.physics.arcade.collide(this.player, this.bossBullets, this.playerDie, null, this);
	this.game.physics.arcade.overlap(this.boss, this.playerBullets, this.bossDie, null, this);
	this.game.physics.arcade.overlap(this.playerBullets, this.mines, this.mineCollide, null, this);
	this.game.physics.arcade.overlap(this.playerBullets, this.bossBullets, this.bulletsCollide, null, this);

	if (this.cursors.left.isDown || this.wasd.left.isDown) {
		
		this.player.body.acceleration.set(-50, 0);

		if (this.player.facing === 'right') {
			this.player.facing = 'turning-left';
			this.player.animations.play('turn');
		}

	} else if (this.cursors.right.isDown || this.wasd.right.isDown) {
		
		this.player.body.acceleration.set(50, 0);

		if (this.player.facing === 'left') {
			this.player.facing = 'turning-right';
			this.player.animations.play('turn');
		}

	} else {
		
		this.player.body.acceleration.set(0);
		
	}

	if (this.cursors.up.isDown || this.wasd.up.isDown) {
		this.player.body.acceleration.y = -(this.game.physics.arcade.gravity.y + 40);
	} else if (this.cursors.down.isDown || this.wasd.down.isDown) {
		this.player.body.velocity.y = 40;
	} else {
		this.player.body.velocity.y = 0;
	}

	if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) 
		&& this.game.time.now > this.player.bulletTimer
		&& (this.player.facing === 'left' || this.player.facing === 'right')) {

		var bullet;
		
		bullet = this.playerBullets.create(this.player.x + (20 * this.player.scale.x), this.player.y + 5, 'bullet');
		bullet.anchor.set(0.5, 0.5);
		bullet.body.allowGravity = false;
		bullet.checkWorldBounds = true;
		bullet.outOfBoundsKill = true;
		bullet.body.allowRotation = true;
		bullet.mask = this.mask;

		if (this.player.facing === 'right') {
			bullet.body.velocity.x = 20;
			bullet.body.acceleration.x = 80;
		} else if(this.player.facing === 'left') {
			bullet.body.velocity.x = -20;
			bullet.body.acceleration.x = -80;
			bullet.scale.set(-1, 1);
		}
		
		this.player.bulletTimer = this.game.time.now + 750;
	}

	if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
		
		this.map.layers.forEach(function (layer) {
			var layerObject = this.layers[layer.name];
			if (layerObject.mask) {
				layerObject.mask = null;
			} else {
				layerObject.mask = this.mask;
			}
		}, this);
	}

};

GameJam17.SubmarineState.prototype.catchSatelite = function (player, lightball) {

	var flash, flashTween;

	lightball.kill();
	this.setSonar(this.player.sonarPower + 20);
	this.coinSound.play();

	flash = this.game.add.graphics(this.player.x, this.player.y);
	flash.beginFill(0xFFFFFF);
	flash.drawCircle(0, 0, 500);
	flash.mask = this.mask;
	
	flashTween = this.game.add.tween(flash).to({alpha: 0}, 500, Phaser.Linear, true);
	flashTween.onComplete.add(function(){
		flashTween.stop();
		flash.kill();
	});
};


GameJam17.SubmarineState.prototype.setSonar = function(power) {
	power  = power >= 80 ? power : 80;
	this.player.sonarPower = power;
	
	this.player.sonarTween = this.game.add.tween(this.mask)
		.to({width: this.player.sonarPower, height: this.player.sonarPower},
			1000, Phaser.Easing.Linear.None, true, -1, -1, true);
};

GameJam17.SubmarineState.prototype.submarineFinishTurn = function () {
	this.player.scale.set(this.player.scale.x * -1, this.player.scale.y)
	this.player.animations.play('idle');

	if (this.player.facing === 'turning-left') {
		this.player.facing = 'left';
	} else if (this.player.facing === 'turning-right') {
		this.player.facing = 'right';
	}
};


GameJam17.SubmarineState.prototype.createPlayer = function (object) {
	"use strict";
	var position;
	
	position = this.objectPosition(object);

	// Player

	this.player = this.game.add.sprite(position.x, position.y, 'submarine', 'Sub-01.png');
	this.player.initial_position = position;
	this.player.anchor.set(0.5, 0.5);
	this.player.sonarPower = 0;
	this.player.isDamaged = false;
	this.player.lives = 4;
	this.player.bulletTimer = 0;

	this.game.physics.arcade.enable(this.player);
	this.player.body.drag.set(100);
	this.player.body.maxVelocity.set(100);

	this.player.anims = {};
	this.player.anims.idle = this.player.animations.add('idle', Phaser.Animation.generateFrameNames('Sub-', 1, 2, '.png', 2), 2, true, false);
	this.player.anims.turn = this.player.animations.add('turn', Phaser.Animation.generateFrameNames('Sub-', 3, 5, '.png', 2), 4, false, false);
	this.player.animations.play('idle');
	this.player.facing = 'right';

	this.player.anims.turn.onComplete.add(this.submarineFinishTurn, this);

	// Camera

	this.game.camera.follow(this.player);

	this.player.mask = this.mask;
	this.player.addChild(this.mask);

};

GameJam17.SubmarineState.prototype.createBoss = function (object) {
	"use strict";
	var position;

	position = this.objectPosition(object);

	this.boss = this.game.add.sprite(position.x, position.y, 'boss');
	this.boss.scale.set(-1, 1);
	this.boss.lives = 10;
	this.boss.injured = false;
	this.boss.rage = 2;
	this.boss.anchor.set(0.5, 0.5);

	this.game.physics.arcade.enable(this.boss);
	this.boss.body.allowGravity = false;
	this.boss.body.immovable = false;

	this.boss.animations.add('idle', [2, 1, 2, 1, 0], 1, true, true);
	this.boss.animations.play('idle');

	this.bossScheduleSpawn();
};

GameJam17.SubmarineState.prototype.bossScheduleSpawn = function (object) {

	var time;
	time = this.rnd.between(1, 3);

	this.boss.spawn_timer = this.time.create();
	this.boss.spawn_timer.add(Phaser.Timer.SECOND * time, this.bossSpawn, this);
	this.boss.spawn_timer.start();

};

GameJam17.SubmarineState.prototype.bossSpawn = function (object) {
	"use strict";
	var bullet, angle, distance;

	distance = this.game.physics.arcade.distanceBetween(this.player, this.boss);

	if (this.boss.injured) {
		bullet = this.createBossBullet(this.boss.x + 10, this.boss.y - 4);
		bullet.angle = this.game.physics.arcade.angleBetween(bullet, this.player) * 100;
		this.game.physics.arcade.velocityFromAngle(bullet.angle, 80, bullet.body.velocity);

		if (this.boss.rage >= 2) {
			this.boss.rage = 0;

			for (var i = 0; i < 5; i++) {
				bullet = this.createBossBullet(this.boss.x + 10, (this.boss.y - (this.boss.height / 2)) + (i * 15 + 5));
				bullet.body.velocity.x = 80;
			}
		}
	}
	

	this.bossScheduleSpawn();
};


GameJam17.SubmarineState.prototype.createBossBullet = function (x, y) {

	bullet = this.bossBullets.create(x, y, 'boss_bullet');
	bullet.body.allowGravity = false;
	bullet.anchor.set(0.5, 0.5);
	bullet.checkWorldBounds = true;
	bullet.outOfBoundsKill = true;
	bullet.body.allowRotation = true;
	bullet.mask = this.mask;

	return bullet;
};


GameJam17.SubmarineState.prototype.createSatelites = function (object) {
	"use strict";
	var position, satelite;
	
	position = this.objectPosition(object);

	satelite = this.satelites.create(position.x, position.y, 'satelite');
	satelite.body.allowGravity = false;
	satelite.mask = this.mask;
	satelite.anchor.set(0.5, 0.5);

	satelite.animations.add('idle', Phaser.Animation.generateFrameNames('coin', 1, 3, '.png', 1), 2, true, false);
	satelite.animations.play('idle');
};


GameJam17.SubmarineState.prototype.createMines = function (object) {
	"use strict";
	var position, mine;
	
	position = this.objectPosition(object);

	mine = this.mines.create(position.x, position.y, 'mine');
	mine.body.allowGravity = false;
	mine.body.immovable = true;
	mine.mask = this.mask;
	mine.anchor.set(0.5, 0.5);

	mine.animations.add('idle', Phaser.Animation.generateFrameNames('mine-', 1, 2, '.png', 2), 3, true, false);
	mine.animations.play('idle');

	this.game.add.tween(mine).to({x: mine.x - 20}, 1000, Phaser.Linear, true, null, -1, true);
};


GameJam17.SubmarineState.prototype.objectPosition = function (object) {
	"use strict";
	var object_y, position;
	
	// tiled coordinates starts in the bottom left corner
	object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
	position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};

	return position;
};


GameJam17.SubmarineState.prototype.playerDie = function (player, crashed) {
	"use strict";

	var explosion, flash, flashTween;

	crashed.visible = false;
	this.createExplosion(crashed.x, crashed.y, crashed.key);

	this.player.angle = this.game.physics.arcade.angleBetween(crashed, this.player);
	this.player.body.acceleration.set(0);
	this.game.physics.arcade.velocityFromAngle(this.player.angle, 100, this.player.body.velocity);

	crashed.kill();

	this.setSonar(this.player.sonarPower - 40);

	flash = this.game.add.graphics(this.player.x, this.player.y);
	flash.beginFill(0xFF4444);
	flash.drawCircle(0, 0, 500);
	flash.mask = this.mask;
	
	flashTween = this.game.add.tween(flash).to({alpha: 0}, 500, Phaser.Linear, true);
	flashTween.onComplete.add(function(){
		flashTween.stop();
		flash.kill();
	});

	if(crashed.key === 'boss_bullet' && !this.bossMusic.isPlaying) {
		this.ambientMusic.stop();
		this.bossMusic.play();
	}
   
	// decrease the number of lives
	this.player.lives -= 1;

	if (this.player.lives === 3) {
		this.life.frame = 1;
	}

	if (this.player.lives === 2)
		this.life.frame = 2;
	if (this.player.lives === 1)
		this.life.frame = 3;

	if (this.player.lives <= 0) {
		// if there are no more lives, it's game over
		this.game_over();
	}
};


GameJam17.SubmarineState.prototype.bossDie = function (boss, bullet) {
	"use strict";

	bullet.visible = false;	
	this.createExplosion(bullet.x, bullet.y, bullet.key);
	bullet.kill();
 
	this.boss.lives -= 1;
	this.boss.injured = true;
	this.boss.rage += 1;
	
	if(!this.bossMusic.isPlaying) {
		this.ambientMusic.stop();
		this.bossMusic.play();
	}

	if (this.boss.lives <= 0) {
		this.game_win();
	}
};

GameJam17.SubmarineState.prototype.bulletCollide = function (bullet, layer) {

	bullet.visible = false;
	this.createExplosion(bullet.x, bullet.y, bullet.key);
	bullet.kill();

};

GameJam17.SubmarineState.prototype.mineCollide = function (bullet, mine) {

	bullet.visible = false;
	mine.visible = false;
	this.createExplosion(mine.x, mine.y, mine.key);
	bullet.kill();
	mine.kill();

};


GameJam17.SubmarineState.prototype.bulletsCollide = function (playerBullet, bossBullet) {
	playerBullet.visible = false;
	bossBullet.visible = false;

	this.createExplosion(playerBullet.x, playerBullet.y, playerBullet.key);
	this.createExplosion(bossBullet.x, bossBullet.y, bossBullet.key);

	playerBullet.kill();
	bossBullet.kill();
};


GameJam17.SubmarineState.prototype.createExplosion = function (x, y, key) {

	var explosion, texture;

	if (key === 'boss_bullet') {
		texture = 'boss_explosion';
	} else {
		texture = 'explosion';
	}

	explosion = this.game.add.sprite(x, y, texture);
	explosion.anchor.set(0.5, 0.5);
	explosion.animations.add('kabum', [0, 1], 5).onComplete.add(function(){
		var tween = this.game.add.tween(explosion).to({alpha: 0}, 300, Phaser.Linear, true);
		tween.onComplete.add(explosion.kill);
	}, this);
	explosion.play('kabum');
	this.explosionSound.play();

};

GameJam17.SubmarineState.prototype.game_over = function () {
	"use strict";
	this.bossMusic.stop();
	this.ambientMusic.stop();
	this.game.state.start("BootState", true, false, "assets/levels/level1.json", "SubmarineState", {actualLevel: this.actualLevel});
};

GameJam17.SubmarineState.prototype.game_win = function () {
	"use strict";
	
	this.ambientMusic.stop();
	this.bossMusic.stop();
	this.sonarMusic.stop();

	if (this.extra_parameters.isLastLevel) {
		this.fadeIn(3000, function(){
			this.game.state.start("BootState", true, false, "assets/levels/win.json", "WinState");
		}, this);
	} else {
		this.fadeIn(1500, function(){
			this.game.state.start("BootState", true, false, "assets/levels/map.json", "MapState", {previousLevel: this.actualLevel, nextLevel: this.actualLevel + 1});
		}, this);
	}

};
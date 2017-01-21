var GameJam17 = GameJam17 || {};

GameJam17.SubmarineState = function () {
	"use strict";
	Phaser.State.call(this);
};

GameJam17.SubmarineState.prototype = Object.create(Phaser.State.prototype);
GameJam17.SubmarineState.prototype.constructor = GameJam17.SubmarineState;

GameJam17.SubmarineState.prototype.init = function (level_data) {
	"use strict";
	var tileset_index;
    this.level_data = level_data;

	this.game.stage.backgroundColor = 0x000000;

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 500;

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

	// Groups

	this.satelites = this.game.add.group();
   	this.satelites.enableBody = true;

	// Map

    this.layers = {};
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        if (layer.properties.collision) { // collision layer
            this.map.setCollisionByExclusion([-1], true, layer.name);
        }
    }, this);

    this.layers[this.map.layer.name].resizeWorld();

    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            if (object_layer === 'satelites') {
    			this.map.objects[object_layer].forEach(this.createSatelites, this);
            }

            
        }
    }

    // Player

    this.player = this.game.add.sprite(140, 140, 'submarine', 'Sub-01.png');
    this.player.anchor.set(0.5, 0.5);
    this.player.sonarPower = 0;

    this.game.physics.arcade.enable(this.player);
    this.player.body.drag.set(100);
    this.player.body.maxVelocity.set(50);

    this.player.anims = {};
    this.player.anims.idle = this.player.animations.add('idle', Phaser.Animation.generateFrameNames('Sub-', 1, 2, '.png', 2), 2, true, false);
    this.player.anims.turn = this.player.animations.add('turn', Phaser.Animation.generateFrameNames('Sub-', 3, 5, '.png', 2), 2, false, false);
    this.player.animations.play('idle');
    this.player.facing = 'right';

    this.player.anims.turn.onComplete.add(this.submarineFinishTurn, this);

	// Camera

    this.game.camera.follow(this.player);

   	// Mask

    this.mask = this.game.add.graphics(0, 0);
    this.mask.beginFill(0xffffff);
   	this.mask.drawCircle(0, 0, 60);
   	
   	this.player.mask = this.mask;
   	this.player.addChild(this.mask);
   	this.layers.walls.mask = this.mask;
   	this.layers.background.mask = this.mask;

   	// Enemy

   	this.enemy = this.game.add.sprite(550, 140, 'submarine', 'Sub-01.png');
   	this.enemy.anchor.set(0.5, 0.5);
   	this.enemy.tint = '0xff7711';

   	this.game.physics.arcade.enable(this.enemy);

   	this.sonar(120);

   	// Cursors

   	this.cursors = this.game.input.keyboard.createCursorKeys();

    this.wasd = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

};

GameJam17.SubmarineState.prototype.update = function () {

	this.game.physics.arcade.collide(this.player, this.layers.walls);
	this.game.physics.arcade.collide(this.enemy, this.layers.walls);
	this.game.physics.arcade.overlap(this.player, this.satelites, this.catchLightball, null, this);

	// this.player.body.velocity.y = 0;
	
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

    this.enemy.body.velocity.y = -10;

};

GameJam17.SubmarineState.prototype.catchLightball = function (player, lightball) {

	lightball.kill();
	this.sonar(20);

	var flash = this.game.add.graphics(this.player.x, this.player.y);
	flash.beginFill(0xFFEB3B);
   	flash.drawCircle(0, 0, 500);
   	flash.mask = this.mask;
   	
   	var tween = this.game.add.tween(flash).to({alpha: 0}, 500, Phaser.Linear, true);

   	tween.onComplete.add(function(){
   		tween.stop();
   		flash.kill();
   	});

};


GameJam17.SubmarineState.prototype.sonar = function(increase) {

	this.player.sonarPower += increase;

	this.player.sonarTween = this.game.add.tween(this.mask).to({width: this.player.sonarPower, height: this.player.sonarPower}, 1000, Phaser.Easing.Linear.None, true, -1, -1, true);

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

GameJam17.SubmarineState.prototype.createSatelites = function (object) {
	"use strict";
    var object_y, position, satelite;
    
    // tiled coordinates starts in the bottom left corner
    object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
    position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};

   	satelite = this.satelites.create(position.x, position.y, 'satelite');
   	satelite.body.allowGravity = false;
};
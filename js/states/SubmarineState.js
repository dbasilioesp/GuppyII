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
   	this.mask.drawCircle(0, 0, 60);

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

	this.map.layers.forEach(function (layer) {
		if (layer.properties.collision) {
            this.game.physics.arcade.collide(this.player, this.layers[layer.name]);
        }
	}, this);

	this.game.physics.arcade.overlap(this.player, this.satelites, this.catchLightball, null, this);
	this.game.physics.arcade.collide(this.player, this.mines, this.playerDie, null, this);

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

   	this.player.mask = this.mask;
   	this.player.addChild(this.mask);

};

GameJam17.SubmarineState.prototype.createBoss = function (object) {
	"use strict";
    var position;

    position = this.objectPosition(object);

    this.boss = this.game.add.sprite(position.x, position.y, 'boss');
    this.boss.scale.set(-1, 1);

    this.boss.animations.add('idle', [2, 1, 2, 1, 0], 1, true, true);
    this.boss.animations.play('idle');
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
};


GameJam17.SubmarineState.prototype.objectPosition = function (object) {
	"use strict";
    var object_y, position;
    
    // tiled coordinates starts in the bottom left corner
    object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2);
    position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y};

    return position;
};


GameJam17.SubmarineState.prototype.playerDie = function (player, mine) {
    "use strict";

    var explosion;

    mine.visible = false;
    explosion = this.game.add.sprite(mine.x, mine.y, 'explosion');
    explosion.animations.add('kabum', [0, 1], 5).onComplete.add(function(){
    	var tween = this.game.add.tween(explosion).to({alpha: 0}, 300, Phaser.Linear, true);
    	tween.onComplete.add(explosion.kill);
    }, this);
    explosion.play('kabum');
    mine.kill();


    var angle = this.game.physics.arcade.angleBetween(player, mine);
    this.player.body.velocity.x += Math.cos(-angle) * 10000;
    this.player.body.velocity.y += Math.sin(-angle) * 10000;
    this.player.isDamaged = true;
   
    // decrease the number of lives
    this.number_of_lives -= 1;
    if (this.player.number_of_lives <= 0) {
        // if there are no more lives, it's game over
        
        
    } else {
        // if there are remaining lives, restart the player position
        //this.player.reset(this.player.initial_position.x, this.player.initial_position.y);



    }
};
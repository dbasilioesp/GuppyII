window.onload = function() {
	var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
	game.state.add("BootState", new GameJam17.BootState());
	game.state.add("LoadingState", new GameJam17.LoadingState());
	game.state.add("SubmarineState", new GameJam17.SubmarineState());
	
	game.state.start("BootState", true, false, "assets/levels/level1.json", "SubmarineState");
}


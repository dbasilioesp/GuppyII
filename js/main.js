window.onload = function() {
	var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
	game.state.add("BootState", new GameJam17.BootState());
	game.state.add("LoadingState", new GameJam17.LoadingState());
	game.state.add("SubmarineState", new GameJam17.SubmarineState());
	game.state.add("TitleState", new GameJam17.TitleState());
	game.state.add("CreditsState", new GameJam17.CreditsState());
	game.state.add("WinState", new GameJam17.WinState());
	
	game.state.start("BootState", true, false, "assets/levels/title.json", "TitleState");
}


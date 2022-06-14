export class cmd {
	constructor(game) {
		this.game = game;
		//#region 假封包
		//#endregion
	}
	preload() {

	}
	create() {
		console.log(this.game.P_JewelleryClose);
	}
	update() {
		if (this.game.P_FreeGameJl == true) {
			if (this.game.P_ContinuousBoomTimes == 3) {
				this.game.P_JewelleryClose = [false, false, false, false];
			}
			else if (this.game.P_ContinuousBoomTimes == 2) {
				this.game.P_JewelleryClose = [false, true, false, false];
			}
			else if (this.game.P_ContinuousBoomTimes == 1) {
				this.game.P_JewelleryClose = [false, false, true, false];
			}
		}

	}
}
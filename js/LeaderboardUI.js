import * as phaser from './phaser.min.js';
import { Button } from './CustomTools.js';


/*	遊戲排行	*/
export class Leaderboard {

	constructor(game) {
		this.game = game;
		this.ReplayButton = [];
		this.NameText = [];
		this.Money = [];
	}

	preload() {
		let ego = this.game;
		ego.onceload.image('Leaderboard', 'assets/LeaderboardUI/BG.png');

		ego.onceload.image('Leaderboard_Close_N', 'assets/Odd/Button_OFF_N.png');
		ego.onceload.image('Leaderboard_Close_P', 'assets/Odd/Button_OFF_P.png');

		ego.onceload.image('Leaderboard_Button_N', 'assets/LeaderboardUI/Replay_BUTTON_N.png');
		ego.onceload.image('Leaderboard_Button_P', 'assets/LeaderboardUI/Replay_BUTTON_P.png');
	}

	create() {
		let ego = this.game;

		let Leaderboard_Groundback = ego.add.image(0, 0, 'Odd_Groundback').setScale(72, 140).setAlpha(0.5);//背景遮罩
		Leaderboard_Groundback.setInteractive();
		this.page = ego.add.image(0, 0, 'Leaderboard');//排行榜
		let bnClose = new Button(ego, 'Odd_Close_N', 'Odd_Close_P', 280, -430, this.onLeaderboardMove.bind(this)).Main.setScale(2);//關閉按鈕		
		this.ReplayButtonContainer = ego.add.container(0, 0);//重播按鈕container
		for (let i = 0; i < 10; i++) {
			this.ReplayButton[i] = new Button(ego, 'Leaderboard_Button_N', 'Leaderboard_Button_P', 230, -265 + (80 * i), (function () {
				console.log('第' + (i + 1) + '顆重播按鈕');
			}).bind(this)).Main;
			this.ReplayButtonContainer.add([this.ReplayButton[i]]);
		}

		//字體設定
		this.txt = {
			font: 'bold 23pt 微軟正黑體',
			color: '#ffffff',
			// stroke: '#C6A300',
			// strokeThickness: 2,
			//backgroundColor: '#8080C0',
		};

		this.NameTextContainer = ego.add.container(0, 0);//玩家名字container		
		for (let i = 0; i < 10; i++) {
			this.NameText[i] = ego.add.text(-75, -267 + (80 * i), '中文字測試用', this.txt).setOrigin(0.5, 0.5);
			this.NameTextContainer.add([this.NameText[i]]);
		}
		this.MoneyTextContainer = ego.add.container(0, 0);//獎金金額container
		for (let i = 0; i < 10; i++) {
			this.Money[i] = ego.add.text(110, -267 + (80 * i), '777M', this.txt).setOrigin(0.5, 0.5);
			this.MoneyTextContainer.add([this.Money[i]]);
		}
		this.LeaderboardContainer = ego.add.container(-360, 640, [
			Leaderboard_Groundback, this.page, this.ReplayButtonContainer, this.NameTextContainer, this.MoneyTextContainer, bnClose]).setDepth(100);

		// this.LeaderboardContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, 720, 1280), Phaser.Geom.Rectangle.Contains);

		// Leaderboard_Groundback.on('pointerover', function () {

		// 	console.log('over');

		// });
		// Leaderboard_Groundback.on('pointerout', function () {

		// 	console.log('out');

		// });
	}

	// 按鈕事件呼叫 true開啟 false關閉
	onLeaderboardMove(occur = false) {
		let ego = this.game;

		ego.tweens.add({
			targets: this.LeaderboardContainer,
			x: occur ? 360 : -360,
			duration: 400,
			ease: 'Sine.Out'
		})

		//this.game.MusicAndSE.PlaySoundEffect('SE_OddOccur');

	}
	destroy() { this.main.destroy(); }

}
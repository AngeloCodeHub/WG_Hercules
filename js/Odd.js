/**
 * 賠率表資訊，遊戲說明
 */
import * as phaser from './phaser.min.js';
import { Button,ChangeNumText_Comma } from './CustomTools.js';


/*	賠率表	*/
export class SetOdd {

	constructor(game) {
		this.game = game;
		this.index = 0;
		this.oddActive = false;
		this.oddswitch = false;
		this.oddContainer;

		this.oddAry = [];
		this.oddAry[0] = [50, 100, 250];
		this.oddAry[1] = [30, 50, 100];
		this.oddAry[2] = [20, 30, 75];
		this.oddAry[3] = [10, 20, 50];
		this.oddAry[4] = [5, 15, 30];
		this.oddAry[5] = [5, 10, 20];
		this.oddAry[6] = [3, 5, 15];
		this.oddAry[7] = [2, 5, 10];
		this.oddAry[8] = [2, 3, 5];

		this.showOddIndex = 0;

	}

	preload() {
		let ego = this.game;
		ego.onceload.image('Odd_Groundback', 'assets/OddGroundback.png');
		ego.onceload.image('Odd_Outside', 'assets/Odd/oddOutside.png');

		ego.onceload.image('Odd_Close_N', 'assets/Odd/Button_OFF_N.png');
		ego.onceload.image('Odd_Close_P', 'assets/Odd/Button_OFF_P.png');
		ego.onceload.image('Odd_Left_N', 'assets/Odd/fruit_odd_page_left.png');
		ego.onceload.image('Odd_Right_N', 'assets/Odd/fruit_odd_page_right.png');

		ego.onceload.image('Odd_page1', 'assets/Odd/fruit_odd_A.png');
		ego.onceload.image('Odd_page2', 'assets/Odd/fruit_odd_B.png');
		ego.onceload.image('Odd_page3', 'assets/Odd/fruit_odd_C.png');
		// ego.onceload.image('Odd_page4', 'assets/Odd/fruit_odd_D.png');

		ego.onceload.image('Odd_smalldot', 'assets/Odd/fruit_odd_page_N.png');
		ego.onceload.image('Odd_bigdot', 'assets/Odd/fruit_odd_page_P.png');
	}

	create() {
		let ego = this.game;

		let Odd_Groundback = ego.add.image(0, 0, 'Odd_Groundback').setScale(72, 140).setAlpha(0.8);
		let Odd_Outside = ego.add.image(0, 0, 'Odd_Outside');
		let bnClose = new Button(ego, 'Odd_Close_N', 'Odd_Close_P', 280, -430, this.onOddMove.bind(this)).Main.setScale(2);
		let leftBtn = new Button(ego, 'Odd_Left_N', 'Odd_Left_N', -320, 0, (function () {
			this.setOddPage(-1);
		}).bind(this)).Main;
		let rightBtn = new Button(ego, 'Odd_Right_N', 'Odd_Right_N', 312.5, 0, (function () {
			this.setOddPage(1);
		}).bind(this)).Main;

		this.page = ego.add.image(0, 60, 'Odd_page1');
		this.dotA = ego.add.image(-80, 550, 'Odd_bigdot');
		this.dotB = ego.add.image(-0, 550, 'Odd_smalldot');
		this.dotC = ego.add.image(80, 550, 'Odd_smalldot');

		this.oddTextCon = ego.add.container(0, 0);
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < 3; k++) {
					let index = j + i * 3;
					let odd = this.oddAry[index][k];
					let x = -220 + j * 195
					let y = -23 + 30 * k + i * 211;
					this.oddTextCon.add(ego.add.text(x, y, odd, { font: 'bold 16pt 微軟正黑體', color: '#FFFFFF' }).setOrigin(0, 0.5));
				}
			}
		}

		this.oddContainer = ego.add.container(1080, 640, [
			Odd_Groundback, Odd_Outside, this.page, bnClose, leftBtn, rightBtn, this.dotA, this.dotB, this.dotC, this.oddTextCon
		]).setDepth(100);
		Odd_Groundback.setInteractive();
		// this.oddContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, 720, 1500), Phaser.Geom.Rectangle.Contains);

		for (let i = 4; i < 6; i++) {
			ego.tweens.add({
				targets: this.oddContainer.list[i],
				x: this.oddContainer.list[i].x + (i == 4 ? 10 : -10),
				duration: 1000,
				ease: 'Sine.InOut',
				yoyo: true,
				repeat: -1,
			})
		}
	}

	onOddMove(occur = false) {
		let ego = this.game;

		ego.tweens.add({
			targets: this.oddContainer,
			x: occur ? 360 : 1080,
			duration: 400,
			ease: 'Sine.Out'
		})

		this.game.MusicAndSE.PlaySoundEffect('SE_OddOccur');

	}

	setOddPage(path) {
		this.index = (this.index + path + 3) % 3;
		this.page.setTexture("Odd_page" + (this.index + 1));
		switch (this.index) {
			case 0:
				this.dotA.setTexture('Odd_bigdot');
				this.dotB.setTexture('Odd_smalldot');
				this.dotC.setTexture('Odd_smalldot');
				break;
			case 1:
				this.dotA.setTexture('Odd_smalldot');
				this.dotB.setTexture('Odd_bigdot');
				this.dotC.setTexture('Odd_smalldot');
				break;
			case 2:
				this.dotA.setTexture('Odd_smalldot');
				this.dotB.setTexture('Odd_smalldot');
				this.dotC.setTexture('Odd_bigdot');
				break;
		}
		this.game.MusicAndSE.PlaySoundEffect('SE_OddChange');

		this.oddTextCon.setVisible(this.showOddIndex == this.index);
	}

	ChangeOddText(value) {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < 3; k++) {
					let index = j + i * 3;
					let odd = this.oddAry[index][k];

					this.oddTextCon.list[index * 3 + k].text = ChangeNumText_Comma((value / 25) * odd);
				}
			}
		}
	}

	destroy() { this.main.destroy(); }

}
import { CustomScene, Button, GetCookie, SetCookie, ChangeNumText_Comma } from './CustomTools.js';
import { SetOdd } from './Odd.js';
import { Leaderboard } from './LeaderboardUI.js';
import { RollBarControl } from './RollBarControl.js';
import { PhysicalSystem } from './CoinEffect.js';
// 金錢不足警告訊息
import { Message } from './Message.js';
// 上方滾動訊息
import { ScrollText } from './ScrollText.js';
import { Hercules } from './Hercules.js';
import { JewelleryControl } from './JewelleryControl.js';
import { BetBoard } from './BetBoard.js';
// 下方UI歷史紀錄
import { History } from './History.js';
import { MusicAndSE } from './MusicAndSE.js';
import { Socket_php } from './Socket_php.js';
import { MySocket } from './MySocket.js';
import { cmd_Bet } from '../common_old/Sockets/cmd_14_1_1_Bet.js';
import { GeneralMethods } from '../common_old/GeneralMethods.js';
import { cmd_ReBet } from '../common_old/Sockets/cmd_14_1_2_ReBet.js';
/* 主遊戲(場景) */
export class MainGame extends CustomScene {
	constructor() {
		// scene繼承的寫法
		super("MainGame");
		this.phpServer = false;
		//#region 其他腳本class
		this.RollBarControl = new RollBarControl(this);//滾輪控制
		this.Odd = new SetOdd(this);//賠率表
		this.Leaderboard = new Leaderboard(this);//遊戲排行
		this.PhysicalSystem = new PhysicalSystem(this);//硬幣(BigWin物理引擎)
		this.Hercules = new Hercules(this);
		this.JewelleryControl = new JewelleryControl(this);
		this.MusicAndSE = new MusicAndSE(this);
		this.Message = new Message(this);
		this.scrollText = new ScrollText(this);
		//#endregion 其他腳本class

		this.disLink = false;

		//#region 假封包
		this.P_prize_jewellery = [0, 0, 0, 0];//珠子結果封包
		this.P_prize_jewellerytext = [0, 0, 0, 0];//珠子文字結果封包
		this.P_JewelleryMove = [false, false, false, false];//三顆珠子是否中獎
		this.P_FreeGame = false;//免費滾輪Buff
		this.P_FreeGameTimes = 0;//免費滾輪Buff次數
		this.P_prize_win = [];//中獎方塊
		this.P_prize_role = [0, 0, 0, 0];//角色結果封包
		//#endregion

		// None = -1,
		// Heracles = 海克力斯 = 0,
		// Zeus = 宙斯 = 1,
		// Hera = 郝拉 = 2,
		// Athena = 雅典娜 = 3,
		// Venus = 維納斯 = 4,
		// LernaeanHydra = 神龍 = 5,
		// lion = 獅子 = 6,
		// dog = 地獄三頭犬 = 7,
		// Bison = 野牛 = 8,
		// apple = 蘋果(WILD) = 9,
		var self = this;

		this.MissWin = true;//沒中獎 直接進入按鈕恢復狀態程式環節 true沒中 fales中獎 有沒有中獎這個也需要跟著更改
		this.Winning = false;
		this.status_win = -1;

		this.prize_NO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.prize = [];
		this.status = -1;						//遊戲狀態
		this.meStart = 0;						//開始按鈕狀態 0一般模式 1快停模式
		this.status_BG = 0;
		this.auto = false;
		this.WDbg = [];

		this.myMoney = 1000;					//玩家總金額
		this.moneyChangeOdd = 20;

		this.notEnoughMoney = false;
		this.PointsMoney = 0;					//儲值後公道幣總金額
		this.haveMoneyfromSer = false;			//是否收到儲值(1.0.5)封包
		this.tmpScore = 0;						//每小局中獎金額
		this.finalScore = 0; 					//最終金額
		this.myWinScore = 0;					//中獎金額
		this.targetWinScore = 0;
		this.ScoreBoardAniFinish = false;		//洗分動畫是否結束
		this.moneyFinish = false;				//洗分到自己金額是否結束
		this.AllCubeFinish = true;				//方塊是否停止
		this.AllFinish = true;					//整體遊戲是否完成
		this.FailToBet = false;					//押注封包錯誤

		this.betIndex = 0;
		this.myBet = 200;						//押注
		this.myTotalBet = 200;					//總押注

		this.showBigWinCoin = false;
		this.nowBigWinLevel = 0;

		this.CoinName = null;
		this.url = null;
		this.isTest = false;

		this.index = 0;
		this.Free_index = -1;

		this.betArray = [];

		this.UseSetting = null;//使用環境(電腦 或 機台)
		this.ApiCtrl = null;

		window.MainGame = this;
	}
	preload() {
		let ego = this;
		this.RollBarControl.preload();
		this.Odd.preload();
		this.Leaderboard.preload();
		this.Hercules.preload();
		this.JewelleryControl.preload();
		this.MusicAndSE.preload();

		ego.load.setBaseURL('./');

		ego.onceload.image('G14_topBG1', 'assets/hercules_bg_2.png');
		ego.onceload.image('G14_topBG2', 'assets/hercules_bg_1.png');
		ego.onceload.image('G14_topBG3', 'assets/hercules_topbg_01.png');
		ego.onceload.image('G14_topBG4', 'assets/hercules_cloud_001_v3.png')
		ego.onceload.image('G14_topBG4_free', 'assets/hercules_cloud_003_v3.png')

		ego.onceload.spritesheet('Hercules_role_cube', 'assets/Cube/hercules_role.png', { frameWidth: 140, frameHeight: 140 });

		//#region 賠率表按鈕
		ego.onceload.image('OddBtn_N', 'assets/Odd/hercules_btn_caption.png');
		ego.onceload.image('OddBtn_P', 'assets/Odd/hercules_btn_caption.png');
		//#endregion
		//#region 看板UI(押注、總押注看板)
		ego.onceload.image('BAR', 'assets/DownUI/fruit_information_BG.png');
		//#endregion
		//#region 按鈕
		/* 自動及快停按鈕 */
		ego.onceload.image('Auto_A', 'assets/DownUI/hercules_btn_atuo.png');
		ego.onceload.image('Auto_B', 'assets/DownUI/hercules_btn_atuo.png');
		ego.onceload.image('Stop_A', 'assets/DownUI/hercules_btn_stop.png');
		ego.onceload.image('Stop_B', 'assets/DownUI/hercules_btn_stop.png');
		ego.onceload.image('Quick_On', 'assets/DownUI/hercules_btn_quick_on.png');
		ego.onceload.image('Quick_Off', 'assets/DownUI/hercules_btn_quick_off.png');
		/* 開始按鈕 */
		ego.onceload.image('StartWave1', 'assets/DownUI/StartButton/Shockwave.png');
		ego.onceload.image('StartWave2', 'assets/DownUI/StartButton/Shockwave2.png');
		ego.onceload.spritesheet('startLightAni_Sheet', 'assets/DownUI/download_button_light.png', { frameWidth: 120, frameHeight: 120 });

		ego.onceload.image('Start_A', 'assets/DownUI/StartButton/btn_ring.png');
		ego.onceload.image('StartRollLight', 'assets/DownUI/StartButton/fruit_start_spinlight_fast.png');
		ego.onceload.image('StartOutRollLight', 'assets/DownUI/StartButton/eff_ring_02.png');
		ego.onceload.image('StartSmallLight', 'assets/DownUI/StartButton/eff_ring_03.png');
		ego.onceload.image('StartTextImage', 'assets/DownUI/StartButton/eff_ring_04.png');
		ego.onceload.image('StopTextImage', 'assets/DownUI/StartButton/eff_ring_05.png');

		/* 加注減注按鈕 和 加線減線按鈕 */
		ego.onceload.image('Bet++_A', 'assets/DownUI/hercules_btn_001.png');    //一般狀態
		ego.onceload.image('Bet++_B', 'assets/DownUI/hercules_btn_001_no.png');	//按下狀態
		ego.onceload.image('Bet++_C', 'assets/DownUI/hercules_btn_no_001.png'); //禁用狀態

		ego.onceload.image('Bet--_A', 'assets/DownUI/hercules_btn_002.png');
		ego.onceload.image('Bet--_B', 'assets/DownUI/hercules_btn_002_no.png');
		ego.onceload.image('Bet--_C', 'assets/DownUI/hercules_btn_no_002.png');

		ego.onceload.image('MaxBet_A', 'assets/DownUI/hercules_btn_maxbet.png');
		ego.onceload.image('MaxBet_B', 'assets/DownUI/hercules_btn_maxbet_no_b.png');
		ego.onceload.image('MaxBet_C', 'assets/DownUI/hercules_btn_maxbet_no.png');
		//#endregion
		//#region 金額欄相關
		ego.load.bitmapFont('bet_WinNum', 'assets/DownUI/bet_WinNum.png', 'assets/DownUI/bet_WinNum.xml');
		ego.load.bitmapFont('bet_autoTimesNum', 'assets/DownUI/bet_autoTimesNum.png', 'assets/DownUI/bet_autoTimesNum.xml');
		//#endregion
		//#region 爆炸特效
		ego.onceload.spritesheet('Bombing', 'assets/eff_steptex_009.png', { frameWidth: 64, frameHeight: 64 });
		//#endregion
		//#region Win相關
		ego.load.bitmapFont('winScore', 'assets/Win/winScore_font.png', 'assets/Win/winScore_font.xml')
		//#region _BigWin
		ego.load.bitmapFont('bigWinScore', 'assets/BigWin/bigWinScore_font.png', 'assets/BigWin/bigWinScore_font.xml')
		// for (let i = 0; i < 4; i++) {
		// 	ego.onceload.image('bigWin_BG_' + i, 'assets/BigWin/BIG WIN BG_' + i + '.png');
		// 	ego.onceload.image('bigWin_BG_White_' + i, 'assets/BigWin/BIG WIN BG-light_' + i + '.png');
		// 	ego.onceload.image('bigWin_Light_' + i, 'assets/BigWin/BIG WIN light_' + i + '.png');
		// 	ego.onceload.image('bigWin_Word_' + i, 'assets/BigWin/BIG WIN word_' + i + '.png');
		// 	ego.onceload.image('bigWin_Word_White_' + i, 'assets/BigWin/BIG WIN word-light_' + i + '.png');
		// }
		let EventBigWin_BG = GeneralMethods.MakeAssetArray(0, 4 - 1, 'bigWin_BG_', 'assets/BigWin/BIG WIN BG_', '.png');
		let EventBigWin_BG_White = GeneralMethods.MakeAssetArray(0, 4 - 1, 'bigWin_BG_White_', 'assets/BigWin/BIG WIN BG-light_', '.png');
		let EventBigWin_Light = GeneralMethods.MakeAssetArray(0, 4 - 1, 'bigWin_Light_', 'assets/BigWin/BIG WIN light_', '.png');
		let EventBigWin_Word = GeneralMethods.MakeAssetArray(0, 4 - 1, 'bigWin_Word_', 'assets/BigWin/BIG WIN word_', '.png');
		let EventBigWin_Word_White = GeneralMethods.MakeAssetArray(0, 4 - 1, 'bigWin_Word_White_', 'assets/BigWin/BIG WIN word-light_', '.png');
		for (let i = 0; i < EventBigWin_BG.length; i++) {
			ego.onceload.image(EventBigWin_BG[i][0], EventBigWin_BG[i][1]);
			ego.onceload.image(EventBigWin_BG_White[i][0], EventBigWin_BG_White[i][1]);
			ego.onceload.image(EventBigWin_Light[i][0], EventBigWin_Light[i][1]);
			ego.onceload.image(EventBigWin_Word[i][0], EventBigWin_Word[i][1]);
			ego.onceload.image(EventBigWin_Word_White[i][0], EventBigWin_Word_White[i][1]);
		}
		// for (let i = 0; i < 6; i++) {
		// 	ego.onceload.spritesheet('bigWin_Coin_' + i, 'assets/BigWin/BigWinCoin_' + i + '_N.png', { frameWidth: 60, frameHeight: 60 });
		// }
		let EventBigWin_Coin = GeneralMethods.MakeAssetArray(0, 6 - 1, 'bigWin_Coin_', 'assets/BigWin/BigWinCoin_', '_N.png');
		for (let i = 0; i < EventBigWin_Coin.length; i++) {
			ego.onceload.spritesheet(EventBigWin_Coin[i][0], EventBigWin_Coin[i][1], { frameWidth: 60, frameHeight: 60 });
		}
		//#endregion
		ego.onceload.image('scoreBG', 'assets/Win/fruit_WIN_BG.png');
		ego.onceload.image('scoreWinText', 'assets/Win/fruit_WIN_text.png');
		//#endregion 
		//#region 中獎提示白圖
		ego.onceload.image('WDBG', 'assets/WDBG.png');
		//#endregion
		//#region 中獎動畫
		ego.onceload.spritesheet('cube_0_Sheet', 'assets/Cube/objects_0.png', { frameWidth: 140, frameHeight: 140 });
		ego.onceload.spritesheet('cube_1_Sheet', 'assets/Cube/objects_1.png', { frameWidth: 230, frameHeight: 210 });
		ego.onceload.spritesheet('cube_2_Sheet', 'assets/Cube/objects_2.png', { frameWidth: 140, frameHeight: 210 });
		ego.onceload.spritesheet('cube_3_Sheet', 'assets/Cube/objects_3.png', { frameWidth: 140, frameHeight: 210 });
		ego.onceload.spritesheet('cube_4_Sheet', 'assets/Cube/objects_4.png', { frameWidth: 140, frameHeight: 140 });
		ego.onceload.spritesheet('cube_5_Sheet', 'assets/Cube/objects_5.png', { frameWidth: 140, frameHeight: 140 });
		ego.onceload.spritesheet('cube_6_Sheet', 'assets/Cube/objects_6.png', { frameWidth: 140, frameHeight: 140 });
		ego.onceload.spritesheet('cube_7_Sheet', 'assets/Cube/objects_7.png', { frameWidth: 140, frameHeight: 140 });
		ego.onceload.spritesheet('cube_8_Sheet', 'assets/Cube/objects_8.png', { frameWidth: 140, frameHeight: 140 });
		//#endregion
		//#region 宙斯顯示特效(修改成中獎顯示特效)
		ego.onceload.spritesheet('Zeus_eff', 'assets/hercules_role_eff_z.png', { frameWidth: 111, frameHeight: 111 });
		//#endregion

		this.History = new History(this);
		this.scene.add('History', this.History, true, { x: 0, y: 0 });
		this.scene.add('Message', this.Message, true, { x: 0, y: 0 });
		this.scene.add('ScrollText', this.scrollText, true, { x: 0, y: 0 });

		//#region 判定電腦還是機台
		if (this.UseSetting == 'ROBOT1') {
			this.betIndex = 0;
			this.betArray = [100, 200, 300, 500, 600, 700, 800, 1200, 1600, 2000, 3000, 4000];
			console.log('機台押注級距');
		}
		else {
			this.betIndex = 0;
			this.betArray = [200, 500, 750, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 10000];
			console.log('電腦押注級距');
		}
		let len = this.betArray.length;
		for (let i = 0; i < len; i++) {
			if (this.betArray[0] < this.betLimit) { this.betArray.splice(0, 1); }
			else break;
		}
		//#endregion

	}
	create() {
		let ego = this;
		//#region 遮罩穿透物件建立	穿透物件(X座標位置, Y座標位置, 範圍長度, 範圍高度) PS:座標(0,0)在左上角
		this.mask_1 = ego.add.graphics();
		this.mask_1 = ego.mask_1.fillRect(7, 650, 143, 420);
		this.mask_2 = ego.add.graphics();
		this.mask_2 = ego.mask_2.fillRect(145, 512, 143, 555);
		this.mask_3 = ego.add.graphics();
		this.mask_3 = ego.mask_3.fillRect(283, 370, 150, 700);
		this.mask_4 = ego.add.graphics();
		this.mask_4 = ego.mask_4.fillRect(432, 512, 143, 555);
		this.mask_5 = ego.add.graphics();
		this.mask_5 = ego.mask_5.fillRect(570, 650, 143, 414);
		//#endregion
		//#region 背景圖 && 天空圖 動畫
		this.G14_topBG4 = ego.add.image(360, 310, 'G14_topBG4');//天空
		this.G14_topBG4_free = ego.add.image(360, 310, 'G14_topBG4_free').setScale(1.3).setAlpha(0);//免費滾輪天空
		this.Hercules.create();
		this.G14_topBG2 = ego.add.image(360, 323, 'G14_topBG2');//神廟(不含天空)		
		//#endregion

		this.JewelleryControl.create();//寶珠

		this.G14_topBG1 = ego.add.image(360, 720, 'G14_topBG1');//下半部背景
		//#region 方塊
		this.prize[18] = ego.add.sprite(360, 440, 'Hercules_role_cube', 0).setScale(1.06);

		this.prize[17] = ego.add.sprite(504, 580, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[16] = ego.add.sprite(360, 580, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[15] = ego.add.sprite(216, 580, 'Hercules_role_cube', 0).setScale(1.06);

		this.prize[14] = ego.add.sprite(648, 720, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[13] = ego.add.sprite(504, 720, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[12] = ego.add.sprite(360, 720, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[11] = ego.add.sprite(216, 720, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[10] = ego.add.sprite(72, 720, 'Hercules_role_cube', 0).setScale(1.06);

		this.prize[9] = ego.add.sprite(648, 860, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[8] = ego.add.sprite(504, 860, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[7] = ego.add.sprite(360, 860, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[6] = ego.add.sprite(216, 860, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[5] = ego.add.sprite(72, 860, 'Hercules_role_cube', 0).setScale(1.06);

		this.prize[4] = ego.add.sprite(648, 1005, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[3] = ego.add.sprite(504, 1005, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[2] = ego.add.sprite(360, 1005, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[1] = ego.add.sprite(216, 1005, 'Hercules_role_cube', 0).setScale(1.06);
		this.prize[0] = ego.add.sprite(72, 1005, 'Hercules_role_cube', 0).setScale(1.06);
		//#region 賦予穿透功能
		this.prize[0].setMask(this.mask_1.createGeometryMask());
		this.prize[5].setMask(this.mask_1.createGeometryMask());
		this.prize[10].setMask(this.mask_1.createGeometryMask());

		this.prize[1].setMask(this.mask_2.createGeometryMask());
		this.prize[6].setMask(this.mask_2.createGeometryMask());
		this.prize[11].setMask(this.mask_2.createGeometryMask());
		this.prize[15].setMask(this.mask_2.createGeometryMask());

		this.prize[2].setMask(this.mask_3.createGeometryMask());
		this.prize[7].setMask(this.mask_3.createGeometryMask());
		this.prize[12].setMask(this.mask_3.createGeometryMask());
		this.prize[16].setMask(this.mask_3.createGeometryMask());
		this.prize[18].setMask(this.mask_3.createGeometryMask());

		this.prize[3].setMask(this.mask_4.createGeometryMask());
		this.prize[8].setMask(this.mask_4.createGeometryMask());
		this.prize[13].setMask(this.mask_4.createGeometryMask());
		this.prize[17].setMask(this.mask_4.createGeometryMask());

		this.prize[4].setMask(this.mask_5.createGeometryMask());
		this.prize[9].setMask(this.mask_5.createGeometryMask());
		this.prize[14].setMask(this.mask_5.createGeometryMask());
		//#endregion
		//#endregion

		this.G14_topBG3 = ego.add.image(360, 720, 'G14_topBG3').setAlpha(1);//方塊框架		
		//#region 中獎提示白圖
		for (let i = 0; i < this.prize.length; i++) {
			let tmpX = this.prize[i].x;
			let tmpY = this.prize[i].y;
			this.WDbg[i] = ego.add.image(tmpX, tmpY, 'WDBG');
			this.WDbg[i].setScale(14).setAlpha(0);
		}
		this.wdtimes = { t: 0 };
		this.startWDbgTask = {
			targets: [this.wdtimes],
			t: { from: 0, to: 1 },
			alpha: { from: 0, to: 1, duration: 300, },
			duration: 2000,
			ease: 'Sine.easeInOut',
			onStart: function () {
				for (let i = 0; i < this.P_prize_win.length; i++) {
					let tmp = this.P_prize_win[i];
					this.Zeff[tmp].play('Zeus_effAni');
				}
			}.bind(this),
			onComplete: function () {
				for (let i = 0; i < this.P_prize_win.length; i++) {
					let tmp = this.P_prize_win[i];
					this.Zeff[tmp].setAlpha(0);
					this.Zeff[tmp].anims.stop();
				}
				this.startWDbgTask.targets.splice(1, this.startWDbgTask.targets.length - 1);
				this.status_win = 1;
			}.bind(this)
		}
		//#endregion
		//#region 中獎動畫
		for (let i = 0; i < 9; i++) {
			ego.anims.create({ key: 'cube_' + i + '_Ani', frames: ego.anims.generateFrameNumbers('cube_' + i + '_Sheet'), frameRate: 8, repeat: 0 });
		}
		//#endregion
		//#region 進遊戲隨機給答案
		this.SetRandPirze();
		//#endregion 進遊戲隨機給答案
		//#region 看板UI
		ego.add.image(360, 1280, 'BAR').setOrigin(0.5, 1).setDepth(3);
		//#endregion
		//#region 數字文字
		this.upUIMoneyText = ego.add.text(475, 1250, '0', { font: 'bold 20pt 微軟正黑體', color: '#ffffff' }).setOrigin(1, 0.5).setDepth(4);
		this.upUIMoneyText.setText(ChangeNumText_Comma(0));

		this.winMoneyText = ego.add.bitmapText(360, 1170, 'bet_WinNum', 0).setOrigin(0.5).setDepth(4).setFontSize(24);
		this.winMoneyText.setText(ChangeNumText_Comma(0));//Win的錢的數字

		this.betText = ego.add.text(115, 1157, '0', { font: 'bold 24pt 微軟正黑體', color: '#ffffff' }).setOrigin(0.5, 0.5).setDepth(4);
		this.betText.setText(ChangeNumText_Comma(this.myBet));//押注額的數字

		this.exchangeText = ego.add.text(660, 1215, '', { font: 'bold 14pt 微軟正黑體', color: '#ffed00' }).setStroke('#000000', 2).setOrigin(1, 0.5).setDepth(6).setVisible(false);
		this.exchangeText.setText(ChangeNumText_Comma(0));

		this.addMoneyText = ego.add.text(425, 1225, '0', { font: 'bold 20pt 微軟正黑體', color: '#0024E5' }).setStroke('#eeeeee', 1).setOrigin(0, 1).setDepth(10).setAlpha(0);
		this.addMoneyAni = this.tweens.add({
			targets: this.addMoneyText,
			scaleY: { from: 0, to: 1 },
			alpha: { from: 0, to: 1 },
			duration: 250, ease: "Sine.Out",
			yoyo: true, hold: 5000,
		})
		this.addMoneyAni.pause();
		//#endregion (數字文字)		
		//#region 押注金額選表按鈕
		// this.BetBoard = new BetBoard(this, this.betArray, 'Odd_Close_N', config);//押注選擇面板(this,押注金額項目,關閉按鈕圖片,)
		this.BetBoard = new BetBoard(this, this.betArray, 'Odd_Close_N', (index) => {
			this.BetNumber(index);
			// this.BetBoard.ChangeBet(index);
			// this.BetBoard.Occur(false);
			this.BtnAllDisable(false);
			this.AutoBtn.disable(false, 'Auto_A');
		}, { closeBtnScale: 2 });
		this.BetBoard.con.setDepth(52);

		this.betListOpen = new Button(ego, 'WDBG', 'WDBG', 115, 1157, function () {
			// this.betListCon.setVisible(true);
			this.BetBoard.Occur(true);
			this.BtnAllDisable(true);
			this.AutoBtn.disable(true, 'Auto_A')
		}.bind(this))
		this.betListOpen.Main.setDepth(4).setOrigin(0.5).setAlpha(0.01).setScale(11, 9)//開啟押注選單按鈕
		//#endregion
		//#region 點選開啟快選 文字
		this.openBetText = this.add.text(115, 1190, '點選開啟快選', { font: '12pt Noto Sans CJK TC', color: '#FFDC35', bold: true, align: 'center' }).setOrigin(0.5, 0.5).setAlpha(1).setDepth(5);
		this.openBetTextTimes = { t: 0 };
		this.openBetTextTask = {
			targets: this.openBetTextTimes,
			t: { from: 1, to: 0.5 },
			yoyo: true,
			repeat: -1,
			duration: 2000,
			onUpdate: function () {
				this.openBetText.setAlpha(this.openBetTextTimes.t);
				// this.betListOpen.Main.setAlpha(this.openBetTextTimes.t);
			}.bind(this),
		}
		this.openBetTextAni;
		this.openBetTextAni = this.tweens.add(this.openBetTextTask);
		//#endregion
		//#region _賠率表按鈕
		this.OddBtn = new Button(ego, 'OddBtn_N', 'OddBtn_P', 186, 1247, (function () { this.Odd.onOddMove(true); }).bind(this));
		this.OddBtn.main.setDepth(4);
		//#endregion (賠率表按鈕)		
		//#region _自動及快停按鈕
		this.autoStArray = ["10轉", "50轉", "100轉", "無限"];
		this.autoIndexArray = [10, 50, 100, -1];

		this.autoBoard = new BetBoard(this, this.autoStArray, 'Odd_Close_N', (index) => {
			this.autoBoard.ChangeBet(index);
			this.autoBoard.Occur(false);
			this.autoTimes = this.autoIndexArray[index];

			this.auto = true;
			this.AutoBtn.changeBtnImage('Stop_A', 'Stop_A');
			this.ShowAutoTimes(true);

			if (this.AllCubeFinish == true) {
				if (this.auto) {
					if (this.myMoney >= this.myTotalBet) {
						this.StartRolling();
					}
					else {
						this.Message.ShowMessage(this.CoinName + ' 不足', true, true, false);
						console.log('錢不夠 押注金額: ' + this.myTotalBet + '你的錢: ' + this.myMoney);
					}
				}
				this.AllCubeFinish = false;
			}
			this.MusicAndSE.PlaySoundEffect('SE_OddChange');
		}, { x: 475, y: 1055, originX: 1, originY: 1, titleTextSt: "轉動次數", titleTextfont: "bold 30pt 微軟正黑體", numTextfont: "bold 24pt 微軟正黑體", gap: [110, 60], closeBtnScale: 2 });

		this.AutoBtn = new Button(this, 'Auto_A', 'Auto_A', 520, 1130, () => {
			this.autoBoard.Occur(this.autoBoard.con.scale > 0 ? 0 : 1, false);
			this.autoTimes = 0;

			this.auto = false;
			this.AutoBtn.changeBtnImage('Auto_A', 'Auto_A');
			this.ShowAutoTimes(false);

			if (this.BetBoard.con.scale > 0) { this.BetBoard.Occur(false); }
		}); this.AutoBtn.main.setDepth(4);
		this.AutoBtn.setClick(() => {
			if (!this.auto) {
				this.auto = true;
				this.autoTimes = -1;
				this.AutoBtn.ChangeStage(true);

				if (this.AllCubeFinish == true) {
					if (this.auto) {
						if (this.myMoney >= this.myTotalBet) {
							this.StartRolling();
						}
						else {
							this.Message.ShowMessage(this.CoinName + ' 不足', true, true, false);
							console.log('錢不夠 押注金額: ' + this.myTotalBet + '你的錢: ' + this.myMoney);
						}
					}
					this.AllCubeFinish = false;
				}
			} else {
				this.auto = false;
				this.autoTimes = 0;
				this.AutoBtn.ChangeStage(false);
			}
		})

		this.autoTimesTitle = this.add.text(630, 1220, '自動次數', { font: 'bold 18pt 微軟正黑體', color: '#cccc99' }).setOrigin(0.5).setDepth(10).setVisible(false);
		this.autoTimesText = this.add.bitmapText(630, 1165, 'bet_autoTimesNum', 0).setFontSize(26).setOrigin(0.5).setDepth(10).setVisible(false);

		// this.AutoBtn = new Button(ego, 'Auto_A', 'Auto_B', 620, 1165, (function () {
		// 	if (this.myMoney >= this.myTotalBet) {
		// 		this.auto = !this.auto;
		// 		this.AutoBtn.changeBtnImage(this.auto ? 'Stop_A' : 'Auto_A', this.auto ? 'Stop_B' : 'Auto_B');

		// 		if (this.AllCubeFinish == true) {
		// 			if (this.auto) {
		// 				if (this.myMoney >= this.myTotalBet) {
		// 					this.StartRolling();
		// 				}
		// 				else {
		// 					this.Message.ShowMessage(this.CoinName + ' 不足', true, true, false);
		// 					console.log('錢不夠 押注金額: ' + this.myTotalBet + '你的錢: ' + this.myMoney);
		// 				}
		// 			}
		// 			this.AllCubeFinish = false;
		// 		}
		// 	}
		// 	else {
		// 		this.Message.ShowMessage(this.CoinName + ' 不足', true, true, false);
		// 		console.log('錢不夠 押注金額: ' + this.myTotalBet + '你的錢: ' + this.myMoney);
		// 	}
		// }).bind(this));
		// this.AutoBtn.main.setDepth(4);

		this.quickStop = false;
		this.QuickBtn = new Button(ego, 'Quick_Off', 'Quick_On', 520, 1210, (function () {
			this.quickStop = !this.quickStop;
		}).bind(this), null, [true, false]);
		this.QuickBtn.main.setDepth(4);
		//#endregion
		//#region 開始按鈕
		this.StartBtnCon = ego.add.container(630, 1180).setScale(0.95).setDepth(4);

		this.startEffectSpeed = 1;
		this.startNorTask = {};
		this.startNorAni;

		this.StartBtn = new Button(ego, 'Start_A', 'Start_A', 0, 0, function () {
			if (this.myMoney >= this.myTotalBet) {
				if (this.meStart == 0) {
					this.StartRolling();
				}
				else if (this.meStart == 1) {
					this.RollBarControl.SetQuickStop();
					this.StartBtn.disable(true);
				}
			}
			else if (this.meStart == 0) {
				this.Message.ShowMessage(this.CoinName + ' 不足', true, true, false);
				console.log('錢不夠 押注金額: ' + this.myTotalBet + '你的錢: ' + this.myMoney);
			}

		}.bind(this));
		this.StartBtn.setContainer(this.StartBtnCon);

		this.StartBtn.setPointDown('Start_A', function () {
			if (!this.notEnoughMoney) {
				this.StartAniDown();
			}
		}.bind(this));

		this.StartBtn.setPointOut(function () {
			if (this.startEffectSpeed === -0.05) {
				this.StartAniNormal();
				this.StartArcAniNormal();
			}
		}.bind(this))

		//#region _-圖片
		let startTextImage = ego.add.image(0, 0, 'StartTextImage').setScale(1);
		let startSmallLight = ego.add.image(0, 0, 'StartSmallLight').setAlpha(1);
		let startRollLight = ego.add.image(0, 0, 'StartRollLight').setAlpha(1);
		this.startWave1 = ego.add.image(0, 0, 'StartWave1').setScale(0.33).setAlpha(0);
		this.startWave2 = ego.add.image(0, 0, 'StartWave2').setScale(0.3);
		ego.anims.create({ key: 'startLightAni', frames: ego.anims.generateFrameNumbers('startLightAni_Sheet'), frameRate: 24, repeat: 0 });
		let startLightAni = ego.add.sprite(0, 0, 'startLightAni_Sheet').setScale(2).setAlpha(1);//反光特效
		//#region 電弧測試_圖片
		this.Arc_out = ego.add.image(0, 0, 'StartOutRollLight').setScale(1).setAlpha(1);
		//#endregion

		this.StartBtnCon.add([
			this.startWave1, this.startWave2, startSmallLight, startRollLight, startTextImage, startLightAni,
			this.Arc_out
		])
		this.StartBtnCon.sendToBack(this.startWave1);
		this.StartBtnCon.sendToBack(this.startWave2);

		//#endregion (圖片)
		//#region _-動畫
		this.startAniTime = { t1: 0, t2: 0, t3: 1, wave: false };
		this.tweens.add({
			targets: this.startAniTime,
			t1: { from: 0, to: 1 },
			duration: 1500,
			repeat: -1,
			onUpdate: function () {
				startSmallLight.angle -= 0.1 * this.startEffectSpeed;
				startRollLight.angle += 0.75 * this.startEffectSpeed;
			}.bind(this),
		})
		this.startNorTask = {
			targets: this.startAniTime,
			t2: { from: 0, to: 1 },
			duration: 1500,
			yoyo: true,
			hold: 650,
			repeat: -1,
			repeatDelay: 1000,
			onStart: function () {
				this.startAniTime.wave = false;
				this.startWave1.scale = 0.33;
				this.startWave1.alpha = 0;
			}.bind(this),
			onYoyo: function () {
				startLightAni.play('startLightAni');
				this.startAniTime.wave = true;
			}.bind(this),
			onRepeat: function () {
				this.startAniTime.wave = false;
				this.startWave1.scale = 0.33;
				this.startWave1.alpha = 0;
			}.bind(this),
			onUpdate: function () {
				if (this.startAniTime.wave) {
					this.startWave1.scale += 0.00225;
					this.startWave1.alpha = Math.sin(this.startAniTime.t2 * 1.07) - 0.05;
				}
			}.bind(this),
		}

		//#region 電弧動畫測試
		this.change_tmp = Phaser.Math.Between(2, 3);
		this.startArcBGAni = this.tweens.add({
			targets: this.startAniTime,
			t3: { from: 0, to: 0.7 },
			duration: 300,
			repeatDelay: 30,
			yoyo: true,
			repeat: this.change_tmp,
			loop: -1,
			loopDelay: 700,
			onLoop: function () {
				let tmp = Phaser.Math.Between(50, 300);
				this.Arc_out.angle += tmp;
				this.change_tmp = Phaser.Math.Between(2, 3);
				this.startArcBGAni.data[0].repeat = this.change_tmp - 1;
			}.bind(this),
			onUpdate: function () {
				this.Arc_out.alpha = this.startAniTime.t3;
			}.bind(this),
		})
		//#endregion

		this.startNorAni = null;
		this.StartAniNormal();
		//#endregion (動畫)
		//#endregion
		//#region _加減注按鈕
		this.BetPlusBtn = new Button(ego, 'Bet++_A', 'Bet++_B', 200, 1158, function () {
			ego.BetNumber(ego.betIndex + 1);
			ego.MusicAndSE.PlaySoundEffect('SE_ChangeBetCoin_A');
		});
		this.BetPlusBtn.main.setScale(0.9).setDepth(4);
		this.BetMinusBtn = new Button(ego, 'Bet--_A', 'Bet--_B', 30, 1158, function () {
			ego.BetNumber(ego.betIndex - 1);
			ego.MusicAndSE.PlaySoundEffect('SE_ChangeBetCoin_A');
		})
		this.BetMinusBtn.main.setScale(0.9).setDepth(4);
		this.MaxBetBtn = new Button(ego, 'MaxBet_A', 'MaxBet_B', -100, -100, function () {
			ego.BetNumber(ego.betArray.length - 1);
			ego.MusicAndSE.PlaySoundEffect('SE_ChangeBetCoin_B');
		});
		//#endregion
		//#region 宙斯顯示特效(修改成中獎顯示特效)
		//宙斯特效
		this.Zeff = [];
		ego.anims.create({ key: 'Zeus_effAni', frames: ego.anims.generateFrameNumbers('Zeus_eff'), duration: 200, repeat: -1 });
		this.Zeff[18] = ego.add.sprite(360, 440, 'Zeus_eff').setScale(1.5).setAlpha(0);

		this.Zeff[17] = ego.add.sprite(504, 580, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[16] = ego.add.sprite(360, 580, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[15] = ego.add.sprite(216, 580, 'Zeus_eff').setScale(1.5).setAlpha(0);

		this.Zeff[14] = ego.add.sprite(648, 720, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[13] = ego.add.sprite(504, 720, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[12] = ego.add.sprite(360, 720, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[11] = ego.add.sprite(216, 720, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[10] = ego.add.sprite(72, 720, 'Zeus_eff').setScale(1.5).setAlpha(0);

		this.Zeff[9] = ego.add.sprite(648, 860, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[8] = ego.add.sprite(504, 860, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[7] = ego.add.sprite(360, 860, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[6] = ego.add.sprite(216, 860, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[5] = ego.add.sprite(72, 860, 'Zeus_eff').setScale(1.5).setAlpha(0);

		this.Zeff[4] = ego.add.sprite(648, 1005, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[3] = ego.add.sprite(504, 1005, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[2] = ego.add.sprite(360, 1005, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[1] = ego.add.sprite(216, 1005, 'Zeus_eff').setScale(1.5).setAlpha(0);
		this.Zeff[0] = ego.add.sprite(72, 1005, 'Zeus_eff').setScale(1.5).setAlpha(0);
		//#endregion
		//#region 爆炸特效
		this.BombingAni = [];
		ego.anims.create({ key: 'BombingAni', frames: ego.anims.generateFrameNumbers('Bombing'), frameRate: 24, repeat: 0 });
		this.BombingAni[18] = ego.add.sprite(360, 440, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[17] = ego.add.sprite(504, 580, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[16] = ego.add.sprite(360, 580, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[15] = ego.add.sprite(216, 580, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[14] = ego.add.sprite(648, 720, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[13] = ego.add.sprite(504, 720, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[12] = ego.add.sprite(360, 720, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[11] = ego.add.sprite(216, 720, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[10] = ego.add.sprite(72, 720, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[9] = ego.add.sprite(648, 860, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[8] = ego.add.sprite(504, 860, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[7] = ego.add.sprite(360, 860, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[6] = ego.add.sprite(216, 860, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[5] = ego.add.sprite(72, 860, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[4] = ego.add.sprite(648, 1005, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[3] = ego.add.sprite(504, 1005, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[2] = ego.add.sprite(360, 1005, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[1] = ego.add.sprite(216, 1005, 'Bombing').setScale(5).setAlpha(0);
		this.BombingAni[0] = ego.add.sprite(72, 1005, 'Bombing').setScale(5).setAlpha(0);
		//#endregion 爆炸特效		
		//#region 珠子Buff
		this.StartEndJewellery = true;//控制珠子消失動畫 只進一次
		//#endregion
		//#region Win字
		this.winBoard = ego.add.container(360, 640).setDepth(2).setAlpha(0);
		let winBoardBG = ego.add.image(0, 0, 'scoreBG')
		let winBoardText_Image = ego.add.image(0, -45, 'scoreWinText')
		this.winScore_bitText = ego.add.bitmapText(5, 40, 'winScore', 100).setOrigin(0.5, 1);
		this.winBoard.add([winBoardBG, winBoardText_Image, this.winScore_bitText]);
		//#endregion
		//#region BigWin
		this.bigWinCon = ego.add.container(360, 575).setDepth(77).setScale(0);
		let bigWinLight = ego.add.image(0, 0, 'bigWin_Light_0')
		let bigWinBG = ego.add.image(0, 0, 'bigWin_BG_0');
		let bigWinWord = ego.add.image(0, -20, 'bigWin_Word_0');
		let bigWinBG_W = ego.add.image(0, 0, 'bigWin_BG_White_0').setAlpha(0);
		let bigWinWord_W = ego.add.image(0, -20, 'bigWin_Word_White_0').setAlpha(0);
		let bigWinBG_forEffect = ego.add.image(0, 0, 'bigWin_BG_White_0').setVisible(false);

		this.bigWinScore_bitText = ego.add.bitmapText(0, 75, 'bigWinScore', 0).setOrigin(0.5, 1).setScale(1);

		this.bigWinCon.add([
			bigWinLight, bigWinBG, bigWinWord, this.bigWinScore_bitText, bigWinBG_W, bigWinWord_W, bigWinBG_forEffect
		])
		//#endregion

		this.blackCover = ego.add.image(360, 640, 'blackCover').setOrigin(0.5).setDepth(75).setAlpha(0).setInteractive();

		this.RollBarControl.create(this.prize);
		this.Odd.create();
		this.MusicAndSE.create();
		this.Leaderboard.create();
		this.PhysicalSystem.create();

		this.historyBtn = new Button(ego, 'his_hisBtn', 'his_hisBtn', 113, 1247, (function () {
			// this.WinEffectCtrl.StopShow();  //開啟時關閉中獎顯示
			this.History.Occur(true);
		}).bind(this));
		this.historyBtn.main.setDepth(4);

		this.scene.bringToTop('Message');
		this.scene.bringToTop('ScrollText');
		this.scene.bringToTop('History');
		this.scrollText.UICon.setVisible(true);
		this.scrollText.playerNameText.setText('玩家名稱');
		this.BtnAllDisable(true);//開啟全部按鈕禁用狀態
		this.Message.ShowMessage('等待資料', true, false, true);//開啟等待資料遮罩畫面

		if (this.phpServer) {
			Socket_php.init(this);
		} else {
			if (!this.isFirst) {
				MySocket.init(this);
			}
		}

		this.BetNumber(this.betIndex);
		this.History.myCreate();
	}
	update() {
		if (!this.phpServer) { MySocket.update(); }
		switch (this.status) {//遊戲狀態
			case -1://空白
				break;

			case 0://等待	
				///console.log('等待')
				break;
			case 1://滾輪滾動
				this.RollBarControl.update();

				this.SetNewPrize();
				this.StartMode();
				break;
		}
		if (this.showBigWinCoin || !this.PhysicalSystem.allCoinOut) {
			this.PhysicalSystem.Action();
		}

		this.Hercules.update();
		this.JewelleryControl.update();
	}
	//#region 更改金錢
	SetMyMoney(value) {
		this.myMoney = value;
		let final = ChangeNumText_Comma(this.myMoney);
		this.upUIMoneyText.setText(final);
		this.exchangeText.setText(ChangeNumText_Comma((value / this.moneyChangeOdd), 2));
		// console.log(this.myMoney);
	}
	setDeposit(value, pt, amount) {
		let mark = '+';
		let absValue = Math.abs(value);
		this.addMoneyText.setText(mark + ChangeNumText_Comma(absValue));
		this.addMoneyAni.restart();

		// this.SetMyMoney(this.myMoney + value);
		this.finalScore = pt == null ? (this.myMoney + value) : pt;
		this.UpdateScore(100);
	}
	setTakeout(value, pt, amount) {
		let mark = '-';
		let absValue = Math.abs(value);
		this.addMoneyText.setText(mark + ChangeNumText_Comma(absValue));
		this.addMoneyAni.restart();

		// this.SetMyMoney(this.myMoney + value);
		this.finalScore = pt == null ? (this.myMoney + value) : pt;
		this.UpdateScore(100);
	}
	//#endregion 更改金錢
	//#region 爆炸特效
	StartBombAni() {
		for (let i = 0; i < this.P_prize_win.length; i++) {
			let tmp = this.P_prize_win[i];
			this.BombingAni[tmp].setAlpha(1);
			this.BombingAni[tmp].play('BombingAni');
			this.RollBarControl.WinEliminateObject(this.prize[tmp], tmp);
		}
		this.P_prize_win = [];
	}
	//#endregion 爆炸特效
	//#region 開始遊戲
	StartRolling() {
		if (this.disLink) { //防止斷線重連時按開始
			if (this.Message.messageCon.list[1].text != '斷線重連中') {
				this.Message.ShowMessage('斷線重連中', true, false, true);
				this.status = -1;
			}
		}
		this.RollBarControl.OnStartGame();
		if (this.P_FreeGame == false) {
			if (!this.disLink) {
				this.updateHistory = false;

				if (this.phpServer) { Socket_php.bet(this.myBet); }
				else { cmd_Bet.send(this.myBet); }

				SetCookie('State', 1);
				SetCookie('LastBet', this.myBet);
				this.SetMyMoney(this.myMoney - this.myBet);

				this.haveCountAuto = false;
			}
		}
		else if (this.P_FreeGame == true) {
			this.JewelleryControl.PacketFinish = true;
			this.SetFreeGameAns();
			this.JewelleryControl.ControlShowJewellery(this.P_prize_jewellery, this.P_prize_jewellerytext, this.P_prize_role, this.P_FreeGame);
			this.MusicAndSE.PlaySoundEffect('SE_ChangRole');
		}
		//#region Buff珠子
		// this.JewelleryControl.ControlShowJewellery(this.P_prize_jewellery, this.P_prize_jewellerytext, this.P_prize_role, this.P_FreeGame);
		this.StartEndJewellery = true;
		//#endregion


		this.AllCubeFinish = false;
		this.AllFinish = false;
		this.meStart = 1;
		this.status = 1;
		this.betListOpen.disable(true);
		this.BetPlusBtn.disable(true, 'Bet++_C');
		this.BetMinusBtn.disable(true, 'Bet--_C');
		this.MaxBetBtn.disable(true, 'MaxBet_C');
		// this.historyBtn.disable(true, 'his_hisBtn');
		// console.log('Start');

		//#region 開始按鈕的動畫
		this.StartAniDown();
		let timeline = this.tweens.createTimeline();
		timeline.add({
			targets: this.StartBtnCon,
			scale: 1.05,
			duration: 125,
			ease: 'Sine.Out',
			onStart: function () {
				this.startEffectSpeed = 25;
				this.startWave2.scale = 0.3;
				this.StartArcAniFast();
			}.bind(this),
		})
		timeline.add({
			targets: this.StartBtnCon,
			scale: 0.95,
			duration: 100,
			ease: 'Sine.In'
		})
		timeline.add({
			targets: this.startWave2,
			scale: 1,
			duration: 350,
			onUpdate: function () {
				this.startWave2.alpha = Math.sin(this.startWave2.scale * 3.14) - 0.25;
			}.bind(this),
			offset: '-=225'
		})
		timeline.play();
		this.MusicAndSE.PlaySoundEffect('SE_StartRoll');
		//#endregion (開始按鈕的動畫)
	}
	//#endregion 開始遊戲
	//#region WDbg中獎提示動畫
	StartWDbgAni() {
		this.SetBoom(this.index, this.P_FreeGame);
		for (let k = 0; k < this.P_prize_win.length; k++) {
			let tmp = this.P_prize_win[k];
			this.startWDbgTask.targets.push(this.Zeff[tmp]);
			this.status_win = -1;

			let obj = this.prize[this.P_prize_win[k]];
			if (obj.myFrame < 9) obj.play('cube_' + obj.myFrame + '_Ani');
		}
		this.tweens.add(this.startWDbgTask);
	}
	//#endregion
	//#region 回傳歸零狀態 true完成歸零
	SetNewPrize() {
		if (this.RollBarControl.returnRollZero() == true) {
			// this.SetRandPirze();//隨機給答案	
			this.RollBarControl.setzero = false;
			this.status_win = 0;
			// console.log(this.prize_NO);
		}
	}
	//#endregion
	//#region 回傳掉落狀態 true完成掉落
	StartMode() {
		if (this.RollBarControl.returnStart() == true) {
			if (this.Winning == true) {
				if (this.P_ContinuousBoomTimes != 0) {
					switch (this.status_win) {//遊戲狀態
						case -1://空白
							break;
						case 0://中獎提示動畫
							this.MusicAndSE.PlaySoundEffect('SE_Current1');
							this.StartWDbgAni();
							break;
						case 1://開啟爆炸動畫
							this.MusicAndSE.PlaySoundEffect('SE_burst1');
							this.StartBombAni();
							this.JewelleryControl.ControlJewellery(this.P_JewelleryMove, this.P_FreeGame);
							this.status_win = 2;
							break;
						case 2://整理方塊順序
							this.RollBarControl.WinOrderObject();
							this.SetPirze(this.index + 1, this.P_FreeGame);
							this.status_win = 3;
							break;
						case 3://新方塊掉落
							this.RollBarControl.WinStartDownObject();
							this.status_win = 4;
							break;
						case 4://新方塊掉落完畢
							if (this.RollBarControl.WDFinish == true) {
								this.P_ContinuousBoomTimes--;
								this.RollBarControl.WDFinish = false;
								this.SetSituationMoney(this.index, this.P_FreeGame);
								this.RollBarControl.ResetTmpObject();
								this.WinScore(500);
							}
							if (this.P_ContinuousBoomTimes != 0) {
								if (this.ScoreBoardAniFinish == true) {
									this.status_win = 0;
									this.index++;
									this.ScoreBoardAniFinish = false;
								}
							}
							break;
					}
				}
				else if (this.P_ContinuousBoomTimes == 0) {
					this.Winning = false;
				}
			}
			else if (this.Winning == false) {
				if (!this.updateHistory) {
					this.History.UpdateNowShowAry();
					this.updateHistory = true;
				}

				if (this.StartEndJewellery == true) {
					this.JewelleryControl.ControlCloseJewellery(this.JewelleryControl.getJewelleryWinning(), this.P_FreeGame, true);
					for (let i = 0; i < 4; i++) {
						this.JewelleryControl.JewelleryWinning[i] = false;
						// this.JewelleryControl.P_JewelleryClose_tmp[i] = false;
					}
					this.StartEndJewellery = false;
				}
				if (this.JewelleryControl.getJewelleryFinish()) {
					if (this.autoTimes > 0 || this.autoTimes <= -1) {
						if (this.autoTimes > 0 && !this.haveCountAuto) { this.autoTimes--; this.ChangeAutoTimes(); this.haveCountAuto = true; }
					} else if (this.autoTimes == 0) {
						this.auto = false;
						this.ShowAutoTimes(false);
					}

					if (this.ScoreBoardAniFinish == true && this.moneyFinish == true) {
						if (this.status_BG != 0) {
							if (this.status_BG == 2) { this.MusicAndSE.ChangeBGM(1, true, 600); }
							else if (this.status_BG == 1) { this.MusicAndSE.ChangeBGM(0, true, 600); }
							this.Hercules.changeBackGround(this.status_BG);
							this.status = 0;
							this.status_BG = 0;
						}
						else if (this.status_BG == 0) {
							if (this.P_FreeGameTimes > 0) {
								this.P_FreeGame = true;
								this.Free_index++;
								this.P_FreeGameTimes--;
								this.meStart = 0;
								if (this.startEffectSpeed === 25) {
									this.StartAniNormal();
									this.StartArcAniNormal();
								}
								this.Hercules.free_number.text = ChangeNumText_Comma(this.P_FreeGameTimes);
								this.StartBtn.disable(false);
								this.StartRolling();
								if (this.P_FreeGameTimes == 0) { this.status_BG = 1; }
							}
							else if (this.P_FreeGameTimes == 0) {
								this.P_FreeGame = false;
								this.Free_index = -1;
								this.P_FreeGameTimes = 0;
								this.AllFinish = true;
								if (this.auto) {
									this.meStart = 0;
									if (this.startEffectSpeed === 25) {
										this.StartAniNormal();
										this.StartArcAniNormal();
									}
									this.StartBtn.disable(false);
									if (this.haveMoneyfromSer == true) { this.SetMyMoney(this.PointsMoney); this.haveMoneyfromSer = false; }
									//#region 自動開始 金額不足擋下程式
									if (this.myMoney >= this.myTotalBet) {
										this.StartRolling();
									}
									else {
										this.Message.ShowMessage(this.CoinName + ' 不足', true, true, false);
										console.log('錢不夠 押注金額: ' + this.myTotalBet + '你的錢: ' + this.myMoney);
										this.betListOpen.disable(false);
										this.BetPlusBtn.disable(false, 'Bet++_C');
										this.BetMinusBtn.disable(false, 'Bet--_C');
										this.MaxBetBtn.disable(false, 'MaxBet_C');
										// this.historyBtn.disable(false, 'his_hisBtn');

										this.auto = false;
										this.AutoBtn.changeBtnImage('Auto_A', 'Auto_B');
										this.status = 0;
									}
									//#endregion
								}
								else if (!this.auto) {
									this.meStart = 0;
									this.betListOpen.disable(false);
									this.BetPlusBtn.disable(false, 'Bet++_C');
									this.BetMinusBtn.disable(false, 'Bet--_C');
									this.MaxBetBtn.disable(false, 'MaxBet_C');
									// this.historyBtn.disable(false, 'his_hisBtn');
									if (this.startEffectSpeed === 25) {
										this.StartAniNormal();
										this.StartArcAniNormal();
									}
									this.StartBtn.disable(false);
									this.status = 0;
									if (this.haveMoneyfromSer == true) { this.SetMyMoney(this.PointsMoney); this.haveMoneyfromSer = false; }
								}
							}
							this.AllCubeFinish = true;
							this.ScoreBoardAniFinish = false;
							this.moneyFinish = false;
						}
					}
					else if (this.MissWin == true) {
						if (this.status_BG != 0) {
							if (this.status_BG == 2) { this.MusicAndSE.ChangeBGM(1, true, 600); }
							else if (this.status_BG == 1) { this.MusicAndSE.ChangeBGM(0, true, 600); }
							this.Hercules.changeBackGround(this.status_BG);
							this.status = 0;
							this.status_BG = 0;
						}
						else if (this.status_BG == 0) {
							if (this.P_FreeGameTimes > 0) {
								this.P_FreeGame = true;
								this.Free_index++;
								this.P_FreeGameTimes--;
								this.meStart = 0;
								if (this.startEffectSpeed === 25) {
									this.StartAniNormal();
									this.StartArcAniNormal();
								}
								this.Hercules.free_number.text = ChangeNumText_Comma(this.P_FreeGameTimes);
								this.StartBtn.disable(false);
								this.StartRolling();
								if (this.P_FreeGameTimes == 0) { this.status_BG = 1; }
							}
							else if (this.P_FreeGameTimes == 0) {
								this.P_FreeGame = false;
								this.Free_index = -1;
								this.P_FreeGameTimes = 0;
								this.AllFinish = true;
								if (this.auto) {
									this.meStart = 0;
									if (this.startEffectSpeed === 25) {
										this.StartAniNormal();
										this.StartArcAniNormal();
									}
									this.StartBtn.disable(false);
									if (this.haveMoneyfromSer == true) { this.SetMyMoney(this.PointsMoney); this.haveMoneyfromSer = false; }
									//#region 自動開始 金額不足擋下程式
									if (this.myMoney >= this.myTotalBet) {
										this.StartRolling();
									}
									else {
										this.Message.ShowMessage(this.CoinName + ' 不足', true, true, false);
										console.log('錢不夠 押注金額: ' + this.myTotalBet + '你的錢: ' + this.myMoney);
										this.betListOpen.disable(false);
										this.BetPlusBtn.disable(false, 'Bet++_C');
										this.BetMinusBtn.disable(false, 'Bet--_C');
										this.MaxBetBtn.disable(false, 'MaxBet_C');
										// this.historyBtn.disable(false, 'his_hisBtn');
										this.auto = false;
										this.AutoBtn.changeBtnImage('Auto_A', 'Auto_B');
										this.status = 0;
									}
									//#endregion
								}
								else if (!this.auto) {
									this.meStart = 0;
									this.betListOpen.disable(false);
									this.BetPlusBtn.disable(false, 'Bet++_C');
									this.BetMinusBtn.disable(false, 'Bet--_C');
									this.MaxBetBtn.disable(false, 'MaxBet_C');
									// this.historyBtn.disable(false, 'his_hisBtn');
									if (this.startEffectSpeed === 25) {
										this.StartAniNormal();
										this.StartArcAniNormal();
									}
									this.StartBtn.disable(false);
									this.status = 0;
									if (this.haveMoneyfromSer == true) { this.SetMyMoney(this.PointsMoney); this.haveMoneyfromSer = false; }
								}
							}
							this.AllCubeFinish = true;
						}
					}
				}
			}
		}
	}
	//#endregion
	StartAniNormal() {
		this.StartBtnCon.scale = 0.95;
		if (this.startNorAni != null) { this.startNorAni.remove(); }
		this.startNorAni = this.tweens.add(this.startNorTask);
		this.startEffectSpeed = 1;
	}
	StartAniDown() {
		if (this.startNorAni != null) { this.startNorAni.remove(); }
		this.startAniTime.t2 = 0; this.startAniTime.wave = false;
		this.startWave1.setScale(0.33).setAlpha(0);
		this.startEffectSpeed = -0.05;

		this.StartBtnCon.scale = 0.9;
	}
	//#region 開始按鈕電弧背景動畫
	StartArcAniNormal() {
		this.startArcBGAni.data[0].duration = 300;
		this.startArcBGAni.loopDelay = 700;
	}
	StartArcAniFast() {
		this.startArcBGAni.data[0].duration = 50;
		this.startArcBGAni.loopDelay = 0;
	}
	//#endregion
	//#region _押注
	BetNumber(index) {
		//#region 押注金額頭尾相連 例: 最小金額 減注 變成最大金額
		// if (index > this.array.length - 1) { index = 0; }
		// else if (index < 0) { index = this.array.length - 1; }
		//#endregion
		//#region 押注金額頭尾不相連 例: 最小金額 減注 還是最小金額
		if (index > this.betArray.length - 1) { index = 0; }
		else if (index < 0) { index = 0; }
		//#endregion
		this.betIndex = index;
		this.myBet = this.betArray[index];
		this.myTotalBet = this.myBet;
		this.betText.setText(ChangeNumText_Comma(this.myBet));
		this.BetBoard.ChangeBet(index);
		//this.totalBetText.setText(this.ChangeNumText_Comma(this.myTotalBet));//總押注洗分

		this.MoneyNotEnough(this.myTotalBet > this.finalScore);
		this.Odd.ChangeOddText(this.myTotalBet);

		if (this.ApiCtrl != null) { this.ApiCtrl.sendBetToBigJackpot(this.myTotalBet); }
	}
	//#endregion 押注
	//#region _按鈕Disable
	BtnDisable(disable, alsoAuto = false) {
		if (alsoAuto) {
			this.StartBtn.disable(disable, 'Start_A');
			this.betListOpen.disable(disable);
			this.BetPlusBtn.disable(disable, 'Bet++_C');
			this.BetMinusBtn.disable(disable, 'Bet--_C');
			this.MaxBetBtn.disable(disable, 'MaxBet_C');
			// this.historyBtn.disable(disable, 'his_hisBtn');
			this.AutoBtn.disable(disable, 'Auto_A')

			this.auto = false;
			if (disable) {
				if (this.startNorAni != null) { this.startNorAni.remove(); }
				this.startEffectSpeed = 0;
			} else {
				this.startNorAni = this.tweens.add(this.startNorTask);
				this.startEffectSpeed = 1;
			}

		} else if (!(!disable && this.RollBarControl.returnStart())) {	//防止「當解除自動、並且滾輪仍在轉」時, 按鈕被解除鎖定			
			this.StartBtn.disable(disable, 'Start_A');
			this.betListOpen.disable(disable);
			this.BetPlusBtn.disable(disable, 'Bet++_C');
			this.BetMinusBtn.disable(disable, 'Bet--_C');
			this.MaxBetBtn.disable(disable, 'MaxBet_C');
			// this.historyBtn.disable(disable, 'his_hisBtn');
		}
		if (!disable) { SetCookie('State', 0); }
	}
	//#endregion 按鈕Disable
	//#region _按鈕全部Disable(進遊戲等封包 保險用)
	BtnAllDisable(disable) {
		if (disable) {
			this.StartBtn.disable(disable, 'Start_A');
			this.betListOpen.disable(disable);
			this.BetPlusBtn.disable(disable, 'Bet++_C');
			this.BetMinusBtn.disable(disable, 'Bet--_C');
			this.MaxBetBtn.disable(disable, 'MaxBet_C');
			// this.historyBtn.disable(disable, 'his_hisBtn');
			this.AutoBtn.disable(disable, 'Auto_A')
		}
		else if (!disable) {
			this.StartBtn.disable(disable, 'Start_A');
			this.betListOpen.disable(disable);
			this.BetPlusBtn.disable(disable, 'Bet++_C');
			this.BetMinusBtn.disable(disable, 'Bet--_C');
			this.MaxBetBtn.disable(disable, 'MaxBet_C');
			// this.historyBtn.disable(disable, 'his_hisBtn');
			this.AutoBtn.disable(disable, 'Auto_A')
		}
	}
	//#endregion
	//#region _錢不夠
	MoneyNotEnough(notEnough) {
		this.BtnDisable(false);
		this.auto = false;
		this.notEnoughMoney = notEnough;
		if (notEnough) {//錢不夠
			this.AutoBtn.changeBtnImage('Auto_A', 'Auto_B');
		} else {//錢夠
			this.StartBtn.changeBtnImage('Start_A', 'Start_B');
			this.AutoBtn.changeBtnImage('Auto_A', 'Auto_B');
			this.AutoBtn.changeChangeStage(true);
		}
	}
	//#endregion 錢不夠
	//#region 洗分動畫
	ScoreBoardAni(delayT) {
		let ego = this;

		this.scoreAniPlaying = true;
		let timeline = ego.tweens.createTimeline();

		//#region 移動到定位
		timeline.add({
			targets: ego.winBoard,
			alpha: { from: 0, to: 1 },
			duration: 400,
			delay: delayT,
			ease: 'Sine.Out',
			completeDelay: 1500,
		})
		//#endregion (移動到定位)
		//#region 放回版上
		timeline.add({
			targets: ego.winBoard,
			alpha: { from: 1, to: 0 },
			duration: 1000,
			ease: 'Sine.Out',
			onComplete: function () {
				if (this.P_ContinuousBoomTimes == 0) {
					this.scoreAniPlaying = false;

					if (!this.P_FreeGame) { this.UpdateScore(500); }
					else { ego.moneyFinish = true; }

					if (this.auto) {
						//this.StartAuto();
					} else {
						// if (this.PrizeLine.wholeLineCon.length <= 1) {
						// 	this.MusicAndSE.ChangeBGM(0, true)
						// }
						this.BtnDisable(this.auto);
					}
				}
				this.ScoreBoardAniFinish = true;
			}.bind(this)
		})
		//#endregion
		timeline.play();
	}
	WinScore(totalTime, isBonus = false, delayT = 0) {
		if (this.tmpScore > 0) {
			if (this.tmpScore >= this.myBet * 50) {
				let tmp = this.tmpScore / this.myBet;
				let level = tmp < 100 ? 1 : tmp < 200 ? 2 : tmp < 500 ? 3 : 4;
				this.BigWinOccur(true, level, delayT);
				console.log('進BigWin');
			} else {
				this.ScoreBoardAni(delayT);

				let ego = this;

				this.targetWinScore += this.tmpScore;

				let tmpTargetWinScore = this.targetWinScore;
				let tmpmyWinScore = this.myWinScore;

				let plus = 0;
				let dis = isBonus ? this.tmpScore : tmpTargetWinScore - tmpmyWinScore;
				let final = 0;


				let time = { t: 0 }
				this.tweens.add({
					targets: time,
					t: 1,
					duration: 800,
					delay: delayT,
					onUpdate: function () {
						plus = Math.round(dis - (dis * (1 - time.t)));
						final = tmpmyWinScore + plus;
						ego.winMoneyText.setText(ChangeNumText_Comma(final));
						ego.winScore_bitText.text = ChangeNumText_Comma(plus);
						ego.MusicAndSE.PlaySoundEffect('SE_WinScore_B');
					},
					onComplete: function () {
						ego.winMoneyText.setText(ChangeNumText_Comma(tmpTargetWinScore));
						ego.winScore_bitText.text = ChangeNumText_Comma(dis)
						ego.myWinScore = ego.targetWinScore;
					}
				})
				this.tmpScore = 0;
			}
		}

	}
	UpdateScore(totalTime) {
		let ego = this;

		if (ego.updateScoreAni != null) { ego.updateScoreAni.remove(); }

		let tmpMyScore = ego.finalScore - ego.myMoney //ego.myWinScore;
		let tmpWinScore = ego.myWinScore;
		ego.myWinScore = ego.targetWinScore = 0;

		let plus = 0;
		let plus2 = 0;
		let dis = tmpMyScore;
		let dis2 = tmpWinScore;
		let final = 0;
		let final2 = 0;

		let time = { t: 0 }
		ego.updateScoreAni = ego.tweens.add({
			targets: time,
			t: { from: 0, to: 1 },
			duration: totalTime,
			onUpdate: function () {
				plus = Math.round(dis - (dis * (1 - time.t)));
				plus2 = Math.round(dis2 - (dis2 * (1 - time.t)));

				final = tmpWinScore - plus2;
				ego.winMoneyText.setText(ChangeNumText_Comma(final));

				final2 = ego.myMoney + plus;
				ego.upUIMoneyText.setText(ChangeNumText_Comma(final2));
				ego.exchangeText.setText(ChangeNumText_Comma((final2 / ego.moneyChangeOdd), 2));
			},
			onComplete: function () {
				ego.myMoney = ego.finalScore;
				ego.winMoneyText.setText(ChangeNumText_Comma(0));
				ego.winScore_bitText.text = 0;
				ego.moneyFinish = true;
			}
		})
	}
	ChangeNumText_Comma(value) {
		let st = value < 0 ? "-" : "";
		let i = String(parseInt(value = Math.abs(Number(value) || 0).toFixed(fix)));
		let j = i.length > 3 ? i.length % 3 : 0;
		return st + (j ? i.substring(0, j) + ',' : "") + i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + ',') + (fix ? '.' + Math.abs(value - i).toFixed(2).slice(2) : "");
	}
	//#endregion 洗分
	//#region BigWin
	BigWinOccur(occur = false, toLevel = 0, delayT = 0) {
		this.scoreAniPlaying = occur;

		if (occur) {
			this.PhysicalSystem.coinMaxNum = 10;
			this.bigWinCon.list[0].setTexture('bigWin_Light_0');
			this.bigWinCon.list[1].setTexture('bigWin_BG_0');
			this.bigWinCon.list[2].setTexture('bigWin_Word_0');
			this.bigWinCon.list[4].setTexture('bigWin_BG_White_0');
			this.bigWinCon.list[5].setTexture('bigWin_Word_White_0');
			this.bigWinCon.list[6].setTexture('bigWin_BG_White_0');
			this.BigWinScore(toLevel, delayT);

			if (this.forEvent_AllPlateStop && this.isAllPlate) {
				this.auto = false;
				this.AutoBtn.changeBtnImage('Auto_A', 'Auto_B');
			}
		} else {


			this.nowBigWinLevel = 0;
			this.showBigWinCoin = false;
		}

		let timeline = this.tweens.createTimeline();
		timeline.add({
			targets: this.bigWinCon,
			scale: { from: occur ? 0 : 1, to: occur ? 1.2 : 0 },
			delay: delayT,
			duration: occur ? 500 : 250,
			ease: 'Sine.Out',
			onStart: function () {
				if (occur) {
					this.MusicAndSE.ChangeBGM(2);
					this.blackCover.setAlpha(0.5);
					this.MusicAndSE.PlaySoundEffect('SE_BigWinCoin', true);

					this.showBigWinCoin = true;
					this.PhysicalSystem.EffectOn();
				} else {
					// this.MusicAndSE.ChangeBGM(this.isFreeGame ? 2 : this.isPunchGame ? 3 : this.auto ? 1 : 0, true, 1000);
					// if (!this.isFreeGame && !this.isPunchGame) { this.MusicAndSE.ChangeVolume(1, 0.9); }
					this.blackCover.setAlpha(0);

					if (this.forEvent_AllPlateStop && this.isAllPlate) {
						this.WinEffectCtrl.AllPlateFinal(true);
						this.blackCover.setAlpha(0.5);
					}
				}
			}.bind(this),
			onComplete: function () {
				// if (!occur) {
				// 	if (!this.isPunchGame && !this.isFreeGame) {
				// 		if (this.auto) {
				// 			if (this.PrizeLine.wholeLineCon.length <= 1) {
				// 				this.StartAuto();
				// 			}
				// 		} else {
				// 			this.BtnDisable(this.auto);
				// 		}
				// 	} else if (this.isFreeGame) {
				// 		if (this.forEvent_AllPlateStop && this.isAllPlate) {
				// 			this.StartBtn.disable(false, 'Start_A');
				// 		}
				// 		if (!this.freeLogoCon.visible) {
				// 			this.ChangeFreeLogo();
				// 		}
				// 	} else if (this.isPunchGame) {
				// 		if (!this.punchLogoCon.visible) {
				// 			this.ChangePunchLogo();
				// 		}
				// 	}
				// }
			}.bind(this)
		})
		if (occur) {
			timeline.add({
				targets: this.bigWinCon,
				scale: 1,
				duration: 250,
				ease: 'Bounce.Out',
				onStart: function () {
				}.bind(this)
			})
		}
		timeline.play();
	}

	BigWinScore(toLevel = 0, delayT = 0) {
		this.targetWinScore += this.tmpScore;
		let plus = 0;
		let dis = this.tmpScore;
		let final = 0;

		let time = { t: 0 }
		this.tweens.add({
			targets: time,
			t: 1,
			delay: delayT,
			duration: 1500 * toLevel,
			onUpdate: function () {
				plus = Math.round(dis - (dis * (1 - time.t)));
				final = this.myWinScore + plus;
				this.winMoneyText.setText(ChangeNumText_Comma(final));
				this.bigWinScore_bitText.text = plus;
				this.MusicAndSE.PlaySoundEffect('SE_WinScore_B');
				if (toLevel != 0 && (this.nowBigWinLevel + 1) * (1 / toLevel) < time.t) {
					this.BigWinLevelUp();
					this.nowBigWinLevel++;
				}

				this.PhysicalSystem.AddCoin(5);
			}.bind(this),
			completeDelay: 1000,
			onComplete: function () {
				this.winMoneyText.setText(ChangeNumText_Comma(this.targetWinScore));
				this.bigWinScore_bitText.text = plus;
				this.myWinScore = this.targetWinScore;
				// this.UpdateScore(500);
				// this.tmpScore = 0;
				console.log('BigWin結束');
				this.BigWinOccur(false);
				this.MusicAndSE.CloseSoundEffect('SE_BigWinCoin', true);
				if (this.P_FreeGame) { this.MusicAndSE.ChangeBGM(1, true, 600); }
				else if (!this.P_FreeGame) { this.MusicAndSE.ChangeBGM(0, true, 600); }
				if (this.P_ContinuousBoomTimes == 0) {
					this.scoreAniPlaying = false;
					this.UpdateScore(500);
					// if (this.auto) {
					// 	this.StartAuto();
					// } else {
					// 	this.BtnDisable(this.auto);
					// }
				}
				this.ScoreBoardAniFinish = true;
			}.bind(this)
		})
	}

	BigWinLevelUp() {
		this.PhysicalSystem.coinMaxNum = 25 * (this.nowBigWinLevel + 1) + Math.pow(5, this.nowBigWinLevel + 1);
		let timeline = this.tweens.createTimeline();
		timeline.add({
			targets: this.bigWinCon,
			scale: { from: 1, to: 1.6 },
			duration: 175,
			ease: 'Sine.Out',
		})
		timeline.add({
			targets: [this.bigWinCon.list[4], this.bigWinCon.list[5], this.bigWinCon.list[6]],
			alpha: { from: 0, to: 1 },
			duration: 175,
			ease: 'Cubic.Out',
			offset: '-=175'
		})
		timeline.add({
			targets: this.bigWinCon.list[6],
			scale: { from: 1, to: 3 },
			alpha: { from: 0.5, to: 0 },
			duration: 300,
			onStart: function () {
				this.bigWinCon.list[6].setVisible(true);

				this.bigWinCon.list[0].setTexture('bigWin_Light_' + this.nowBigWinLevel);
				this.bigWinCon.list[1].setTexture('bigWin_BG_' + this.nowBigWinLevel);
				this.bigWinCon.list[2].setTexture('bigWin_Word_' + this.nowBigWinLevel);

			}.bind(this),
			offset: '-=0'
		})

		timeline.add({
			targets: this.bigWinCon,
			scale: 1,
			duration: 250,
			ease: 'Bounce.Out',
			offset: '-=300'
		})
		timeline.add({
			targets: [this.bigWinCon.list[4], this.bigWinCon.list[5], this.bigWinCon.list[6]],
			alpha: { from: 1, to: 0 },
			duration: 250,
			ease: 'Cubic.Out',
			offset: '-=250',
			onStart: function () {
				this.MusicAndSE.PlaySoundEffect(this.nowBigWinLevel >= 3 ? 'SE_BigWinLvUP_L' : 'SE_BigWinLvUP_S');
			}.bind(this),
			onComplete: function () {
				if (this.nowBigWinLevel < 3) {
					this.bigWinCon.list[4].setTexture('bigWin_BG_White_' + this.nowBigWinLevel);
					this.bigWinCon.list[5].setTexture('bigWin_Word_White_' + this.nowBigWinLevel);
					this.bigWinCon.list[6].setTexture('bigWin_BG_White_' + this.nowBigWinLevel);
				}
				this.bigWinCon.list[6].setVisible(false).setScale(1);
			}.bind(this)
		})

		timeline.play();
	}
	//#endregion
	//#region 隨機給答案
	SetRandPirze() {
		for (let i = 0; i < 19; i++) {
			this.prize_NO[i] = Phaser.Math.Between(0, 9);
			this.prize[i].setFrame(this.prize_NO[i]);
		}
	}
	//#endregion 隨機給答案	
	//#region 錯誤封包固定答案，沒中獎版面
	SetFailPirze() {
		let FailPirze = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7];
		for (let i = 0; i < 19; i++) {
			this.prize_NO[i] = FailPirze[i];
			this.prize[i].setFrame(this.prize_NO[i]);
		}
	}
	//#endregion 錯誤封包固定答案，沒中獎版面
	//#region 自動次數
	ShowAutoTimes(occur) {
		if (occur) {
			this.ChangeAutoTimes();
			this.autoTimesTitle.setVisible(true);
			this.autoTimesText.setVisible(true);
			this.StartBtnCon.list[5].setVisible(false);
			// this.StartBtn.changeBtnImage('StartAuto_A', 'StartAuto_A');
			// this.StartBtn.main.setTexture('StartAuto_A');
		} else {
			this.autoTimesTitle.setVisible(false);
			this.autoTimesText.setVisible(false);
			this.StartBtnCon.list[5].setVisible(true);
			this.AutoBtn.changeBtnImage('Auto_A', 'Auto_A');
			// this.StartBtn.changeBtnImage('Start_A', 'Start_B');
		}
	}
	ChangeAutoTimes() {
		let st = this.autoTimes;
		if (st == -1) { st = '~' };
		this.autoTimesText.setText(st);
	}
	//#endregion
	//#region 封包給答案
	SetAns(BetResult, mainSlotPrize) {
		this.index = 0;
		this.BetResult = BetResult;
		this.mainSlotPrize = mainSlotPrize;
		this.P_ContinuousBoomTimes = mainSlotPrize.WayPrizeList.length - 1;
		this.finalScore = mainSlotPrize.win + this.myMoney;

		this.P_prize_jewellerytext[0] = mainSlotPrize.role[0].mul;
		this.P_prize_role[0] = mainSlotPrize.role[0].sym;
		this.P_FreeGameTimes = mainSlotPrize.addFreeTimes;

		this.Hercules.free_number.text = ChangeNumText_Comma(this.P_FreeGameTimes);
		this.JewelleryControl.ControlShowJewellery(this.P_prize_jewellery, this.P_prize_jewellerytext, this.P_prize_role, this.P_FreeGame);
		this.MusicAndSE.PlaySoundEffect('SE_ChangRole');

		if (mainSlotPrize.mul > 1) { this.P_JewelleryMove[0] = true; }
		else if (mainSlotPrize.addFreeTimes != 0) { this.P_JewelleryMove[0] = true; }
		else { this.P_JewelleryMove[0] = false; }

		// if (this.phpServer) {
		// 	if (mainSlotPrize.WayPrizeList[0].symPrize == null) {
		// 		this.MissWin = true;
		// 		this.Winning = false;
		// 	}
		// 	else {
		// 		this.MissWin = false;
		// 		this.Winning = true;
		// 	}
		// }
		// else {
		if (mainSlotPrize.WayPrizeList[0].symPrize != null && mainSlotPrize.WayPrizeList[0].symPrize.length != 0) {
			this.MissWin = false;
			this.Winning = true;

		}
		else {
			this.MissWin = true;
			this.Winning = false;
		}
		// }

		if (!this.phpServer) {
			SetCookie('State', 2);
			SetCookie('LastRecID', this.BetResult.RecID);
		}
		if (this.quickStop) {
			this.RollBarControl.SetQuickStop();
		}
	}
	SetPirze(value, freeGame) {
		if (freeGame == false) {
			let pai = this.mainSlotPrize.WayPrizeList[value].pai;
			for (let i = 0; i < 19; i++) {
				this.prize_NO[i] = pai[i];
				this.prize[i].setTexture('Hercules_role_cube', this.prize_NO[i]);
				this.prize[i].myFrame = this.prize_NO[i];
			}
		}
		else if (freeGame == true) {
			let pai = this.freeSlotPrize[this.Free_index].WayPrizeList[value].pai;
			for (let i = 0; i < 19; i++) {
				this.prize_NO[i] = pai[i];
				this.prize[i].setTexture('Hercules_role_cube', this.prize_NO[i]);
				this.prize[i].myFrame = this.prize_NO[i];
			}
		}
	}
	SetBoom(value, freeGame) {
		if (freeGame == false) {
			let mask = this.mainSlotPrize.WayPrizeList[value].mask;
			for (let i = 0; i < 19; i++) {
				if ((mask >> i) & 1 == 1) {
					this.P_prize_win.push(i);
				}
			}
		}
		else if (freeGame == true) {
			let mask = this.freeSlotPrize[this.Free_index].WayPrizeList[value].mask;
			for (let i = 0; i < 19; i++) {
				if ((mask >> i) & 1 == 1) {
					this.P_prize_win.push(i);
				}
			}
		}
	}
	SetSituationMoney(value, freeGame) {
		if (freeGame == false) {
			this.tmpScore = this.mainSlotPrize.mul * this.mainSlotPrize.WayPrizeList[value].win;
		}
		else if (freeGame == true) {
			this.tmpScore = this.freeSlotPrize[this.Free_index].mul * this.freeSlotPrize[this.Free_index].WayPrizeList[value].win;
		}
	}
	SetFreeGame(freeSlotPrize) {
		this.freeSlotPrize = freeSlotPrize;
		this.status_BG = 2;
	}
	SetFreeGameAns() {
		this.index = 0;
		this.P_ContinuousBoomTimes = this.freeSlotPrize[this.Free_index].WayPrizeList.length - 1;
		this.finalScore = this.freeSlotPrize[this.Free_index].win + this.myMoney;
		this.P_FreeGameTimes = this.P_FreeGameTimes + this.freeSlotPrize[this.Free_index].addFreeTimes;

		// if (this.phpServer) {
		// 	if () {
		// 		this.MissWin = true;
		// 		this.Winning = false;
		// 	}
		// 	else {
		// 		this.MissWin = false;
		// 		this.Winning = true;
		// 	}
		// }
		// else {
		if (this.freeSlotPrize[this.Free_index].WayPrizeList[0].symPrize != null && this.freeSlotPrize[this.Free_index].WayPrizeList[0].symPrize.length != 0) {
			this.MissWin = false;
			this.Winning = true;
		}
		else {
			this.MissWin = true;
			this.Winning = false;
		}
		// }

		for (let i = 0; i < this.freeSlotPrize[this.Free_index].role.length; i++) {
			this.P_prize_jewellerytext[i + 1] = this.freeSlotPrize[this.Free_index].role[i].mul;
			this.P_prize_role[i + 1] = this.freeSlotPrize[this.Free_index].role[i].sym;

			if (this.freeSlotPrize[this.Free_index].WayPrizeList[0].symPrize == null) { continue; }
			for (let j = 0; j < this.freeSlotPrize[this.Free_index].WayPrizeList[0].symPrize.length; j++) {
				if (this.freeSlotPrize[this.Free_index].role[i].sym == this.freeSlotPrize[this.Free_index].WayPrizeList[0].symPrize[j].sym) {
					this.P_JewelleryMove[i + 1] = true;
				}
			}
		}
	}
	//#endregion
	//#region 收到封包錯誤訊息時 遊戲回復到一般狀態(未斷線)
	SetFailToBet(ErrMsg) {
		// this.Message.ShowMessage('押注失敗', true, true, false, true);//開啟等待資料遮罩畫面
		this.Message.ShowDark(ErrMsg, true, true);
		this.FailToBet = true;
		this.JewelleryControl.Role.BufferFinish = true;
		this.StartEndJewellery = false;
		this.AllCubeFinish = true;
		this.AllFinish = true;
		this.meStart = 0;
		this.status = 1;
		this.BtnAllDisable(false);//開啟全部按鈕禁用狀態
		if (this.startEffectSpeed === 25) {
			this.StartAniNormal();
			this.StartArcAniNormal();
		}
		if (this.auto == true) { this.auto = false; this.AutoBtn.changeBtnImage('Auto_A', 'Auto_B'); }
		this.SetMyMoney(this.myMoney + this.myBet);
	}
	//#endregion
	//#region 斷線重連
	ReShowBetResult() {
		let state = GetCookie('State');
		if (state != 0) {
			let lastBet = GetCookie('LastBet');
			let lastRecID = GetCookie('LastRecID');

			cmd_ReBet.send(state, lastBet, lastRecID);
			console.log(state, lastBet, lastRecID);
		} else {
			console.log(state);
		}
	}
	//#endregion
}
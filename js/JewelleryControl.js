import { CustomScene } from './CustomTools.js';
import { JewelleryAin } from './JewelleryAin.js';
import { Role } from './Role.js';

export class JewelleryControl extends CustomScene {
    constructor(game) {
        super("JewelleryControl");
        this.mainGame = game;
        this.Role = new Role(this.mainGame);
        this.CubicBezier_0 = { control1X: 350, control1Y: 100, control2X: 350, control2Y: 100 }
        this.JewelleryAin_0 = new JewelleryAin(this.mainGame, 520, 210,
            this.CubicBezier_0.control1X, this.CubicBezier_0.control1Y, this.CubicBezier_0.control2X, this.CubicBezier_0.control2Y, 50, 25, 0);
        this.CubicBezier_1 = { control1X: 350, control1Y: 100, control2X: 350, control2Y: 100 }
        this.JewelleryAin_1 = new JewelleryAin(this.mainGame, 520, 210,
            this.CubicBezier_1.control1X, this.CubicBezier_1.control1Y, this.CubicBezier_1.control2X, this.CubicBezier_1.control2Y, 50, 25, 0);
        this.CubicBezier_2 = { control1X: 350, control1Y: 100, control2X: 350, control2Y: 100 }
        this.JewelleryAin_2 = new JewelleryAin(this.mainGame, 430, 150,
            this.CubicBezier_2.control1X, this.CubicBezier_2.control1Y, this.CubicBezier_2.control2X, this.CubicBezier_2.control2Y, 90, 35, 1);
        this.CubicBezier_3 = { control1X: 350, control1Y: 100, control2X: 350, control2Y: 100 }
        this.JewelleryAin_3 = new JewelleryAin(this.mainGame, 620, 150,
            this.CubicBezier_3.control1X, this.CubicBezier_3.control1Y, this.CubicBezier_3.control2X, this.CubicBezier_3.control2Y, 120, 45, 2);
    }


    preload() {
        let ego = this.mainGame;
        this.Role.preload();
        ego.load.setBaseURL('./');
        // ego.onceload.spritesheet('JewelleryContinuousGraph', 'assets/Role/shineboll.png', { frameWidth: 150, frameHeight: 150 });
        ego.onceload.spritesheet('JewelleryContinuousGraph', 'assets/Role/firecircle.png', { frameWidth: 180, frameHeight: 180 });
        ego.onceload.spritesheet('JewelleryBombing', 'assets/Role/Clear_ball_FX.png', { frameWidth: 270, frameHeight: 270 });
        ego.onceload.image('2', 'assets/LightBallText/wild-X/hercules_lightball_wild_x2.png');
        ego.onceload.image('3', 'assets/LightBallText/wild-X/hercules_lightball_wild_x3.png');
        ego.onceload.image('5', 'assets/LightBallText/wild-X/hercules_lightball_wild_x5.png');
        ego.onceload.image('10', 'assets/LightBallText/wild-X/hercules_lightball_wild_x10.png');
        ego.onceload.image('20', 'assets/LightBallText/wild-X/hercules_lightball_wild_x20.png');
        ego.onceload.image('50', 'assets/LightBallText/wild-X/hercules_lightball_wild_x50.png');
        ego.onceload.image('100', 'assets/LightBallText/wild-X/hercules_lightball_wild_x100.png');
        ego.onceload.image('200', 'assets/LightBallText/wild-X/hercules_lightball_wild_x200.png');
        ego.onceload.image('freegame', 'assets/LightBallText/hercules_lightball_freegame.png');
    }
    create() {
        let ego = this.mainGame;
        this.Role.create();//角色
        this.JewelleryAin_3.create();
        this.JewelleryAin_2.create();
        this.JewelleryAin_1.create();
        this.JewelleryAin_0.create();
        this.JewelleryWinning = [false, false, false, false];//控制全部光球是否移動(中獎)
        // this.P_JewelleryClose_tmp = [false, false, false, false];//有修改過 原本用來控制連爆途中哪些光球爆炸過
        this.Pinch = [false, false, false, false];
        this.PacketFinish = false;
    }
    ControlJewellery(P_Jewellery, freeGame) {
        if (freeGame == false) {
            if (P_Jewellery[0] == true) {
                this.JewelleryAin_0.PlayMoveJewelleryAni();
                this.JewelleryWinning[0] = true;
                P_Jewellery[0] = false;
            }
        }
        else {
            if (P_Jewellery[1] == true) {
                this.JewelleryAin_1.PlayMoveJewelleryAni();
                this.JewelleryWinning[1] = true;
                P_Jewellery[1] = false;
            }
            if (P_Jewellery[2] == true) {
                this.JewelleryAin_2.PlayMoveJewelleryAni();
                this.JewelleryWinning[2] = true;
                P_Jewellery[2] = false;
            }
            if (P_Jewellery[3] == true) {
                this.JewelleryAin_3.PlayMoveJewelleryAni();
                this.JewelleryWinning[3] = true;
                P_Jewellery[3] = false;
            }
        }
    }
    ControlCloseJewellery(P_JewelleryClose, freeGame, AllClose = false) {
        if (freeGame == false) {
            if (P_JewelleryClose[0] == true) {
                // this.P_JewelleryClose_tmp[0] = true;
                this.Role.PlayRoleHeraclesPinch();
                this.Pinch[0] = true;
            }
            else if (P_JewelleryClose[0] == false) {
                this.JewelleryAin_0.PlayNoWinEndJewelleryAni();
            }
            if (AllClose == true) {
                this.Role.DisappearRoleAni(0);
            }
        }
        else {
            if (P_JewelleryClose[1] == true) {
                // this.P_JewelleryClose_tmp[1] = true;
                this.Role.PlayRoleHeraclesPinch();
                this.Pinch[1] = true;
            }
            else if (P_JewelleryClose[1] == false) {
                this.JewelleryAin_1.PlayNoWinEndJewelleryAni();
            }
            if (P_JewelleryClose[2] == true) {
                // this.P_JewelleryClose_tmp[2] = true;
                this.Role.PlayRoleHeraclesPinch();
                this.Pinch[2] = true;
            }
            else if (P_JewelleryClose[2] == false) {
                this.JewelleryAin_2.PlayNoWinEndJewelleryAni();
            }
            if (P_JewelleryClose[3] == true) {
                // this.P_JewelleryClose_tmp[3] = true;
                this.Role.PlayRoleHeraclesPinch();
                this.Pinch[3] = true;
            }
            else if (P_JewelleryClose[3] == false) {
                this.JewelleryAin_3.PlayNoWinEndJewelleryAni();
            }
            if (AllClose == true) {
                this.Role.DisappearRoleAni(1);
                this.Role.DisappearRoleAni(2);
                this.Role.DisappearRoleAni(3);
            }
        }
    }
    ControlShowJewellery(prize, prize_Jewellery, prize_role, freeGame) {
        console.log('Role:' + prize_role);
        let Jewellerytmp = [this.JewelleryAin_0, this.JewelleryAin_1, this.JewelleryAin_2, this.JewelleryAin_3]
        if (freeGame == false) {
            if (prize_Jewellery[0] == -1) { this.JewelleryAin_0.JewelleryText.setTexture('freegame'); }
            else { this.JewelleryAin_0.JewelleryText.setTexture(prize_Jewellery[0]); }
            this.JewelleryAin_0.PlayHoverJewelleryAni();
        }
        else {
            for (let i = 1; i < prize_Jewellery.length; i++) {
                if (prize_Jewellery[i] == -1) { Jewellerytmp[i].JewelleryText.setTexture('freegame'); }
                else { Jewellerytmp[i].JewelleryText.setTexture(prize_Jewellery[i]); }
                Jewellerytmp[i].PlayHoverJewelleryAni();
            }
        }
        //#region 角色顯示
        this.Role.ControlRole(prize_role, freeGame);
        //#endregion
    }
    getJewelleryFinish() {
        if (this.mainGame.P_FreeGame == false) {
            if (this.JewelleryAin_0.getJewelleryEndFinish()) { return true; }
        }
        else if (this.mainGame.P_FreeGame == true) {
            if (this.JewelleryAin_1.getJewelleryEndFinish() && this.JewelleryAin_2.getJewelleryEndFinish() && this.JewelleryAin_3.getJewelleryEndFinish()) {
                return true;
            }
        }
    }
    //#region 回傳全部光球是否移動布林 移動過進入捏爆光球動畫 沒移動進入上升光球動畫
    getJewelleryWinning() {
        return this.JewelleryWinning;
    }
    //#endregion

    //#region 回傳連爆途中哪些光球已經爆掉消失 相反參數後在進關閉光球程式 讓爆炸過的不要再爆炸(如要重啟途中關閉光球功能 參數有修過)
    // getJewelleryClose_tmp(freeGame) {
    //     if (freeGame == false) {
    //         this.P_JewelleryClose_tmp[0] = !this.P_JewelleryClose_tmp[0];
    //         return this.P_JewelleryClose_tmp;
    //     }
    //     else {
    //         for (let i = 1; i < 4; i++) {
    //             this.P_JewelleryClose_tmp[i] = !this.P_JewelleryClose_tmp[i];
    //         }
    //         return this.P_JewelleryClose_tmp;
    //     }
    // }
    //#endregion

    update() {
        this.Role.update();
        if (this.Role.Role_HeraclesAin.anims.currentFrame.index == 4 && this.Pinch[0] == true) {
            this.JewelleryAin_0.PlayEndJewelleryAni();
            this.Pinch[0] = false;
        }
        if (this.Role.Role_HeraclesAin.anims.currentFrame.index == 4 && this.Pinch[1] == true) {
            this.JewelleryAin_1.PlayEndJewelleryAni();
            this.Pinch[1] = false;
        }
        if (this.Role.Role_HeraclesAin.anims.currentFrame.index == 4 && this.Pinch[2] == true) {
            this.JewelleryAin_2.PlayEndJewelleryAni();
            this.Pinch[2] = false;
        }
        if (this.Role.Role_HeraclesAin.anims.currentFrame.index == 4 && this.Pinch[3] == true) {
            this.JewelleryAin_3.PlayEndJewelleryAni();
            this.Pinch[3] = false;
        }
        //#region 判定緩衝時間是否結束 true滾輪進入新方塊掉落
        if (this.Role.getBufferStatus() == true) {
            if (this.PacketFinish == true) {
                this.mainGame.RollBarControl.Start_continue = false;
                this.PacketFinish = false;
                this.Role.BufferFinish = false;
            }
            else {
                this.Role.BufferAni.restart();
                this.Role.BufferFinish = false;
            }
        }
        //#endregion        
    }
}
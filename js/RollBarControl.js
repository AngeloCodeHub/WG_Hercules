/*  滾輪總控制    */
export class RollBarControl {
    constructor(game) {
        this.game = game;

        this.Move_speed = 50;//下去速度
        //#region 方塊掉落震動(調整參數)
        this.distance_1 = 2;    //第一次彈起距離
        this.distance_2 = 2;  //第二次彈起距離
        this.speed_1 = 3;       //第一次彈起花費時間
        this.speed_2 = 2;       //第二次彈起花費時間
        //#endregion
        this.Start_old = false;//是否進入舊方塊掉落環節
        this.Start_continue = true;//是否進入緩衝方塊掉落環節
        this.Start_new = false;//是否進入新方塊掉落環節
        this.time = 0;//舊物件下時間
        this.Switch_drop = [];
        this.time_new = 0;
        this.Start_stop = false;
        this.setzero = false;//是否向上歸零物件
        this.StFinish = true;//是否完成掉落
        this.Shock_time = [];//掉落震動計時器
        this.Switch_shock = [];//是否開啟震動
        this.WDStart_dorp = false;//中獎爆炸後是否開始掉落中獎方塊上方方塊
        this.WDtime = 0;
        this.shock_tmp = [];
        this.WDStart_shockup = false;//中獎爆炸後是否開始中獎方塊掉落震動(向上)
        this.WDStart_shockdown = false;//中獎爆炸後是否開始中獎方塊掉落震動(向下)
        this.WDFinish = false;//是否完成中獎爆炸後方塊掉落
        //#region 中獎方塊掉落和震動(調整參數)
        this.WDdrop = 15;//掉落速度
        this.SKmove = 10;//震動大小
        this.SKtime = 8;//震動時間
        //#endregion
        //#region 各行交換用Array
        this.prize_fixed_1 = [];
        this.prize_tmp_1 = [];

        this.prize_fixed_2 = [];
        this.prize_tmp_2 = [];

        this.prize_fixed_3 = [];
        this.prize_tmp_3 = [];

        this.prize_fixed_4 = [];
        this.prize_tmp_4 = [];

        this.prize_fixed_5 = [];
        this.prize_tmp_5 = [];

        this.prize_Y = [];//儲存交換後 Y 座標
        //#endregion
    }
    preload() {
        let ego = this.game;
    };
    create(prize) {
        let ego = this.game;
        this.prize = prize;
        //#region 各行方塊物件位子(暫存位子)
        this.prize_fixed_1 = [this.prize[0], this.prize[5], this.prize[10]];
        this.prize_tmp_1 = [this.prize[0], this.prize[5], this.prize[10]];

        this.prize_fixed_2 = [this.prize[1], this.prize[6], this.prize[11], this.prize[15]];
        this.prize_tmp_2 = [this.prize[1], this.prize[6], this.prize[11], this.prize[15]];

        this.prize_fixed_3 = [this.prize[2], this.prize[7], this.prize[12], this.prize[16], this.prize[18]];
        this.prize_tmp_3 = [this.prize[2], this.prize[7], this.prize[12], this.prize[16], this.prize[18]];

        this.prize_fixed_4 = [this.prize[3], this.prize[8], this.prize[13], this.prize[17]];
        this.prize_tmp_4 = [this.prize[3], this.prize[8], this.prize[13], this.prize[17]];

        this.prize_fixed_5 = [this.prize[4], this.prize[9], this.prize[14]];
        this.prize_tmp_5 = [this.prize[4], this.prize[9], this.prize[14]];
        //#endregion
        for (let i = 0; i < 19; i++) {
            this.Switch_drop[i] = false;
        }
        for (let j = 0; j < 19; j++) {
            this.Shock_time[j] = 0;
        }
    }
    update() {
        this.StartGame();
        this.StartStop();
        this.WinDownObject();
    }
    OnStartGame() {//啟動遊戲(按鈕)
        this.Start_old = true;
        this.Start_continue = true;
        this.StFinish = false;
        this.time = 0;
        this.time_new = 0;
    }
    StartGame() {//啟動遊戲(update)
        if (this.Start_old == true) {
            if (this.time > 0) { this.MoveObject(this.prize[0]); }
            if (this.time > 3) { this.MoveObject(this.prize[1]); }
            if (this.time > 6) { this.MoveObject(this.prize[2]); }
            if (this.time > 9) { this.MoveObject(this.prize[3]); }
            if (this.time > 12) { this.MoveObject(this.prize[4]); }
            if (this.time > 15) { this.MoveObject(this.prize[5]); }
            if (this.time > 18) { this.MoveObject(this.prize[6]); }
            if (this.time > 21) { this.MoveObject(this.prize[7]); }
            if (this.time > 24) { this.MoveObject(this.prize[8]); }
            if (this.time > 27) { this.MoveObject(this.prize[9]); }
            if (this.time > 30) { this.MoveObject(this.prize[10]); }
            if (this.time > 33) { this.MoveObject(this.prize[11]); }
            if (this.time > 36) { this.MoveObject(this.prize[12]); }
            if (this.time > 39) { this.MoveObject(this.prize[13]); }
            if (this.time > 42) { this.MoveObject(this.prize[14]); }
            if (this.time > 45) { this.MoveObject(this.prize[15]); }
            if (this.time > 48) { this.MoveObject(this.prize[16]); }
            if (this.time > 51) { this.MoveObject(this.prize[17]); }
            if (this.time > 54) { this.MoveObject(this.prize[18]); }
            if (this.time == 70) {
                this.SetObject();//將方塊上移整理
                //#region 控制進入不停掉落緩衝環節還是掉落新方塊環節
                if (this.Start_continue == true) {
                    this.game.SetRandPirze();
                    this.time = 0;
                }
                else if (this.game.FailToBet) {
                    this.Start_old = false;
                    this.time = 0;
                    this.Start_new = true;
                    this.game.SetFailPirze();
                }
                else {
                    this.Start_old = false;
                    this.time = 0;
                    this.Start_new = true;
                    this.game.SetPirze(0, this.game.P_FreeGame);
                }
                //#endregion
            }
            else { this.time++; }
        }
        if (this.Start_new == true) {
            if (this.time_new == 0) {
                for (let i = 0; i < 19; i++) {
                    this.Switch_drop[i] = true;
                }
            }
            if (this.time_new > 0) { this.DropObject(this.prize[0], 0); }
            if (this.time_new > 4) { this.DropObject(this.prize[1], 1); }
            if (this.time_new > 8) { this.DropObject(this.prize[2], 2); }
            if (this.time_new > 12) { this.DropObject(this.prize[3], 3); }
            if (this.time_new > 16) { this.DropObject(this.prize[4], 4); }
            if (this.time_new > 20) { this.DropObject(this.prize[5], 5); }
            if (this.time_new > 24) { this.DropObject(this.prize[6], 6); }
            if (this.time_new > 28) { this.DropObject(this.prize[7], 7); }
            if (this.time_new > 32) { this.DropObject(this.prize[8], 8); }
            if (this.time_new > 36) { this.DropObject(this.prize[9], 9); }
            if (this.time_new > 40) { this.DropObject(this.prize[10], 10); }
            if (this.time_new > 44) { this.DropObject(this.prize[11], 11); }
            if (this.time_new > 48) { this.DropObject(this.prize[12], 12); }
            if (this.time_new > 52) { this.DropObject(this.prize[13], 13); }
            if (this.time_new > 56) { this.DropObject(this.prize[14], 14); }
            if (this.time_new > 60) { this.DropObject(this.prize[15], 15); }
            if (this.time_new > 64) { this.DropObject(this.prize[16], 16); }
            if (this.time_new > 68) { this.DropObject(this.prize[17], 17); }
            if (this.time_new > 72) { this.DropObject(this.prize[18], 18); }
            this.time_new++;
            if (this.time_new == 100) {
                this.Start_new = false;
                this.time_new = 0;
                this.StFinish = true;
                // console.log('結束');
                if (this.game.FailToBet) {
                    this.game.status = 0;
                    this.game.BtnAllDisable(false);//開啟全部按鈕禁用狀態
                    this.game.FailToBet = false;
                }
            }
        }
    }
    //#region 歸零物件(回至上方)
    SetObject() {
        // console.log('歸零物件');
        this.TopObject(this.prize[0], 0);
        this.TopObject(this.prize[1], 1);
        this.TopObject(this.prize[2], 2);
        this.TopObject(this.prize[3], 3);
        this.TopObject(this.prize[4], 4);
        this.TopObject(this.prize[5], 5);
        this.TopObject(this.prize[6], 6);
        this.TopObject(this.prize[7], 7);
        this.TopObject(this.prize[8], 8);
        this.TopObject(this.prize[9], 9);
        this.TopObject(this.prize[10], 10);
        this.TopObject(this.prize[11], 11);
        this.TopObject(this.prize[12], 12);
        this.TopObject(this.prize[13], 13);
        this.TopObject(this.prize[14], 14);
        this.TopObject(this.prize[15], 15);
        this.TopObject(this.prize[16], 16);
        this.TopObject(this.prize[17], 17);
        this.TopObject(this.prize[18], 18);
        this.setzero = true;
    }
    TopObject(object, no) {
        this.object_drop = object;
        this.object_no = no;
        if (this.object_no == 0 || this.object_no == 5 || this.object_no == 10) {
            this.object_drop.y = 565;
        }
        if (this.object_no == 1 || this.object_no == 6 || this.object_no == 11 || this.object_no == 15) {
            this.object_drop.y = 420;
        }
        if (this.object_no == 2 || this.object_no == 7 || this.object_no == 12 || this.object_no == 16 || this.object_no == 18) {
            this.object_drop.y = 275;
        }
        if (this.object_no == 3 || this.object_no == 8 || this.object_no == 13 || this.object_no == 17) {
            this.object_drop.y = 420;
        }
        if (this.object_no == 4 || this.object_no == 9 || this.object_no == 14) {
            this.object_drop.y = 565;
        }
    }
    //#endregion
    //#region 物件掉落(舊物件落下)
    MoveObject(object) {
        this.object_move = object;
        if (this.object_move.y < 1145) {
            this.object_move.y += this.Move_speed + this.time;
        }
    }
    //#endregion
    //#region 物件掉落(落下新物件)
    DropObject(object, no) {
        this.object_drop = object;
        this.object_no = no;
        if (this.Switch_drop[this.object_no] == true) {
            if (this.object_no == 0 || this.object_no == 1 || this.object_no == 2 || this.object_no == 3 || this.object_no == 4) {
                this.object_drop.y += 100;
                if (this.object_drop.y >= 1005) {
                    this.object_drop.y = 1005;
                    this.Switch_drop[this.object_no] = false;
                    this.Switch_shock[this.object_no] = true;
                    this.game.MusicAndSE.PlaySoundEffect('SE_block_clash');
                }
            }
            else if (this.object_no == 5 || this.object_no == 6 || this.object_no == 7 || this.object_no == 8 || this.object_no == 9) {
                this.object_drop.y += 80;
                if (this.object_drop.y >= 860) {
                    this.object_drop.y = 860;
                    this.Switch_drop[this.object_no] = false;
                    this.Switch_shock[this.object_no] = true;
                    this.game.MusicAndSE.PlaySoundEffect('SE_block_clash');
                }
            }
            else if (this.object_no == 10 || this.object_no == 11 || this.object_no == 12 || this.object_no == 13 || this.object_no == 14) {
                this.object_drop.y += 60;
                if (this.object_drop.y >= 720) {
                    this.object_drop.y = 720;
                    this.Switch_drop[this.object_no] = false;
                    this.Switch_shock[this.object_no] = true;
                    this.game.MusicAndSE.PlaySoundEffect('SE_block_clash');
                }
            }
            else if (this.object_no == 15 || this.object_no == 16 || this.object_no == 17) {
                this.object_drop.y += 40;
                if (this.object_drop.y >= 580) {
                    this.object_drop.y = 580;
                    this.Switch_drop[this.object_no] = false;
                    this.Switch_shock[this.object_no] = true;
                    this.game.MusicAndSE.PlaySoundEffect('SE_block_clash');
                }
            }
            else if (this.object_no == 18) {
                this.object_drop.y += 40;
                if (this.object_drop.y >= 440) {
                    this.object_drop.y = 440;
                    this.Switch_drop[this.object_no] = false;
                    this.Switch_shock[this.object_no] = true;
                    this.game.MusicAndSE.PlaySoundEffect('SE_block_clash');
                }
            }
        }
        if (this.Switch_shock[this.object_no] == true) {
            this.SetShock(this.object_drop, this.object_no);
        }
    }
    //#endregion
    //#region 掉落震動
    SetShock(object, no) {
        this.SHobject = object;
        this.SHobject_no = no;
        let tmp = this.speed_1 * 2;
        let tmp2 = this.speed_2 * 2;
        if (this.Shock_time[this.SHobject_no] < this.speed_1) {
            this.SHobject.y -= this.distance_1;
        }
        else if (this.Shock_time[this.SHobject_no] >= this.speed_1 && this.Shock_time[this.SHobject_no] < tmp) {
            this.SHobject.y += this.distance_1;
        }
        else if (this.Shock_time[this.SHobject_no] >= tmp && this.Shock_time[this.SHobject_no] < (tmp + this.speed_2)) {
            this.SHobject.y -= this.distance_2;
        }
        else if (this.Shock_time[this.SHobject_no] >= (tmp + this.speed_2) && this.Shock_time[this.SHobject_no] < (tmp + tmp2)) {
            this.SHobject.y += this.distance_2;
        }
        this.Shock_time[this.SHobject_no]++;
        if (this.Shock_time[this.SHobject_no] == 12) {
            this.Shock_time[this.SHobject_no] = 0;
            this.Switch_shock[this.SHobject_no] = false;
            // if (this.SHobject_no == 18) { console.log('最後一個掉落的時間點: ' + this.time_new); }
        }
    }
    //#endregion
    //#region 快停
    SetQuickStop() {
        // console.log('SetQuickStop');
        this.Start_stop = true;
    }
    StartStop() {
        if (this.Start_stop == true) {
            let tmp = this.time_new;
            for (let j = tmp; j < 19; j++) {
                this.Switch_drop[j] = true;
            }
            // console.log('按下快停當下時間點: ' + tmp);
            this.time = 60;
            this.time_new = 60;
            this.Start_stop = false;
        }
    }
    //#endregion
    //#region 中獎消除方塊(向下掉落)
    //#region 中獎方塊向上排列
    WinEliminateObject(object, no) {
        if (no == 0 || no == 5 || no == 10) {//第一行
            if (this.prize[0].y == 580 || this.prize[5].y == 580) {
                if (this.prize[5].y == 440) {
                    object.y = 275;
                }
                else { object.y = 440; }
            }
            else {
                object.y = 580;
            }
            let index = this.prize_tmp_1.indexOf(object);
            this.prize_tmp_1.splice(index, 1);
            this.prize_tmp_1.push(object);
        }
        else if (no == 1 || no == 6 || no == 11 || no == 15) {//第二行
            if (this.prize[1].y == 440 || this.prize[6].y == 440 || this.prize[11].y == 440) {
                if (this.prize[6].y == 275 || this.prize[11].y == 275) {
                    if (this.prize[11].y == 275) {
                        object.y = -15;
                    }
                    else { object.y = 130; }
                }
                else { object.y = 275; }
            }
            else {
                object.y = 440;
            }
            let index = this.prize_tmp_2.indexOf(object);
            this.prize_tmp_2.splice(index, 1);
            this.prize_tmp_2.push(object);
        }
        else if (no == 2 || no == 7 || no == 12 || no == 16 || no == 18) {//第三行
            if (this.prize[2].y == 275 || this.prize[7].y == 275 || this.prize[12].y == 275 || this.prize[16].y == 275) {
                if (this.prize[7].y == 130 || this.prize[12].y == 130 || this.prize[16].y == 130) {
                    if (this.prize[12].y == -15 || this.prize[16].y == -15) {
                        if (this.prize[16].y == -15) {
                            object.y = -160;
                        }
                        else { object.y = -15; }
                    }
                    else { object.y = 130; }
                }
                else { object.y = 130; }
            }
            else {
                object.y = 275;
            }
            let index = this.prize_tmp_3.indexOf(object);
            this.prize_tmp_3.splice(index, 1);
            this.prize_tmp_3.push(object);
        }
        else if (no == 3 || no == 8 || no == 13 || no == 17) {//第四行
            if (this.prize[3].y == 440 || this.prize[8].y == 440 || this.prize[13].y == 440) {
                if (this.prize[8].y == 275 || this.prize[13].y == 275) {
                    if (this.prize[13].y == 275) {
                        object.y = -15;
                    }
                    else { object.y = 130; }
                }
                else { object.y = 275; }
            }
            else {
                object.y = 440;
            }
            let index = this.prize_tmp_4.indexOf(object);
            this.prize_tmp_4.splice(index, 1);
            this.prize_tmp_4.push(object);
        }
        else if (no == 4 || no == 9 || no == 14) {//第五行
            if (this.prize[4].y == 580 || this.prize[9].y == 580) {
                if (this.prize[9].y == 440) {
                    object.y = 275;
                }
                else { object.y = 440; }
            }
            else {
                object.y = 580;
            }
            let index = this.prize_tmp_5.indexOf(object);
            this.prize_tmp_5.splice(index, 1);
            this.prize_tmp_5.push(object);
        }
    }
    //#endregion    
    //#region 重置prize Tmp內容
    ResetTmpObject() {
        this.prize_tmp_1 = [this.prize[0], this.prize[5], this.prize[10]];
        this.prize_tmp_2 = [this.prize[1], this.prize[6], this.prize[11], this.prize[15]];
        this.prize_tmp_3 = [this.prize[2], this.prize[7], this.prize[12], this.prize[16], this.prize[18]];
        this.prize_tmp_4 = [this.prize[3], this.prize[8], this.prize[13], this.prize[17]];
        this.prize_tmp_5 = [this.prize[4], this.prize[9], this.prize[14]];
    }
    //#endregion
    //#region 整理方塊順序
    WinOrderObject() {
        //#region 暫存變換方塊資料Array
        let ty_1 = [];
        let tp_1 = [];
        let ty_2 = [];
        let tp_2 = [];
        let ty_3 = [];
        let tp_3 = [];
        let ty_4 = [];
        let tp_4 = [];
        let ty_5 = [];
        let tp_5 = [];
        //#endregion

        //#region 資料轉換---第一行
        for (let i = 0; i < this.prize_tmp_1.length; i++) {
            ty_1[i] = this.prize_tmp_1[i].y;
            tp_1[i] = this.prize_tmp_1[i].texture.key;
        }
        for (let j = 0; j < this.prize_tmp_1.length; j++) {
            this.prize_fixed_1[j].y = ty_1[j];
            this.prize_fixed_1[j].setTexture(tp_1[j]);
        }
        //#endregion

        //#region 資料轉換---第二行
        for (let i = 0; i < this.prize_tmp_2.length; i++) {
            ty_2[i] = this.prize_tmp_2[i].y;
            tp_2[i] = this.prize_tmp_2[i].texture.key;
        }
        for (let j = 0; j < this.prize_tmp_2.length; j++) {
            this.prize_fixed_2[j].y = ty_2[j];
            this.prize_fixed_2[j].setTexture(tp_2[j]);
        }
        //#endregion

        //#region 資料轉換---第三行
        for (let i = 0; i < this.prize_tmp_3.length; i++) {
            ty_3[i] = this.prize_tmp_3[i].y;
            tp_3[i] = this.prize_tmp_3[i].texture.key;
        }
        for (let j = 0; j < this.prize_tmp_3.length; j++) {
            this.prize_fixed_3[j].y = ty_3[j];
            this.prize_fixed_3[j].setTexture(tp_3[j]);
        }
        //#endregion

        //#region 資料轉換---第四行
        for (let i = 0; i < this.prize_tmp_4.length; i++) {
            ty_4[i] = this.prize_tmp_4[i].y;
            tp_4[i] = this.prize_tmp_4[i].texture.key;
        }
        for (let j = 0; j < this.prize_tmp_4.length; j++) {
            this.prize_fixed_4[j].y = ty_4[j];
            this.prize_fixed_4[j].setTexture(tp_4[j]);
        }
        //#endregion

        //#region 資料轉換---第五行
        for (let i = 0; i < this.prize_tmp_5.length; i++) {
            ty_5[i] = this.prize_tmp_5[i].y;
            tp_5[i] = this.prize_tmp_5[i].texture.key;
        }
        for (let j = 0; j < this.prize_tmp_5.length; j++) {
            this.prize_fixed_5[j].y = ty_5[j];
            this.prize_fixed_5[j].setTexture(tp_5[j]);
        }
        //#endregion

        //#region 儲存各方塊 Y 座標(位置互換後座標)
        for (let k = 0; k < 19; k++) {
            // this.prize_Y[k] = this.prize[k].y;
            this.prize_Y[k] = Math.round(this.prize[k].y);
        }
        //#endregion
    }
    //#endregion
    //#region 中獎方塊往下掉落(包含中獎震動)
    WinStartDownObject() { this.WDStart_dorp = true; }
    WinDownObject() {
        if (this.WDStart_dorp == true) {
            for (let i = 0; i < 19; i++) {
                if (i < 5) { this.prize[i].y += (1005 - this.prize_Y[i]) / this.WDdrop; }
                if (i >= 5 && i < 10) { this.prize[i].y += (860 - this.prize_Y[i]) / this.WDdrop; }
                if (i >= 10 && i < 15) { this.prize[i].y += (720 - this.prize_Y[i]) / this.WDdrop; }
                if (i >= 15 && i < 18) { this.prize[i].y += (580 - this.prize_Y[i]) / this.WDdrop; }
                if (i == 18) { this.prize[i].y += (440 - this.prize_Y[i]) / this.WDdrop; }

                if (this.WDtime == 0) {//取有移動的方塊(只取第一次 不然會重複取進Array)
                    if (i < 5) { if (1005 - this.prize_Y[i] != 0) { this.shock_tmp.push(this.prize[i]); } }
                    if (i >= 5 && i < 10) { if (860 - this.prize_Y[i] != 0) { this.shock_tmp.push(this.prize[i]); } }
                    if (i >= 10 && i < 15) { if (720 - this.prize_Y[i] != 0) { this.shock_tmp.push(this.prize[i]); } }
                    if (i >= 15 && i < 18) { if (580 - this.prize_Y[i] != 0) { this.shock_tmp.push(this.prize[i]); } }
                    if (i == 18) { if (440 - this.prize_Y[i] != 0) { this.shock_tmp.push(this.prize[i]); } }
                }
            }

            if (this.WDtime == this.WDdrop - 1) {
                this.WDStart_dorp = false;
                this.WDStart_shockup = true;
                this.WDtime = 0;
                this.game.MusicAndSE.PlaySoundEffect('SE_block_clash');
            }
            else { this.WDtime++; }
        }
        //#region 中獎震動(向上)
        if (this.WDStart_shockup == true) {
            for (let i = 0; i < this.shock_tmp.length; i++) {
                this.shock_tmp[i].y -= (this.SKmove / this.SKtime);
            }

            if (this.WDtime == this.SKtime - 1) {
                this.WDStart_shockup = false;
                this.WDStart_shockdown = true;
                this.WDtime = 0;
            }
            else { this.WDtime++; }
        }
        //#endregion

        //#region 中獎震動(向下)
        if (this.WDStart_shockdown == true) {
            for (let i = 0; i < this.shock_tmp.length; i++) {
                this.shock_tmp[i].y += (this.SKmove / this.SKtime);
            }

            if (this.WDtime == this.SKtime - 1) {
                this.WDStart_shockdown = false;
                this.WDtime = 0;
                this.shock_tmp = [];
                this.WDFinish = true;
            }
            else { this.WDtime++; }
        }
        //#endregion
    }
    //#endregion
    //#endregion
    //#region 回傳中獎掉落狀態
    returnWDStart() {
        return this.WDFinish;
    }
    //#endregion
    //#region 回傳歸零狀態
    returnRollZero() {
        return this.setzero;
    }
    //#endregion
    //#region 回傳掉落狀態
    returnStart() {
        return this.StFinish;
    }
    //#endregion
    destroy() { this.main.destroy(); }
}
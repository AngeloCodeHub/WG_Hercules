import { CustomScene } from './CustomTools.js';


export class Role extends CustomScene {
    constructor(game) {
        super("Role");
        this.mainGame = game;
        this.role_name = [
            'Role_Heracles', 'Role_Zeus', 'Role_Hera',
            'Role_Athena', 'Role_Venus', 'Role_LernaeanHydra',
            'Role_lion', 'Role_ThreeHeadedDog', 'Role_Bison',
        ];
        this.Role_Heracles;
        this.Role_0;
        this.Role_1;
        this.Role_2;
        this.Role_3;

        this.RoleAni_0;
        this.RoleAni_1;
        this.RoleAni_2;
        this.RoleAni_3;

        this.Zeus_lightning = [];
    }


    preload() {
        let ego = this.mainGame;
        ego.load.setBaseURL('./');

        ego.onceload.spritesheet('Role_HeraclesContinuousGraph', 'assets/Role/Heracles_action.png', { frameWidth: 500, frameHeight: 500 });
        ego.onceload.image('Role_Heracles', 'assets/Role/Role_Heracles.png');
        ego.onceload.image('Role_Zeus', 'assets/Role/Role_Zeus.png');
        ego.onceload.image('Role_Hera', 'assets/Role/Role_Hera.png');
        ego.onceload.image('Role_Athena', 'assets/Role/Role_Athena.png');
        ego.onceload.image('Role_Venus', 'assets/Role/Role_Venus.png');
        ego.onceload.image('Role_LernaeanHydra', 'assets/Role/Role_LernaeanHydra.png');
        ego.onceload.image('Role_Bison', 'assets/Role/Role_Bison.png');
        ego.onceload.image('Role_ThreeHeadedDog', 'assets/Role/Role_Three headed dog.png');
        ego.onceload.image('Role_lion', 'assets/Role/Role_lion.png');

        ego.onceload.spritesheet('Zeus_lightningContinuousGraph', 'assets/Role/Zeus_lightning.png', { frameWidth: 520, frameHeight: 500 });
    }

    create() {
        let ego = this.mainGame;
        ego.anims.create({ key: 'Role_HeraclesAin', frames: ego.anims.generateFrameNumbers('Role_HeraclesContinuousGraph'), frameRate: 15, repeat: 0 });
        this.Role_HeraclesAin = ego.add.sprite(110, 440, 'Role_HeraclesContinuousGraph').setScale(0.95).setAlpha(1);
        this.Role_HeraclesAin.play('Role_HeraclesAin');
        this.Role_HeraclesAin.anims.stop();

        ego.anims.create({ key: 'Zeus_lightning', frames: ego.anims.generateFrameNumbers('Zeus_lightningContinuousGraph'), frameRate: 20, repeat: -1 });

        this.Role_3 = ego.add.image(650, 300, 'Role_Athena').setScale(0.6).setAlpha(0);
        this.Zeus_lightning[3] = ego.add.sprite(650, 300, 'Zeus_lightningContinuousGraph').setScale(0.6).setAlpha(0);
        this.Role_2 = ego.add.image(520, 400, 'Role_Hera').setScale(0.75).setAlpha(0);
        this.Zeus_lightning[2] = ego.add.sprite(520, 400, 'Zeus_lightningContinuousGraph').setScale(0.75).setAlpha(0);
        this.Role_1 = ego.add.image(630, 470, 'Role_Venus').setScale(0.75).setAlpha(0);
        this.Zeus_lightning[1] = ego.add.sprite(630, 470, 'Zeus_lightningContinuousGraph').setScale(0.75).setAlpha(0);
        this.Role_0 = ego.add.image(580, 400, 'Role_Venus').setScale(1).setAlpha(0);
        this.Zeus_lightning[0] = ego.add.sprite(580, 400, 'Zeus_lightningContinuousGraph').setScale(1).setAlpha(0);

        this.Role_HeraclesCon = {
            targets: this.Role_HeraclesAin,
            y: { from: 440, to: 430 },
            scale: { from: 0.95, to: 1 },
            yoyo: true,
            repeat: -1,
            duration: 3000,
            ease: 'Sine.easeInOut',
        };
        ego.tweens.add(this.Role_HeraclesCon);

        this.RoleFly_0 = {
            targets: [this.Role_0],
            scale: { from: 1, to: 1.05 },
            yoyo: true,
            repeat: -1,
            duration: 3000,
            ease: 'Sine.easeInOut',
        };
        this.RoleFly_1 = {
            targets: [this.Role_1,],
            scale: { from: 0.75, to: 0.8 },
            yoyo: true,
            repeat: -1,
            duration: 3000,
            ease: 'Sine.easeInOut',
        };
        this.RoleFly_2 = {
            targets: [this.Role_2,],
            scale: { from: 0.75, to: 0.8 },
            yoyo: true,
            repeat: -1,
            duration: 3000,
            ease: 'Sine.easeInOut',
        };
        this.RoleFly_3 = {
            targets: [this.Role_3,],
            scale: { from: 0.6, to: 0.65 },
            yoyo: true,
            repeat: -1,
            duration: 3000,
            ease: 'Sine.easeInOut',
        };

        //#region 緩衝方塊掉落時間
        let Buffer = { t: 0 };
        this.BufferFinish = false;//是否完成緩衝方塊掉落時間
        this.BufferTime = {
            targets: Buffer,
            t: { from: 0, to: 1 },
            duration: 1000,
            onComplete: function () {
                this.BufferFinish = true;
            }.bind(this)
        }
        //#endregion

        this.RoleAppearCon_0 = {
            targets: [this.Role_0],
            x: { from: 630, to: 580 },
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut',
            onStart: function () {
                this.Role_0.scale = 1;
            }.bind(this),
            onComplete: function () {
                this.RoleAni_0 = this.mainGame.tweens.add(this.RoleFly_0);
                if (this.RoleAppearCon_0.targets.length == 2) {
                    this.RoleAppearCon_0.targets.splice(1, 1);//清除'角色顯示動畫'目標 宙斯雷電特效物件
                }
                if (this.BufferAni != null) { this.BufferAni.remove(); }
                this.BufferAni = this.mainGame.tweens.add(this.BufferTime);
            }.bind(this)
        }
        this.RoleDisappearCon_0 = {
            targets: [this.Role_0],
            x: { from: 580, to: 630 },
            alpha: { from: 1, to: 0 },
            duration: 500,
            ease: 'Back.easeInOut',
            onComplete: function () {
                this.RoleAni_0.remove();
                if (this.RoleDisappearCon_0.targets.length == 2) {
                    this.RoleFly_0.targets.splice(1, 1);//清除'角色漂浮動畫'目標 宙斯雷電特效物件
                    this.RoleDisappearCon_0.targets.splice(1, 1);//清除'角色消失動畫'目標 宙斯雷電特效物件
                    this.Zeus_lightning[0].anims.stop();//停止宙斯雷電特效物件
                    this.Zeus_lightning[0].setAlpha(0);
                }
            }.bind(this)
        }
        this.RoleAppearCon_1 = {
            targets: [this.Role_1,],
            x: { from: 680, to: 630 },
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut',
            onStart: function () {
                this.Role_1.scale = 0.75;
            }.bind(this),
            onComplete: function () {
                this.RoleAni_1 = this.mainGame.tweens.add(this.RoleFly_1);
                if (this.RoleAppearCon_1.targets.length == 2) {
                    this.RoleAppearCon_1.targets.splice(1, 1);//清除'角色顯示動畫'目標 宙斯雷電特效物件
                }
                if (this.BufferAni != null) { this.BufferAni.remove(); }
                this.BufferAni = this.mainGame.tweens.add(this.BufferTime);
            }.bind(this)
        }
        this.RoleDisappearCon_1 = {
            targets: [this.Role_1,],
            x: { from: 630, to: 680 },
            alpha: { from: 1, to: 0 },
            duration: 500,
            ease: 'Back.easeInOut',
            onComplete: function () {
                this.RoleAni_1.remove();
                if (this.RoleDisappearCon_1.targets.length == 2) {
                    this.RoleFly_1.targets.splice(1, 1);//清除'角色漂浮動畫'目標 宙斯雷電特效物件
                    this.RoleDisappearCon_1.targets.splice(1, 1);//清除'角色消失動畫'目標 宙斯雷電特效物件
                    this.Zeus_lightning[1].anims.stop();//停止宙斯雷電特效物件
                    this.Zeus_lightning[1].setAlpha(0);
                }
            }.bind(this)
        }
        this.RoleAppearCon_2 = {
            targets: [this.Role_2,],
            x: { from: 570, to: 520 },
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut',
            onStart: function () {
                this.Role_2.scale = 0.75;
            }.bind(this),
            onComplete: function () {
                this.RoleAni_2 = this.mainGame.tweens.add(this.RoleFly_2);
                if (this.RoleAppearCon_2.targets.length == 2) {
                    this.RoleAppearCon_2.targets.splice(1, 1);//清除'角色顯示動畫'目標 宙斯雷電特效物件
                }
            }.bind(this)
        }
        this.RoleDisappearCon_2 = {
            targets: [this.Role_2,],
            x: { from: 520, to: 570 },
            alpha: { from: 1, to: 0 },
            duration: 500,
            ease: 'Back.easeInOut',
            onComplete: function () {
                this.RoleAni_2.remove();
                if (this.RoleDisappearCon_2.targets.length == 2) {
                    this.RoleFly_2.targets.splice(1, 1);//清除'角色漂浮動畫'目標 宙斯雷電特效物件
                    this.RoleDisappearCon_2.targets.splice(1, 1);//清除'角色消失動畫'目標 宙斯雷電特效物件
                    this.Zeus_lightning[2].anims.stop();//停止宙斯雷電特效物件
                    this.Zeus_lightning[2].setAlpha(0);
                }
            }.bind(this)
        }
        this.RoleAppearCon_3 = {
            targets: [this.Role_3,],
            x: { from: 700, to: 650 },
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut',
            onStart: function () {
                this.Role_3.scale = 0.6;
            }.bind(this),
            onComplete: function () {
                this.RoleAni_3 = this.mainGame.tweens.add(this.RoleFly_3);
                if (this.RoleAppearCon_3.targets.length == 2) {
                    this.RoleAppearCon_3.targets.splice(1, 1);//清除'角色顯示動畫'目標 宙斯雷電特效物件
                }
            }.bind(this)
        }
        this.RoleDisappearCon_3 = {
            targets: [this.Role_3,],
            x: { from: 650, to: 700 },
            alpha: { from: 1, to: 0 },
            duration: 500,
            ease: 'Back.easeInOut',
            onComplete: function () {
                this.RoleAni_3.remove();
                if (this.RoleDisappearCon_3.targets.length == 2) {
                    this.RoleFly_3.targets.splice(1, 1);//清除'角色漂浮動畫'目標 宙斯雷電特效物件
                    this.RoleDisappearCon_3.targets.splice(1, 1);//清除'角色消失動畫'目標 宙斯雷電特效物件
                    this.Zeus_lightning[3].anims.stop();//停止宙斯雷電特效物件
                    this.Zeus_lightning[3].setAlpha(0);
                }
            }.bind(this)
        }
        // ego.tweens.add(this.Role_1DisappearCon);
    }

    PlayZeusLightning(index) {
        this.Zeus_lightning[index].setAlpha(1);
        this.Zeus_lightning[index].play('Zeus_lightning');
    }

    PlayRoleHeraclesPinch() {
        this.Role_HeraclesAin.play('Role_HeraclesAin');
        this.Role_HeraclesAin.on('animationcomplete', function () { this.Role_HeraclesAin.setTexture('Role_HeraclesContinuousGraph'); }.bind(this));
        this.mainGame.MusicAndSE.PlaySoundEffect('SE_Heracles');
    }
    AppearRoleAni(no) {
        let tmp_no = [this.RoleAni_0, this.RoleAni_1, this.RoleAni_2, this.RoleAni_3];
        let tmp_Anino = [this.RoleAppearCon_0, this.RoleAppearCon_1, this.RoleAppearCon_2, this.RoleAppearCon_3];
        if (tmp_no[no] != null) { tmp_no[no].remove(); }
        tmp_no[no] = this.mainGame.tweens.add(tmp_Anino[no]);
    }
    DisappearRoleAni(no) {
        let Role_away = [this.Role_0, this.Role_1, this.Role_2, this.Role_3];
        let tmp_no = [this.RoleAni_0, this.RoleAni_1, this.RoleAni_2, this.RoleAni_3];
        let tmp_Anino = [this.RoleDisappearCon_0, this.RoleDisappearCon_1, this.RoleDisappearCon_2, this.RoleDisappearCon_3];
        if (Role_away[no].texture.key == 'Role_Zeus') {
            tmp_Anino[no].targets.push(this.Zeus_lightning[no]);
        }
        if (tmp_no[no] != null) { tmp_no[no].remove(); }
        tmp_no[no] = this.mainGame.tweens.add(tmp_Anino[no]);
    }
    ControlRole(prize, freeGame) {
        let Role_away = [this.Role_0, this.Role_1, this.Role_2, this.Role_3];
        let RoleAppearCon = [this.RoleAppearCon_0, this.RoleAppearCon_1, this.RoleAppearCon_2, this.RoleAppearCon_3];
        let RoleFly = [this.RoleFly_0, this.RoleFly_1, this.RoleFly_2, this.RoleFly_3];
        if (freeGame == false) {
            Role_away[0].setTexture(this.role_name[prize[0]]);
            if (this.Role_0.texture.key == 'Role_Zeus') {
                this.RoleAppearCon_0.targets.push(this.Zeus_lightning[0]);
                this.RoleFly_0.targets.push(this.Zeus_lightning[0]);
                this.PlayZeusLightning(0);
            }
            this.AppearRoleAni(0);
        }
        else {
            for (let i = 1; i < prize.length; i++) {
                if (prize[i] != -1) {
                    Role_away[i].setTexture(this.role_name[prize[i]]);
                    if (Role_away[i].texture.key == 'Role_Zeus') {
                        RoleAppearCon[i].targets.push(this.Zeus_lightning[i]);
                        RoleFly[i].targets.push(this.Zeus_lightning[i]);
                        this.PlayZeusLightning(i);
                    }
                    this.AppearRoleAni(i);
                }
                else if (prize[i] == -1) {
                    console.log('第' + i + '個腳色 等於 -1');
                }
            }
        }
    }
    //#region 回傳 緩衝方塊掉落時間是否完成 true完成 false還在等待緩衝結束
    getBufferStatus() {
        return this.BufferFinish;
    }
    //#endregion
    update() {
        // console.log(this.RoleAppearCon_0.targets.length);
        // console.log(this.RoleFly_0.targets.length);
        // console.log(this.RoleDisappearCon_0.targets.length);
        // console.log(this.Zeus_lightning.anims.isPlaying);
        // console.log(this.Role_HeraclesAin.anims.currentFrame.index);
    }
}
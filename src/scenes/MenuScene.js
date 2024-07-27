import Phaser from '../phaser.js'

class MenuScene extends Phaser.Scene {
    constructor(config){
        super('MenuScene');
        this.config = config
    };
   

    create() {  
        this.add.image(400, 300, 'sky');
        this.scene.start('PlayScene');
    }


}

export default MenuScene  //export to main.js
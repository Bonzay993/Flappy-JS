import Phaser from "../phaser.js";

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
    constructor(config) {
        super('PlayScene');
        this.config = config;
        
        this.bird = null;
        this.pipes = null;
        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [120, 300];
        this.pipeHorizontalDistanceRange = [250,350];
        this.flapVelocity = 250;
        
        this.score = 0;
        this.scoreText = "";

        
    }

    preload() {
        this.load.image('sky', '../assets/sky.png');
        this.load.image('bird', '../assets/bird.png');
        this.load.image('pipe' , '../../assets/pipe.png');
    }

    create() {
        this.createBG();     //creates the background
        this.createBird();   //creates the bird
        this.createPipes();  //creates the pipes
        this.createColliders(); //creates the colliders
        this.handleInputs(); //creates the inputs
        this.createScore();  //creates the score
    }

    update() {
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBG(){
        this.add.image(400, 300, 'sky');
    }

    createBird(){
        //added .physics so it takes the physics values as mentioned in config
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);   //bird
        this.bird.body.gravity.y = 500;  
        this.bird.setCollideWorldBounds(true) 
    }

    createPipes(){
        this.pipes = this.physics.add.group();  //create a pipe grp

        for (let i=0; i<PIPES_TO_RENDER; i++){
            
            const upperPipe = this.pipes    //pipes. adds to the pipes group
            .create(200, 0,'pipe')
            .setImmovable(true)
            .setOrigin(0,1); 
            
            const lowerPipe = this.pipes.create(0, 0,'pipe')
            .setImmovable(true)
            .setOrigin(0,0);     
            this.placePipe(upperPipe, lowerPipe);
        }

        this.pipes.setVelocityX(-200); 
    }

    createColliders(){
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);         //adding colliders
    }

    createScore(){
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.text(16, 16,`Score: ${0}`, {fontSize: '32px', fill: '#000'})            //creates a text
        this.add.text(16, 52,`Best score: ${bestScore || 0}`, {fontSize: '18px', fill: '#000'})            //creates a text
    }

    handleInputs(){
        this.input.on('pointerdown', this.flap, this)                  //gets the mouse input
        this.input.keyboard.on('keydown-SPACE',this.flap, this)      //gets the space input
    }

    checkGameStatus(){
        if (this.bird.y <= 0 || this.bird.getBounds().bottom >= this.config.height) {

            this.gameOver();
            
        }
    }

    placePipe(uPipe,lPipe){
    
        const rightMostX = this.getRightMostPipe();
        //randomize space between pipes VERTICALLY min-max
        let pipeVercticalDistance = Phaser.Math.Between(this.pipeVerticalDistanceRange[0], this.pipeVerticalDistanceRange[1],);  // pipeVercticalDistance randomize space between pipes
        //setting pipe random y vertical position
        let pipeVerticalPosition = Phaser.Math.Between(0 + 30, this.config.height -20 -pipeVercticalDistance); 
        //randomize space between pipes
        let pipeHorizontalDistance = Phaser.Math.Between(this.pipeHorizontalDistanceRange[0],this.pipeHorizontalDistanceRange[1]);
        

        uPipe.x = rightMostX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;

        lPipe.x = uPipe.x
        lPipe.y = uPipe.y + pipeVercticalDistance

    }
      
    recyclePipes(){
        const tempPipes=[];
    
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0){
                    tempPipes.push(pipe);
                    if (tempPipes.length === 2){
                    this.placePipe(tempPipes[0], tempPipes[1]);
                    this.increaseScore();
                }
            }
        })
    }


    gameOver(){           //when you loose it reset the bird position and sets the velocity to 0
        //this.bird.x = this.config.startPosition.x;
        //this.bird.y = this.config.startPosition.y;
        //this.bird.body.velocity.y = 0;
        this.physics.pause();
        this.bird.setTint(0xff0000);

        const bestScoreText= localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if(!bestScore || this.score > bestScore) {
            localStorage.setItem('bestScore', this.score);
        }
        
        this.time.addEvent({
            delay: 1000,     //restart scene after 1 sec
            callback: () => {
                this.scene.restart();    //restart the scene
            },
            loop:false
        })
    }
      
    flap(){
        this.bird.body.velocity.y = -this.flapVelocity;
    }

    increaseScore() {
        this.score +=1;
        this.scoreText.setText(`Score: ${this.score}`);
    }
      
    getRightMostPipe(){
        let rightMostX = 0;
        
        this.pipes.getChildren().forEach(function(pipe){
          rightMostX = Math.max(pipe.x, rightMostX);
        })
      
        return rightMostX;
    };
}

export default PlayScene;  //export to main.js
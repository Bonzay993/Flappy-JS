//Importing Phaser
import Phaser from "./phaser.js";
import PlayScene from "./scenes/PlayScene.js";
import MenuScene from "./scenes/MenuScene.js";
import PreloadScene from "./scenes/PreloadScene.js";

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {
  x: WIDTH / 10,
  y: HEIGHT /2
};

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}


//Game config
const config = {
  type: Phaser.AUTO,          //Specify renderer
  ...SHARED_CONFIG,
  mode:Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,  //centering the screen
  parent: '.game-container',
  physics: {                  
    default: 'arcade',
       
  },
  
  //What you see on the screen
  scene: [PreloadScene, new MenuScene(SHARED_CONFIG), new PlayScene(SHARED_CONFIG)]
};


//Loading Assetts
function preload () {
  
}

//Creating Assetts
function create () {
  
}

function update(time, delta){
 
}


//Create new game
new Phaser.Game(config);
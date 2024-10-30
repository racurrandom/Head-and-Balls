class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }



   /*$$$$$           /$$   /$$    
  |_  $$_/          |__/  | $$    
    | $$   /$$$$$$$  /$$ /$$$$$$  
    | $$  | $$__  $$| $$|_  $$_/  
    | $$  | $$  \ $$| $$  | $$    
    | $$  | $$  | $$| $$  | $$ /$$
   /$$$$$$| $$  | $$| $$  |  $$$$/
  |______/|__/  |__/|__/   \__*/

  init() {
    this.moveSpeed = 400;
    this.gameStarted = false;
    this.score = 0;
  }



   /*$$$$$$                     /$$                           /$$
  | $$__  $$                   | $$                          | $$
  | $$  \ $$ /$$$$$$   /$$$$$$ | $$  /$$$$$$   /$$$$$$   /$$$$$$$
  | $$$$$$$//$$__  $$ /$$__  $$| $$ /$$__  $$ |____  $$ /$$__  $$
  | $$____/| $$  \__/| $$$$$$$$| $$| $$  \ $$  /$$$$$$$| $$  | $$
  | $$     | $$      | $$_____/| $$| $$  | $$ /$$__  $$| $$  | $$
  | $$     | $$      |  $$$$$$$| $$|  $$$$$$/|  $$$$$$$|  $$$$$$$
  |__/     |__/       \_______/|__/ \______/  \_______/ \______*/

  preload() {
    //Load images
    Turbo.loadImages(this, [
      ['player', 'Assets/Game/mon.gif'],
    ])
  }



    /*$$$$$                                  /$$              
   /$$__  $$                                | $$              
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ |__/       \_______/ \_______/   \___/   \______*/

  create() {
    //Set debug mode for the physics engine (shows the bounding boxes)
    this.physics.world.createDebugGraphic();

    //Create player 1
    this.player1 = this.createPlayer();

    //Go to menu on click
    this.input.once('pointerdown', () => {
      this.scene.stop("Main");
      this.scene.start("End");
    });
  }

  createPlayer() {
    //Create player
    const player = this.add.image(400, 550, 'player');

    //Enable player physics
    this.physics.add.existing(player);
    player.body.setImmovable(true);
    player.body.setCollideWorldBounds(true);
    player.body.setAllowGravity(false);

    //Left arrow
    Turbo.input(this, 'LEFT', () => {
      //Button down
      player.body.setVelocityX(-this.moveSpeed);
    }, () => {
      //Button up
      player.body.setVelocityX(0);
    })

    //Right arrow
    Turbo.input(this, 'RIGHT', () => {
      //Button down
      player.body.setVelocityX(this.moveSpeed);
    }, () => {
      //Button up
      player.body.setVelocityX(0);
    })
  }
  


   /*$   /$$                 /$$             /$$
  | $$  | $$                | $$            | $$
  | $$  | $$  /$$$$$$   /$$$$$$$  /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$  | $$ /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$  | $$| $$  \ $$| $$  | $$  /$$$$$$$  | $$    | $$$$$$$$
  | $$  | $$| $$  | $$| $$  | $$ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$$$$$$/|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ | $$____/  \_______/ \_______/   \___/   \_______/
            | $$
            | $$
            |_*/
  
  update(time, delta) {

  }
}
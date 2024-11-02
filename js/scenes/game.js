class SceneGame extends Phaser.Scene {
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

  init(data) {
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
    
  }



    /*$$$$$                                  /$$
   /$$__  $$                                | $$
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ |__/       \_______/ \_______/   \___/   \______*/

  create(data) {
    //Set debug mode for the physics engine (shows the bounding boxes)
    this.physics.world.createDebugGraphic();

    //Create player 1
    this.player1 = this.createPlayer(data.p1);

    //Create player 2
    this.player2 = this.createPlayer(data.p2);

    //Go to menu on click
    Scene.onClick(this, () => {
      Scene.changeScene(this, 'Main')
    })
  }

  createPlayer(key) {
    //Displacement
    const disp = 640 * (key.number - 1)

    //Create player
    const player = this.add.image(disp + 360, 550, key.skin);

    //Enable player physics
    this.physics.add.existing(player);
    player.body.setImmovable(true);
    player.body.setCollideWorldBounds(true);
    player.body.setAllowGravity(false);

    //Left arrow
    Scene.input(this, 'LEFT', () => {
      //Button down
      player.body.setVelocityX(-this.moveSpeed);
    }, () => {
      //Button up
      player.body.setVelocityX(0);
    })

    //Right arrow
    Scene.input(this, 'RIGHT', () => {
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
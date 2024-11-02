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
    this.physics.world.createDebugGraphic()

    //Create player 1
    this.player1 = new Player(this, data.p1)

    //Create player 2
    this.player2 = new Player(this, data.p2)

    //Go to menu on click
    Scene.onClick(this, () => {
      //this.player1.reset()
      //this.player2.reset()
      Scene.changeScene(this, 'Main')
    })
  }

  createPlayer(key) {
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
    this.player1.update()
    this.player2.update()
  }
}

class Player {
  //Player data
  data = {}
  inputX = 0
  moveSpeed = 200
  jumpSpeed = 500
  
  constructor(scene, data) {
    //Save data
    this.data = data

    //Create player
    this.player = scene.add.image(0, 0, data.skin)

    //Enable player physics
    scene.physics.add.existing(this.player)
    this.player.body.setImmovable(true)
    this.player.body.setCollideWorldBounds(true)
    this.player.body.setAllowGravity(true)

    //Reset
    this.reset();

    //Left arrow
    Scene.input(scene, data.number == 1 ? 'A' : 'LEFT', () => {
      //Button down
      this.inputX = Math.max(this.inputX - 1, -1)
    }, () => {
      //Button up
      this.inputX = Math.min(this.inputX + 1, 1)
    })

    //Right arrow
    Scene.input(scene, data.number == 1 ? 'D' : 'RIGHT', () => {
      //Button down
      this.inputX = Math.min(this.inputX + 1, 1)
    }, () => {
      //Button up
      this.inputX = Math.max(this.inputX - 1, -1)
    })

    //Up arrow
    Scene.input(scene, data.number == 1 ? 'W' : 'UP', () => {
      //Button down
      if (this.player.body.blocked.down) this.player.body.setVelocityY(-this.jumpSpeed)
    }, () => {
      
    })
  }

  reset() {
    //Reset position
    this.player.setPosition(640 * (this.data.number - 1) + 360, 550)
    this.player.body.setVelocityY(0)
  }

  update() {
    //Update current velocity depending on input
    this.player.body.setVelocityX(this.inputX * this.moveSpeed)
  }
}
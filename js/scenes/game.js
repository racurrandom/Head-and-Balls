class SceneGame extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
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
    Scene.loadImages(this, [
      ['floor', 'assets/game/floor.png'],
      ['ball', 'assets/game/ball.png'],
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

  create(data) {
    //Add floor
    this.floor = this.matter.add.image(640, 680, 'floor', { isStatic: true })
    this.floor.body.label = 'floor'
    
    //Add ball
    this.ball = this.matter.add.image(640, 200, 'ball')
    this.ball.body.label = 'ball'
    this.ball.setCircle(25)
    this.ball.setBounce(0.6)
    this.ball.setFriction(0.05)
    this.ball.setFrictionAir(0)
    this.ball.setFrictionStatic(0)
    this.ball.setMass(1)

    //Create player 1
    this.player1 = new Player(this, data.p1)

    //Create player 2
    this.player2 = new Player(this, data.p2)

    //Add check collision
    this.matter.world.on("collisionactive", (e, o1, o2) => { this.checkGrounded(e) })

    //Go to menu on click
    Scene.onClick(this, () => {
      this.player1.reset()
      this.player2.reset()
      this.ball.setPosition(640, 200)
      //Scene.changeScene(this, 'Main')
    })
  }

  checkGrounded(e) {
    //Reset grounded
    this.player1.grounded = false
    this.player2.grounded = false

    //Check if players are touching floor
    e.source.pairs.collisionActive.forEach(element => {
      const A = element.bodyA
      const B = element.bodyB
      if (A.label != 'floor') return
      switch (B.label) {
        case 'player1':
          this.player1.grounded = true
          break
        case 'player2':
          this.player2.grounded = true
          break
      }
    })

    //Log
    //console.log(this.player1.grounded ? 'p1 grounded' : 'p1 air')
    //console.log(this.player2.grounded ? 'p2 grounded' : 'p2 air')
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
  grounded = true
  inputX = 0
  moveSpeed = 6
  jumpSpeed = 12
  
  constructor(scene, data) {
    //Save data
    this.data = data

    //Create player
    this.player = scene.matter.add.image(640, 360, data.skin)
    this.player.body.label = 'player' + data.number
    this.player.setFixedRotation()
    this.player.setMass(1)
    this.player.setFriction(0)
    this.player.setFrictionAir(0)
    this.player.setFrictionStatic(0)

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
      //if (this.player.body.velocity.y == 0)
      if (this.grounded) this.player.setVelocityY(-this.jumpSpeed)
    }, () => {
      
    })
  }

  reset() {
    //Reset position
    this.player.setPosition(640 + (this.data.number == 1 ? -360 : 360), 550 + this.data.number)
    this.player.setVelocityY(0)
  }

  update() {
    //Update current velocity depending on input
    this.player.setVelocityX(this.inputX * this.moveSpeed)
  }
}
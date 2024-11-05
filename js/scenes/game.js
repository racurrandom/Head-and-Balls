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
    this.ball.setCircle(25)
    this.ball.body.label = 'ball'
    this.ball.setBounce(0.6)
    this.ball.setFriction(0.05)
    this.ball.setFrictionAir(0)
    this.ball.setFrictionStatic(0)
    this.ball.setMass(1)
    this.ball.setCollisionGroup(3)

    //Create player 1
    this.player1 = new Player(this, data.p1)

    //Create player 2
    this.player2 = new Player(this, data.p2)

    //Go to menu on click
    Scene.onClick(this, () => {
      //Testing
      this.player1.reset()
      this.player2.reset()
      this.ball.setPosition(640, 200)
      this.ball.setVelocityY(0)
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
    this.player1.update(time, delta)
    this.player2.update(time, delta)
  }
}



class Player {
  //Player data
  scene
  data = {}

  //Movement
  grounded = true
  inputX = 0
  moveSpeed = 6
  jumpSpeed = 12

  //Kick
  kicking = false
  kickPercent = 0
  kickOffset = 0
  kickSpeed = 10
  
  constructor(scene, data) {
    //Save data
    this.scene = scene
    this.data = data

    //Create player
    this.player = scene.matter.add.image(640, 360, data.skin)
    this.player.body.label = 'player' + data.number
    this.player.setFixedRotation()
    this.player.setMass(1)
    this.player.setFriction(0)
    this.player.setFrictionAir(0)
    this.player.setFrictionStatic(0)
    this.player.setScale(this.data.scale, 1)

    //Create foot
    this.foot = scene.matter.add.image(640, 360, 'foot')
    this.foot.body.label = 'foot' + data.number
    this.foot.setCollisionGroup(data.number)
    this.foot.setSensor(true)
    this.foot.setIgnoreGravity(true)
    this.foot.setScale(this.data.scale, 1)
    this.foot.setOnCollideActive(pair => {
      if (!this.kicking) return
      const A = pair.bodyA
      const B = pair.bodyB
      if (A.label != 'ball' && B.label != 'ball') return
      this.scene.ball.setVelocityX(pair.collision.normal.x * this.kickSpeed)
      this.scene.ball.setVelocityY(pair.collision.normal.y * this.kickSpeed)
    })

    //Reset
    this.reset();

    //Move left
    Scene.input(scene, data.number == 1 ? 'A' : 'LEFT', () => {
      //Button down
      this.inputX = Math.max(this.inputX - 1, -1)
    }, () => {
      //Button up
      this.inputX = Math.min(this.inputX + 1, 1)
    })

    //Move right
    Scene.input(scene, data.number == 1 ? 'D' : 'RIGHT', () => {
      //Button down
      this.inputX = Math.min(this.inputX + 1, 1)
    }, () => {
      //Button up
      this.inputX = Math.max(this.inputX - 1, -1)
    })

    //Jump
    Scene.input(scene, data.number == 1 ? 'W' : 'UP', () => {
      //Button down
      if (this.grounded) this.player.setVelocityY(-this.jumpSpeed)
    })

    //Kick
    Scene.input(scene, data.number == 1 ? 'S' : 'DOWN', () => {
      //Button down
      if (!this.kicking) {
        this.kicking = true
        this.kickPercent = 0
      }
    })
  }

  reset() {
    //Reset position
    this.player.setPosition(640 + (this.data.number == 1 ? -360 : 360), 550 + this.data.number)
    this.player.setVelocityY(0)
  }

  update(time, delta) {
    //Update current velocity depending on input
    this.player.setVelocityX(this.inputX * this.moveSpeed)

    //Prepare raycast
    const bodies = [
      (this.data.number == 2 ? this.scene.player1 : this.scene.player2).player.body,
      this.scene.floor.body,
      this.scene.ball.body
    ]
    const from = Phaser.Physics.Matter.Matter.Vector.create(this.player.x, this.player.y)
    const to = Phaser.Physics.Matter.Matter.Vector.create(this.player.x, this.player.y + this.player.height / 2)

    //Raycast to check if grounded
    const ray = Phaser.Physics.Matter.Matter.Query.ray(bodies, from, to, 1)
    this.grounded = ray.length > 0
    
    //Kick ball
    if (this.kicking) {
      //Update percent of animation
      this.kickPercent = Math.min(this.kickPercent + delta * 2 / 1000, 1)

      this.foot.angle = Ease.cliff(this.kickPercent) * 45 * -this.data.scale
      this.kickOffset = Ease.cliff(this.kickPercent) * 25

      if (this.kickPercent >= 1) this.kicking = false
    }

    //Update foot position
    this.foot.setPosition(
      from.x + (this.player.width / 2 - this.foot.width / 2 - 1 + this.kickOffset) * this.data.scale,
      from.y + this.player.height / 2 - this.foot.height / 2
    )
  }
}
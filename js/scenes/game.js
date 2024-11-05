//Layer index:
//9 - floor & goal
//8 - ball
//5 - feet
//4 - players

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
      ['goal', 'assets/game/goal.png'],
      ['foot', 'assets/game/foot.png'],
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
    //Save game state
    this.state = {
      //Playing ()
      isPlaying: true,
      //Player 1 points
      points1: 0,
      //Player 2 points
      points2: 0,
      //Timestamp when the game started
      timeStart: new Date().getTime(),
      //Timestamp when the game will end (after 3 minutes)
      timeEnd: new Date().getTime() + 3 * 60 * 1000,
    }

    //Add floor
    this.floor = this.matter.add.image(640, 680, 'floor', { isStatic: true })
    this.floor.body.label = 'floor'
    this.floor.depth = 9
    
    //Add ball
    this.ball = this.matter.add.image(640, 200, 'ball')
    this.ball.setCircle(25)
    this.ball.body.label = 'ball'
    this.ball.setBounce(0.6)
    this.ball.setFriction(0.05)
    this.ball.setFrictionAir(0)
    this.ball.setFrictionStatic(0)
    this.ball.setMass(1)
    this.ball.depth = 8

    //Create player 1
    this.player1 = new Player(this, data.p1)

    //Create player 2
    this.player2 = new Player(this, data.p2)
  }

  reset() {
    //Start playing
    this.state.isPlaying = true

    //Reset players
    this.player1.reset()
    this.player2.reset()

    //Reset ball
    this.ball.setPosition(640, 360)
    this.ball.setVelocity(0, 0)
  }

  onGoal(number) {
    //Not playing
    if (!this.state.isPlaying) return

    //Stop playing
    this.state.isPlaying = false

    //Add points
    switch (number) {
      case 1:
        //Scored in player 1's goal
        this.state.points2++
        break
      case 2:
        //Scored in player 2's goal
        this.state.points1++
        break
    }
    console.log(this.state.points1 + ' - ' + this.state.points2)
    
    //Wait and reset
    setTimeout(() => {
      this.reset()
    }, 1000)
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
    //Update players
    this.player1.update(delta)
    this.player2.update(delta)

    //Not playing
    if (!this.state.isPlaying) return

    //Game finished
    if (new Date().getTime() >= this.state.timeEnd) {
      //Stop playing
      this.state.isPlaying = false
      console.log('game finished')
      setTimeout(() => {
        Scene.changeScene(this, 'Main')
      }, 3000)
    }
  }
}



class Player {
  //Player data
  scene
  data = {}

  //Movement
  isGrounded = true
  inputX = 0
  moveSpeed = 6
  jumpSpeed = 12

  //Kick
  isKicking = false
  kickProgress = 0
  kickSpeed = 20
  footOffset = new Vec2()
  
  constructor(scene, data) {
    //Save data
    this.scene = scene
    this.data = data

    //Create goal
    this._initGoal()

    //Create player
    this._initPlayer()

    //Add input
    this._initInput()
  }

  //Init
  _initGoal() {
    //Create goal
    this.goalTrigger = this.scene.matter.add.image(this.data.index * this.scene.sys.game.canvas.width + (this.data.scale * 25), 540, 'goal', { isStatic: true })
    this.goalTrigger.body.label = 'goal' + this.data.number
    this.goalTrigger.setIgnoreGravity(true)
    this.goalTrigger.setSensor(true)
    this.goalTrigger.depth = 9

    //Add goal interaction
    this.goalTrigger.setOnCollide(pair => {
      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Headbutt the ball
      this.scene.onGoal(this.data.number)
    })

    //Create goal top (to prevent ball from entering from the top)
    this.goalTop = this.scene.matter.add.rectangle(this.goalTrigger.x + (10 * this.data.scale), this.goalTrigger.y - this.goalTrigger.height / 2 - 10, this.goalTrigger.width + 20, 20, { isStatic: true })
    this.goalTop.label = 'goal' + this.data.number
  }

  _initPlayer() {
    //Create player
    this.player = this.scene.matter.add.image(640, 360, this.data.skin)
    this.player.body.label = 'player' + this.data.number
    this.player.setFixedRotation()
    this.player.setMass(1)
    this.player.setFriction(0)
    this.player.setFrictionAir(0)
    this.player.setFrictionStatic(0)
    this.player.setScale(this.data.scale, 1)
    this.player.depth = 4

    //Add headbutt interaction
    this.player.setOnCollide(pair => {
      //Not jumping
      if (this.isGrounded) return

      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Headbutt the ball
      const posPlayer = new Vec2(this.player.x, this.player.y)
      const posBall = new Vec2(this.scene.ball.x, this.scene.ball.y)
      const direction = posBall.subtract(posPlayer).normalized().multiply(this.kickSpeed)
      this.scene.ball.setVelocity(direction.x, direction.y)
    })

    //Create foot
    this.foot = this.scene.matter.add.image(640, 360, 'foot')
    this.foot.body.label = 'foot' + this.data.number
    this.foot.setIgnoreGravity(true)
    this.foot.setSensor(true)
    this.foot.setScale(this.data.scale, 1)
    this.foot.depth = 5

    //Add kick ball interaction
    this.foot.setOnCollideActive(pair => {
      //Not kicking
      if (!this.isKicking) return

      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Kick the ball
      const direction = new Vec2(pair.collision.normal).multiply(this.kickSpeed)
      this.scene.ball.setVelocity(direction.x, direction.y)
    })

    //Reset player position & velocity
    this.reset()
  }

  _initInput() {
    //Move left
    Scene.input(this.scene, this.data.number == 1 ? 'A' : 'LEFT', () => {
      //Button down
      this.inputX = Math.max(this.inputX - 1, -1)
    }, () => {
      //Button up
      this.inputX = Math.min(this.inputX + 1, 1)
    })

    //Move right
    Scene.input(this.scene, this.data.number == 1 ? 'D' : 'RIGHT', () => {
      //Button down
      this.inputX = Math.min(this.inputX + 1, 1)
    }, () => {
      //Button up
      this.inputX = Math.max(this.inputX - 1, -1)
    })

    //Jump
    Scene.input(this.scene, this.data.number == 1 ? 'W' : 'UP', () => {
      //Button down
      if (this.isGrounded) this.player.setVelocityY(-this.jumpSpeed)
    })

    //Kick
    Scene.input(this.scene, this.data.number == 1 ? 'S' : 'DOWN', () => {
      //Button down
      if (!this.isKicking) {
        this.isKicking = true
        this.kickProgress = 0
      }
    })
  }

  //Reset
  reset() {
    //Reset position & velocity
    this.player.setPosition(640 + (this.data.number == 1 ? -360 : 360), 550 + this.data.number)
    this.player.setVelocity(0, 0)
  }

  //Update
  update(delta) {
    //Update current velocity based on input
    this.player.setVelocityX(this.inputX * this.moveSpeed)



    //Prepare raycast (to check if grounded)
    const bodies = [
      (this.data.number == 2 ? this.scene.player1 : this.scene.player2).player.body,
      this.scene.floor.body,
      this.scene.ball.body
    ]
    const from = Phaser.Physics.Matter.Matter.Vector.create(this.player.x, this.player.y)
    const to = Phaser.Physics.Matter.Matter.Vector.create(this.player.x, this.player.y + this.player.height / 2)

    //Raycast (to check if grounded)
    const ray = Phaser.Physics.Matter.Matter.Query.ray(bodies, from, to, 1)
    this.isGrounded = ray.length > 0
    


    //Kick animation
    if (this.isKicking) {
      //Update animation progress
      this.kickProgress = Math.min(this.kickProgress + delta * 2 / 1000, 1)
      const progress = Ease.cliff(this.kickProgress)

      //Animate kick
      this.foot.angle = progress * 30 * -this.data.scale
      this.footOffset = new Vec2(progress * 50 * this.data.scale, progress * -10)
      
      //Finished kick
      if (this.kickProgress >= 1) this.isKicking = false
    }



    //Update foot position
    const footOrigin = new Vec2(
      this.player.x + (this.player.width / 2 - this.foot.width / 2 - 2) * this.data.scale, 
      this.player.y + (this.player.height / 2 - this.foot.height / 2 - 2)
    )
    const footPosition = footOrigin.add(this.footOffset)
    this.foot.setPosition(footPosition.x, footPosition.y)
  }
}
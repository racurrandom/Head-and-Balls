//Layer index:
//9 - floor & goal
//8 - ball
//5 - feet
//4 - players

class SceneGame extends Phaser.Scene {

  static music

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
    //Load audios
    Scene.loadAudios(this,[
      ['gameMusic','assets/game/gameMusic.mp3'],
      ['voice1.0', 'assets/game/voices/1.0.mp3'],
      ['voice1.1', 'assets/game/voices/1.1.mp3'],
      ['voice2.0', 'assets/game/voices/2.0.mp3'],
      ['voice2.1', 'assets/game/voices/2.1.mp3'],
      ['voice3.0', 'assets/game/voices/3.0.mp3'],
      ['voice3.1', 'assets/game/voices/3.1.mp3'],
      ['voice4.0', 'assets/game/voices/4.0.mp3'],
      ['voice4.1', 'assets/game/voices/4.1.mp3'],
      ['piii', 'assets/game/sfx/piii.mp3'],
    ])

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
    this.data = {
      //State
      isPlaying: true,
      isFinished: false,
      //Player 1
      p1: data.p1,
      //Player 2
      p2: data.p2,
      //Timestamp when the game started
      timeStart: new Date().getTime(),
      //Timestamp when the game will end (after 3 minutes)
      //timeEnd: new Date().getTime() + 3 * 60 * 1000,
      timeEnd: new Date().getTime() + 6 * 1000,  //6 seconds for testing
    }

    //Add background music
    SceneGame.music = this.sound.add('gameMusic')
    SceneGame.music.loop = true
    SceneGame.music.play()

    //Play piii
    this.sound.add('piii').play()

    //Add floor
    this.floor = Scene.imageWithPhysics(this, 'floor', {
      //Position
      x: 640,
      y: 680,
      //Options
      label: 'floor',
      isStatic: true,
      depth: 9
    })
    
    //Add ball
    this.ball = Scene.imageWithPhysics(this, 'ball', {
      //Position
      x: 640,
      y: 200,
      //Options
      label: 'ball',
      circle: 25,
      bounce: 0.6,
      friction: 0.05,
      frictionAir: 0,
      frictionStatic: 0,
      depth: 8
    })

    //Create player 1
    this.player1 = new Player(this, data.p1)

    //Create player 2
    this.player2 = new Player(this, data.p2)

    //Time
    this.timer = this.add.text(640, 50, '00:00', {
      fontFamily: 'digital',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5, 0)
  }

  reset() {
    //Start playing
    this.data.isPlaying = true

    //Reset players
    this.player1.reset()
    this.player2.reset()

    //Reset ball
    this.ball.setPosition(640, 360)
    this.ball.setVelocity(0, 0)
    this.ball.setAngularVelocity(0)
  }

  onGoal(number) {
    //Not playing
    if (!this.data.isPlaying) return

    //Stop playing
    this.data.isPlaying = false
    
    //Play piii
    this.sound.add('piii').play()

    //Add points
    switch (number) {
      case 1:
        //Scored in player 1's goal
        this.player2.addPoint()
        break
      case 2:
        //Scored in player 2's goal
        this.player1.addPoint()
        break
    }
    
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

    //Still in game
    if (this.data.isFinished) return

    //Update timer
    this.updateTimer()

    //Game finished
    if (new Date().getTime() >= this.data.timeEnd) {
      //Stop playing
      this.data.isFinished = true
      this.data.isPlaying = false
    
      //Play piii
      this.sound.add('piii').play()

      //Wait to show results scene
      setTimeout(() => {
        Scene.changeScene(this, 'Results', {
          p1: {
            skin: this.data.p1.skin,
            points: this.player1.points
          },
          p2: {
            skin: this.data.p2.skin,
            points: this.player2.points
          }
        })
      }, 3000)
    }
  }

  updateTimer() {
    const current = new Date(new Date().getTime() - this.data.timeStart)
    let seconds = current.getSeconds()
    if (seconds < 10) seconds = '0' + seconds
    this.timer.setText('0' + current.getMinutes() + ':' + seconds)
  }
}



class Player {
  //Player data
  scene
  data = {}
  
  //Points
  points = 0

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

    //Update data
    this.data.index = data.number - 1
    this.data.scale = data.number == 1 ? 1 : -1

    //Create goal
    this._initGoal()

    //Create player
    this._initPlayer()

    //Add input
    this._initInput()

    //Create points text
    this.pointsText = scene.add.text(640 - data.scale * 150, 50, '0', {
      fontFamily: 'digital',
      fontSize: '64px',
      fill: '#fff',
    }).setOrigin(1 - data.index, 0)
  }

  //Init
  _initGoal() {
    //Create goal
    this.goalTrigger = Scene.imageWithPhysics(this.scene, 'goal', {
      //Position
      x: this.data.index * this.scene.sys.game.canvas.width + (this.data.scale * 75),
      y: 520,
      //Scale
      scaleX: this.data.scale,
      scaleY: 1,
      //Options
      label: 'goal' + this.data.number,
      isStatic: true,
      isSensor: true,
      ignoreGravity: true,
      depth: 9
    })

    //Add goal interaction
    this.goalTrigger.setOnCollide(pair => {
      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Headbutt the ball
      this.scene.onGoal(this.data.number)
    })

    //Add goal ceiling (to prevent ball from entering from the top)
    this.scene.matter.add.rectangle(
      this.goalTrigger.x + (10 * this.data.scale), 
      this.goalTrigger.y - this.goalTrigger.height / 2 - 10, 
      this.goalTrigger.width + 20, 
      20, 
      { 
        label: 'goalCeiling' + this.data.number,
        isStatic: true 
      }
    )

    this.scene.matter.add.trapezoid(
      0 + 1280 * this.data.index, 
      this.goalTrigger.y - this.goalTrigger.height / 2 - 35, 
      this.goalTrigger.width * 2 + 40, 
      40,
      1,
      { 
        label: 'goalCeiling' + this.data.number,
        isStatic: true 
      }
    )

    //Add goal back (to prevent ball from touching the wall)
    this.scene.matter.add.trapezoid(
      0 + 1280 * this.data.index, 
      this.goalTrigger.y - 40, 
      this.goalTrigger.width * 0.6, 
      -this.goalTrigger.height,
      1,
      { 
        label: 'goalWall' + this.data.number,
        isStatic: true 
      }
    )
  }

  _initPlayer() {
    //Create player
    this.player = Scene.imageWithPhysics(this.scene, 'skin' + this.data.skin, {
      //Position
      x: 0,
      y: 0,
      //Scale
      scaleX: this.data.scale,
      scaleY: 1,
      //Options
      label: 'player' + this.data.number,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      fixedRotation: true,
      depth: 4
    })

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
    this.foot = Scene.imageWithPhysics(this.scene, 'foot', {
      //Position
      x: 0,
      y: 0,
      //Scale
      scaleX: this.data.scale,
      scaleY: 1,
      //Options
      label: 'foot' + this.data.number,
      isSensor: true,
      ignoreGravity: true,
      depth: 5
    })

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

  //State
  reset() {
    //Reset position & velocity
    this.player.setPosition(640 + (this.data.number == 1 ? -360 : 360), 600 + this.data.number)
    this.player.setVelocity(0, 0)
  }

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

  //Other
  addPoint() {
    //Add point to score
    this.points++
    this.pointsText.setText(this.points)

    //Play voiceline
    this.scene.sound.add('voice' + this.data.number + '.' + Math.floor(Math.random() * 2)).play()  //Play a random voiceline (0 or 1)
  }
}
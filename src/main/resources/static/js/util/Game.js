//Todas las clases que usa game
//Las separe porque las usan la escena local y la online



//Ball
class Ball {

  //Last player hit
  last = 1

  //Events
  onKick = undefined
  

  constructor(scene) {
    //Save scene
    this.scene = scene

    //Create ball sprite
    this.ball = Scene.imageWithPhysics(this.scene, 'ball', {
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
      depth: -7
    })

    //Create sfx
    this.sfx = this.scene.sound.add('kick')

    //Reset ball
    this.reset()
  }

  //Getters & setters
  getPosition() {
    return [this.ball.x, this.ball.y]
  }

  setPosition(x, y) {
    this.ball.x = x
    this.ball.y = y
  }  
  
  getVelocity() {
    return [this.ball.body.velocity.x, this.ball.body.velocity.y]
  }

  setVelocity(x, y) {
    this.ball.setVelocity(x, y)
  }

  //Movement
  kick(direction, player) {
    this.setVelocity(direction.x, direction.y)
    this.last = player
    this.sfx.play()

    //Call kick event
    if (typeof this.onKick === 'function') this.onKick(player)
  }

  //State
  reset() {
    //Reset position & velocity
    this.setPosition(640, 360)
    this.setVelocity(0, 0)
    this.ball.setAngularVelocity(0)
  }
}



//Player
class Player {
  //Player data
  scene
  data = {}
  isPlaying = true
  
  //Points
  points = 0

  //Movement
  isGrounded = true
  isMovingRight = false
  isMovingLeft = false
  moveSpeed = 6
  jumpSpeed = 12

  //Kick
  isKicking = false
  kickProgress = 0
  kickSpeed = 20
  footOffset = new Vec2()

  //Other
  isStunned = false

  //Events
  onKick = undefined

  
  constructor(scene, data) {
    //Save data
    this.scene = scene
    this.data = data

    //Is playing (used for online games)
    if (typeof data.isMe === 'boolean') this.isPlaying = data.isMe

    //Update data
    this.data.index = data.number - 1
    this.data.scale = data.number == 1 ? 1 : -1

    //Create goal
    this._initGoal()

    //Create player
    this._initPlayer()

    //Add input
    this._initInput()

    //Create points & player name text
    this.pointsText = scene.add.text(640 - data.scale * 100, 82, '0', {
      fontFamily: 'digital',
      fontSize: '64px',
      fill: '#fff',
    }).setOrigin(0.5)

    this.playerText = scene.add.text(640 - data.scale * 100, 26, 'Jugador ' + this.data.number, {
      fontFamily: 'digital',
      fontSize: '18px',
      fill: '#fff',
    }).setOrigin(0.5)
  }

  //Getters & setters
  getPosition() {
    return [this.player.x, this.player.y]
  }

  setPosition(x, y) {
    this.player.setPosition(x, y)
  }  
  
  getVelocity() {
    return [this.player.body.velocity.x, this.player.body.velocity.y]
  }

  setVelocity(x, y) {
    this.player.setVelocity(x, y)
  }

  getSize() {
    return [this.player.width, this.player.height]
  }

  //Init
  _initGoal() {
    //Create goal
    this.goalTrigger = Scene.imageWithPhysics(this.scene, 'goal', {
      //Position
      x: this.data.index * this.scene.sys.game.canvas.width + (this.data.scale * 75),
      y: 540,
      //Scale
      scaleX: this.data.scale,
      scaleY: 1,
      //Options
      label: 'goal' + this.data.number,
      isStatic: true,
      isSensor: true,
      ignoreGravity: true,
      depth: -1
    })

    //Add goal interaction
    if (this.isPlaying) this.goalTrigger.setOnCollide(pair => {
      //Not playing
      if (!this.scene.data.isPlaying) return

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
      this.goalTrigger.y - this.goalTrigger.height / 2 - 33, 
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
      depth: -3
    })

    //Add headbutt interaction
    this.player.setOnCollide(pair => {
      //Not jumping
      if (this.isGrounded) return

      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Headbutt the ball
      const posPlayer = new Vec2(this.player.x, this.player.y)
      const posBall = new Vec2(this.scene.ball.ball)
      const direction = posBall.subtract(posPlayer).normalized().multiply(this.kickSpeed)
      this.scene.ball.kick(direction, this.data.number)
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
      depth: -4
    })

    //Add kick ball interaction
    this.foot.setOnCollideActive(pair => {
      //Not kicking
      if (!this.isKicking) return

      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Kick the ball
      const direction = new Vec2(pair.collision.normal).multiply(this.kickSpeed)
      this.scene.ball.kick(direction, this.data.number)
    })

    //Reset player position & velocity
    this.reset()
  }

  _initInput() {
    //Not playing -> Use no input
    if (!this.isPlaying) return

    //Move left
    Scene.input(this.scene, this.data.number == 1 ? 'A' : 'LEFT', () => {
      //Button down
      this.isMovingLeft = true
    }, () => {
      //Button up
      this.isMovingLeft = false
    })

    //Move right
    Scene.input(this.scene, this.data.number == 1 ? 'D' : 'RIGHT', () => {
      //Button down
      this.isMovingRight = true
    }, () => {
      //Button up
      this.isMovingRight = false
    })

    //Jump
    Scene.input(this.scene, this.data.number == 1 ? 'W' : 'UP', () => {
      //Button down
      if (!this.isStunned && this.isGrounded) this.player.setVelocityY(-this.jumpSpeed)
    })

    //Kick
    Scene.input(this.scene, this.data.number == 1 ? 'S' : 'DOWN', () => {
      //Button down
      if (!this.isStunned && !this.isKicking) {
        this.animateKick()

        //Call kick event
        if (typeof this.onKick === 'function') this.onKick()
      }
    })
  }

  //State
  stun(duration) {
    //Fix arg
    if (typeof duration !== 'number') duration = 3000

    //Stop & stun
    this.player.setVelocityX(0)
    this.isStunned = true

    //Create ice image
    const [x, y] = this.getPosition()
    const [width, height] = this.getSize()
    this.ice = this.scene.add.image(x, y - height / 2 - 50, 'ice')

    //Wait for stun to end
    setTimeout(() => {
      this.isStunned = false
      this.ice.destroy(true)
      this.ice = undefined
    }, duration)
  }

  reset() {
    //Reset position & velocity
    this.setPosition(640 + (this.data.number == 1 ? -360 : 360), 600 + this.data.number)
    this.setVelocity(0, 0)
  }

  update(delta) {
    //Is playing
    if (this.isPlaying) {
      //Update current velocity based on input
      let inputX = 0
      if (this.isMovingLeft) inputX--
      if (this.isMovingRight) inputX++
      this.player.setVelocityX(inputX * this.moveSpeed * (this.isStunned ? 0 : 1))
    }

    
    //Prepare raycast (to check if grounded)
    const bodies = [
      (this.data.number == 2 ? this.scene.player1 : this.scene.player2).player.body,
      this.scene.ball.ball.body,
      this.scene.floor,
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
      const progress = Util.cliff(this.kickProgress)

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

  animateKick() {
    this.isKicking = true
    this.kickProgress = 0
  }

  //Other
  addPoint() {
    //Add point to score
    this.points++
    this.pointsText.setText(this.points)

    //Play voiceline
    this.scene.sound.add('voice' + this.data.skin + '.' + Util.rand(0, 1)).play()  //Play a random voiceline (0 or 1)
  }
}



//Powerups
const PowerInfo = Object.freeze({
  MAX: 4,
  DELAY: 10000, 
  //Ball
  BallBouncy: 0,
  BallBig:    1,
  BallSmall:  2,
  //Players
  StunPlayer: 3,
  StunEnemy:  4,
})

const PowerSprite = Object.freeze([
  'powerBouncyBall',
  'powerBigBall',
  'powerSmallBall',
  'powerIceBad',
  'powerIce',
])

class Power {

  init(scene) {
    //Save scene
    this.scene = scene

    //Save type
    this.type = Util.rand(0, PowerInfo.MAX)

    //The power spawns another automatically
    this.selfSpawn = true

    //Create power image
    this.power = Scene.imageWithPhysics(this.scene, PowerSprite[this.type], {
      //Position
      x: 1280 * 0.2 + Util.rand(0, 1280 * 0.6),
      y: 250 + Util.rand(-50, 50),
      //Options
      ignoreGravity: true,
      isStatic: true,
      isSensor: true
    })

    //Add on trigger
    this.power.setOnCollideActive(pair => {
      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Take powerup
      this.power.destroy(true)

      //Use it
      this.use()
    })
  }

  onlineInit(scene, posX, posY, type, onPick, onEnd) {
    //Save scene
    this.scene = scene

    //Save type
    this.type = type

    //Save callbacks
    this.onPick = onPick
    this.onEnd = onEnd

    //The power does NOT spawn another automatically
    this.selfSpawn = false

    //Create power image
    this.power = Scene.imageWithPhysics(this.scene, PowerSprite[this.type], {
      //Position
      x: posX,
      y: posY,
      //Options
      ignoreGravity: true,
      isStatic: true,
      isSensor: true
    })

    //Add on trigger
    this.power.setOnCollideActive(pair => {
      //Not touching the ball
      if (pair.bodyA.label != 'ball' && pair.bodyB.label != 'ball') return

      //Take powerup
      this.power.destroy(true)

      //Execute onPick callback
      if (typeof this.onPick === 'function') this.onPick()
    })
  }

  use() {
    //Get ball & players
    const ball = this.scene.ball.ball
    const player = this.scene.ball.last == 1 ? this.scene.player1 : this.scene.player2
    const enemy = this.scene.ball.last == 1 ? this.scene.player2 : this.scene.player1

    //Get duration (default 8 seconds)
    let duration = 8000

    //Execute power
    switch (this.type) {
      case PowerInfo.BallBig:
        ball.setScale(2)
        break
      case PowerInfo.BallSmall:
        ball.setScale(0.5)
        break
      case PowerInfo.BallBouncy:
        ball.setBounce(1)
        break
      case PowerInfo.StunPlayer:
        duration = 3000
        player.stun(duration)
        break
      case PowerInfo.StunEnemy:
        duration = 3000
        enemy.stun(duration)
        break
    }

    //Wait until end
    setTimeout(() => {
      this.end()
    }, duration)
  }

  end() {
    //Get ball
    const ball = this.scene.ball.ball

    //End power
    switch (this.type) {
      case PowerInfo.BallBig:
      case PowerInfo.BallSmall:
        ball.setScale(1)
        break
      case PowerInfo.BallBouncy:
        ball.setBounce(0.6)
        break
    }
    
    if (this.selfSpawn) {     //Is the pwer allowed to spawn another?
      //Wait to spawn another
      this.scene.spawnPower()
    }

    //Execute onEnd callback
    if (typeof this.onEnd === 'function') this.onEnd()
  }
}
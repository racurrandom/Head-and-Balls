class SceneGameOnline extends Phaser.Scene {

  static music

  constructor() {
    super({ key: 'GameOnline' });
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
    //Add background
    const bg = this.add.image(1280 / 2, 720 / 2, 'bg_game')
    bg.depth = -10

    //Save game state
    this.data = {
      //State
      isPlaying: true,
      isFinished: false,
      //Players
      p1: data.p1,
      p2: data.p2,
      //Time (ms)
      duration: 60000,
    }

    //Add start & end timestamps to data
    this.data.timeStart = new Date().getTime()
    this.data.timeEnd = new Date().getTime() + this.data.duration


    //Add background music
    SceneGame.music = this.sound.add('music_game')
    SceneGame.music.loop = true
    SceneGame.music.play()


    //Add pause button
    const pause_button = this.add.image(1280-60, 55, 'setting_button')
    Element.onClick(pause_button, () => {
      //Stop power spawn timer
      clearTimeout(this.powerTimer)

      ///Open options
      this.scene.pause()
      this.scene.launch('Options', 'GameOnline')
    })


    //Add back button
    /*const back_button = this.add.image(60, 55, 'back_button')
    Element.onClick(back_button, () => {
      SceneGame.music.stop()
      Scene.changeScene(this, 'Main')
    })*/


    //Add floor
    this.floor = this.matter.add.rectangle(
      //Position
      640, 
      690, 
      1280, 
      60, 
      { 
        label: 'floor',
        isStatic: true 
      }
    )

    this.floorImage = Scene.imageWithPhysics(this, 'campo', {
      //Position
      x: 640,
      y: 660,
      //Options
      ignoreGravity: true,
      isSensor: true,
      isStatic: true,
      depth: -10,
    })
    

    //Add ball
    this.ball = new Ball(this)
    this.ball.onKick = (player) => {
      //Not the current player
      if (player != this.player.data.number) return

      //Notify server that player kicked the ball
      Online.sendSocketMessage(Online.TYPE.G_KICK)
    }


    //Powers
    //this.spawnPower()


    //Map
    this.mapVariant = this.add.rectangle(0, 0, 200, 40, 0x3e383d)
    this.matter.add.gameObject(this.mapVariant)
    this.mapVariant.setStatic(true)
    this.onlineOnMapVariant(data.variant)


    //Counter (time & points)
    this.counter = Scene.imageWithPhysics(this, 'marcador', {
      //Position
      x: 640,
      y: 75,
      //Options
      ignoreGravity: true,
      isSensor: true,
      isStatic: true,
      depth: -10,
    })
    
    this.timer = this.add.text(640, 93, '00:00', {
      fontFamily: 'digital',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //Create player 1
    this.player1 = new Player(this, data.p1)

    //Create player 2
    this.player2 = new Player(this, data.p2)

    //Save players as player & other (for easier online use)
    this.other = data.p1.isMe ? this.player2 : this.player1
    this.player = data.p1.isMe ? this.player1 : this.player2
    this.player.onKick = () => {
      //Notify server that player started kick animation
      Online.sendSocketMessage(Online.TYPE.G_ANIMATE)
    }


    //Reset game
    this.reset()


    //Register callback
    Online.setSocketOnMessage((type, data) => {
      switch (type) {
        case Online.TYPE.G_PLAYER:
          this.onlineOnUpdatePlayer(data)
          break
        case Online.TYPE.G_BALL:
          this.onlineOnUpdateBall(data)
          break
        case Online.TYPE.G_ANIMATE:
          this.onlineOnAnimateKick()
          break
        case Online.TYPE.G_GOAL:
          this.onlineOnUpdateGoal(data)
          break
        case Online.TYPE.G_RESET:
          this.reset()
          this.onlineOnMapVariant(data)
          break
        case Online.TYPE.G_POWERSPAWN:
          this.onlineSpawnPower(data);
          break;
        case Online.TYPE.G_POWERUSE:
          this.power.onTake(false);
          break;
      }
    })
  }

  reset() {
    //Start playing
    this.data.isPlaying = true

    //Reset ball
    this.ball.reset()

    //Reset players
    this.player1.reset()
    this.player2.reset()
  }

  onGoal(number) {
    //Tell the server a goal was scored in the players goal
    Online.sendSocketMessage(Online.TYPE.G_GOAL)
  }
  
  
  //Online updates
  onlineOnUpdatePlayer(data) {
    data = JSON.parse(data)
    this.other.setPosition(data.posX, data.posY)
    this.other.setVelocity(data.velX, data.velY)
  }
  
  onlineOnUpdateBall(data) {
    data = JSON.parse(data)
    this.ball.setPosition(data.posX, data.posY)
    this.ball.setVelocity(data.velX, data.velY)
  }
  
  onlineOnAnimateKick() {
    this.other.animateKick()
  }
  
  onlineOnUpdateGoal(data) {
    //Player goal number
    const number = parseInt(data)

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
  }

  onlineOnMapVariant(variant) {
    if (typeof variant === 'string') variant = JSON.parse(variant)
    this.mapVariant.x = variant.x
    this.mapVariant.y = variant.y
    this.mapVariant.setRotation(variant.angle)
  }

  onlineSpawnPower(data) {
    data = JSON.parse(data)
    this.power = new Power(this, data.posX, data.posY, data.type, this.onlinePickPower)
  }

  onlinePickPower(){
    Online.sendSocketMessage(Online.TYPE.G_POWERUSE)
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


    //Send player info to server
    Online.sendSocketMessage(Online.TYPE.G_PLAYER, {
      posX: this.player.player.x,
      posY: this.player.player.y,
      velX: this.player.player.body.velocity.x,
      velY: this.player.player.body.velocity.y,
    })

    //Send ball info to server
    Online.sendSocketMessage(Online.TYPE.G_BALL, {
      posX: this.ball.ball.x,
      posY: this.ball.ball.y,
      velX: this.ball.ball.body.velocity.x,
      velY: this.ball.ball.body.velocity.y,
    })


    //Stop if game finished
    if (this.data.isFinished) return


    //Update timer
    this.updateTimer()
   

    //Check if game finished
    if (new Date().getTime() >= this.data.timeEnd) {
      //Stop playing
      this.data.isFinished = true
      this.data.isPlaying = false
    
      //Play piii
      this.sound.add('piii').play()

      //Wait to show results scene
      setTimeout(() => {
        //Close socket
        Online.closeSocket()

        ///Go to results
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
    const current = new Date(Math.abs(this.data.duration - (new Date().getTime() - this.data.timeStart)))
    
    //Get time
    let minutes = current.getMinutes()
    let seconds = current.getSeconds()

    //Convert time to text
    if (minutes < 10) minutes = '0' + minutes
    if (seconds < 10) seconds = '0' + seconds
    this.timer.setText(minutes + ':' + seconds)
  }
}
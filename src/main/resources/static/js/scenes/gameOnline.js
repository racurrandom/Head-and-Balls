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
      //Timestamp when the game started
      timeStart: new Date().getTime(),
      //Timestamp when the game will end (after 3 minutes)
      timeEnd: new Date().getTime() + 1 * 60 * 1000,  //1 minute
    }


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
    this.updateMapVariant(data.variant)


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
          this.updateOtherPlayer(data)
          break;
        case Online.TYPE.G_BALL:
          this.updateBall(data)
          break;
        case Online.TYPE.G_ANIMATE:
          this.animateKick()
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

    /*//Move & rotate map variant
    this.mapVariant.x = 640 + Util.rand(-450, 450)
    this.mapVariant.y = 250 + Util.rand(-50, 50)
    this.mapVariant.setRotation(Util.rand(-30, 30) * Math.PI / 180)*/
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
    }, 2000)
  }

  /*spawnPower() {
    this.powerTimer = setTimeout(() => {
      this.power = new Power(this)
    }, PowerInfo.DELAY)
  }*/
  
  //Online updates
  updateMapVariant(variant) {
    this.mapVariant.x = variant.x
    this.mapVariant.y = variant.y
    this.mapVariant.setRotation(variant.angle)
  }

  updateOtherPlayer(data) {
    data = JSON.parse(data)
    this.other.setPosition(data.posX, data.posY)
    this.other.setVelocity(data.velX, data.velY)
  }
  
  updateBall(data) {
    data = JSON.parse(data)
    this.ball.setPosition(data.posX, data.posY)
    this.ball.setVelocity(data.velX, data.velY)
  }
  
  animateKick() {
    this.other.animateKick()
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
        //Stop power spawn timer
        //clearTimeout(this.powerTimer)

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
    const current = new Date(new Date().getTime() - this.data.timeStart)
    let seconds = current.getSeconds()
    if (seconds < 10) seconds = '0' + seconds
    this.timer.setText('0' + current.getMinutes() + ':' + seconds)
  }
}
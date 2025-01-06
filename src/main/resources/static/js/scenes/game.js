class SceneGame extends Phaser.Scene {

  static music

  constructor() {
    super({ key: 'Game' });
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

    //Play piii
    this.sound.add('piii').play()

    //Add pause button
    const pause_button = this.add.image(1280-60, 55, 'setting_button')
    Element.onClick(pause_button, ()=>{
      //Stop power spawn timer
      clearTimeout(this.powerTimer)

      ///Open options
      this.scene.pause()
      this.scene.launch('Options', 'Game')
    })


    //Add back button
    const back_button = this.add.image(60, 55, 'back_button')
    Element.onClick(back_button, () => {
      SceneGame.music.stop()
      Scene.changeScene(this, 'Main')
    })


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


    //Powers
    this.spawnPower()



    //Map
    this.mapVariant = this.add.rectangle(0, 0, 200, 40, 0x3e383d)
    this.matter.add.gameObject(this.mapVariant)
    this.mapVariant.setStatic(true)



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



    //Reset game
    this.reset()
  }

  reset() {
    //Start playing
    this.data.isPlaying = true

    //Reset ball
    this.ball.reset()

    //Reset players
    this.player1.reset()
    this.player2.reset()

    //Move & rotate map variant
    this.mapVariant.x = 640 + Util.rand(-450, 450)
    this.mapVariant.y = 250 + Util.rand(-50, 50)
    this.mapVariant.setRotation(Util.rand(-30, 30) * Math.PI / 180)
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

  spawnPower() {
    this.powerTimer = setTimeout(() => {
      this.power = new Power()
      this.power.init(this)
    }, PowerInfo.DELAY)
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
        //Stop power spawn timer
        clearTimeout(this.powerTimer)

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
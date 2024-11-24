class SceneMain extends Phaser.Scene {

  static music

  constructor() {
    super({ key: 'Main' });
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
    //Load audio
    Scene.loadAudios(this, [
      ['menuMusic', 'assets/main/menuMusic.mp3'],
    ])

    //Load images
    Scene.loadImages(this, [
      ['title', 'assets/main/title.gif'],
      ['button', 'assets/main/button.png'],
      ['buttonHover', 'assets/main/buttonHover.png'],
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
    //Update settings
    try {
      const t = parseFloat(localStorage.getItem('volume'))
      if (t != NaN) Settings.volume = t
      this.sound.setVolume(Settings.volume)
    } catch(e) {
      Settings.volume = 1
      this.sound.setVolume(Settings.volume)
    }

    //Add background music
    SceneMain.music = this.sound.add('menuMusic')
    SceneMain.music.loop = true
    SceneMain.music.play()

    //Add title
    const title = this.add.image(640, 150, 'title')
    title.scaleX = 1.5
    title.scaleY = 1.5

    //Play button
    const play = this.add.image(640, 400, 'button')
    const playText = this.add.text(640, 400 - 6, 'Jugar', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(play, () => {
      play.setTexture('buttonHover')
    }, () => {
      play.setTexture('button')
    })
    Element.onClick(play, () => {
      Scene.changeScene(this, 'Characters')
    })
    
    //Options button
    const options = this.add.image(640, 500, 'button')
    const optionsText = this.add.text(640, 500 - 6, 'Opciones', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(options, () => {
      options.setTexture('buttonHover')
    }, () => {
      options.setTexture('button')
    })
    Element.onClick(options, () => {
      this.scene.launch('Options')
    })

    //Credits button
    const credits = this.add.image(640, 600, 'button')
    const creditsText = this.add.text(640, 600 - 6, 'Créditos', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(credits, () => {
      credits.setTexture('buttonHover')
    }, () => {
      credits.setTexture('button')
    })
    Element.onClick(credits, () => {
      this.scene.launch('Credits')
    })
  }
}

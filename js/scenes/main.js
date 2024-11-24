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
      ['play', 'assets/main/jugar.gif'],
      ['options', 'assets/main/opciones.gif'],
      ['credits', 'assets/main/creditos.gif'],
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
    //Add background music
    SceneMain.music = this.sound.add('menuMusic')
    SceneMain.music.loop = true
    SceneMain.music.play()

    //Add title
    const title = this.add.image(640, 150, 'title')
    title.scaleX = 1.5
    title.scaleY = 1.5

    //Play button
    const play = this.add.image(640, 400, 'play')
    Element.onClick(play, () => {
      Scene.changeScene(this, 'Characters')
    })
    
    //Options button
    const options = this.add.image(640, 500, 'options')
    Element.onClick(options, () => {
      this.scene.launch('Options')
    })

    //Credits button
    const credits = this.add.image(640, 600, 'credits')
    Element.onClick(credits, () => {
      //this.scene.launch('Options')
    })
  }
}

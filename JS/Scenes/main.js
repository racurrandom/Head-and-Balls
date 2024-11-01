class SceneMain extends Phaser.Scene {
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
      ['background', 'assets/main/music.mp3'],
    ])

    //Load images
    Scene.loadImages(this, [
      ['title', 'assets/main/title.gif'],
      ['play', 'assets/main/jugar.gif'],
      ['options', 'assets/main/opciones.gif'],
      ['exit', 'assets/main/salir.gif'],
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
    const music = this.sound.add('background')
    music.loop = true;
    music.play();

    //Add title
    const title = this.add.image(640, 120, 'title')

    //Play button
    const play = this.add.image(640, 400, 'play')
    Element.onClick(play, () => {
      Scene.changeScene(this, 'Characters')
    })
    
    //Options button
    const options = this.add.image(640, 500, 'options')
    Element.onClick(options, () => {
      console.log('options')
    })

    //Exit button
    const exit = this.add.image(640, 600, 'exit')
    Element.onClick(exit, () => {
      this.scene.stop('Main')
    })

    //Add shutdown event (scene close)
    Scene.onClose(this, () => {
      music.stop()
    })
  }
}

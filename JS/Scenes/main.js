class Main extends Phaser.Scene {
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
    Turbo.loadAudios(this, [
      ['background', 'Assets/Main/music.mp3'],
    ])

    //Load images
    Turbo.loadImages(this, [
      ['title', 'Assets/Main/title.gif'],
      ['play', 'Assets/Main/jugar.gif'],
      ['options', 'Assets/Main/opciones.gif'],
      ['exit', 'Assets/Main/salir.gif'],
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
    const music = this.sound.add('background');
    music.loop = true;
    music.play();

    //Add title
    const title = this.add.image(640, 120, 'title');

    //Play button
    const play = this.add.image(640, 400, "play")
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.stop('Main');
      this.scene.start('Game');
    });
    
    //Options button
    const options = this.add.image(640, 500, 'options')
    .setInteractive()
    .on('pointerdown', () => {
      console.log('options')
    });

    //Exit button
    const exit = this.add.image(640, 600, 'exit')
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.stop('Main');
    });

    //Add shutdown event (scene close)
    Turbo.onShutdown(this, () => {
      music.stop();
    })
  }
}

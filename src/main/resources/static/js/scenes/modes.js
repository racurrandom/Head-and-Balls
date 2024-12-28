class SceneModes extends Phaser.Scene {
  constructor() {
    super({ key: 'Modes' });
  }



    /*$$$$$                                  /$$              
   /$$__  $$                                | $$              
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ |__/       \_______/ \_______/   \___/   \______*/

  create(mainScene) {
    //Add background
    const bg = this.add.image(1280 / 2, 720 / 2, 'window')
    Element.onClick(bg, () => {}) //Prevent clickthrough

    
    //Add title
    const title = this.add.text(640, 120, 'Modos', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //Add online button
    const online = new Button(this, 420, 360, 'Online', () => {
      this.scene.stop()
      if (!Online.isLogged) {
        this.scene.launch('Account', mainScene)
      } else {
        Scene.changeScene(this, 'Lobby', mainScene)
      }
    })

    //Add local button
    const local = new Button(this, 860, 360, 'Local', () => {
      this.scene.stop()
      Scene.changeScene(mainScene, 'Characters')
    })


    //Add back button
    const back = new Button(this, 640, 600, 'Volver', () => {
      this.scene.stop()
    })
  }
}
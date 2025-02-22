class SceneError extends Phaser.Scene {
  constructor() {
    super({ key: 'Error' });
  }



    /*$$$$$                                  /$$              
   /$$__  $$                                | $$              
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ |__/       \_______/ \_______/   \___/   \______*/

  create(errorMessage) {
    //Invalid error message
    if (typeof errorMessage !== 'string' && !Array.isArray(errorMessage)) errorMessage = ['Puede que el servidor esté desconectado.', 'Se ha cerrado sesión.']


    //Add background
    const bg = this.add.image(1280 / 2, 720 / 2, 'bg_menu')
    const bgw = this.add.image(1280 / 2, 720 / 2, 'window')


    //Add title
    const title = this.add.text(640, 120, 'Error', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //Add error text
    const error = this.add.text(640, 360, errorMessage, {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //Add back button
    const back = new Button(this, 640, 600, 'Volver', () => {
      Online.isLogged = false
      Scene.changeScene(this, 'Main')
    })
  }
}

class SceneCredits extends Phaser.Scene {
  constructor() {
    super({ key: 'Credits' });
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
    const bg = this.add.image(1280 / 2, 720 / 2, 'window')

    Element.onClick(bg, () => {}) //Prevent clickthrough

    //Add title
    const title = this.add.text(640, 120, 'Creditos', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Add text
    const credits = this.add.text(640, 360, 'Víctor Cabello Pamukov\nGuillermo Sánchez González\nAlejandro Paniagua Moreno\nRaúl Alfonso Pérez', {
      fontFamily: 'college',
      fontSize: '50px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Add resume button
    const resume = this.add.image(640, 600, 'button')
    const resumeText = this.add.text(640, 600 - 6, 'Volver', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(resume, () => {
      resume.setTexture('buttonHover')
    }, () => {
      resume.setTexture('button')
    })
    Element.onClick(resume, ()=>{
      this.scene.stop()
    })
  }
}
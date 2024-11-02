class SceneCharacters extends Phaser.Scene {
  constructor() {
    super({ key: 'Characters' });
  }



   /*$$$$$           /$$   /$$    
  |_  $$_/          |__/  | $$    
    | $$   /$$$$$$$  /$$ /$$$$$$  
    | $$  | $$__  $$| $$|_  $$_/  
    | $$  | $$  \ $$| $$  | $$    
    | $$  | $$  | $$| $$  | $$ /$$
   /$$$$$$| $$  | $$| $$  |  $$$$/
  |______/|__/  |__/|__/   \__*/

  init(data) {
    
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
    //Load images
    Scene.loadImages(this, [
      ['skin1', 'assets/characters/c1.png'],
      ['skin2', 'assets/characters/c2.png'],
      ['skin3', 'assets/characters/c3.png'],
      ['skin4', 'assets/characters/c4.png'],
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
    //Add title
    const title = this.add.text(640, 120, "Choose your character", {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    //Data to pass to game
    this.data = {
      p1: {
        number: 1,
        skin: 'skin1',
        ready: false
      },
      p2: {
        number: 2,
        skin: 'skin2',
        ready: false
      }
    }
    
    //Player 1
    this.createCharacterSelectScreen(this.data.p1)
    
    //Player 2
    this.createCharacterSelectScreen(this.data.p2)
  }

  createCharacterSelectScreen(key) {
    //Displacement
    const disp = 640 * (key.number - 1)

    //Create player skin indicator
    const player = this.add.image(disp + 320, 360, key.skin)

    //Create skin buttons
    const skin1 = this.add.image(disp + 118, 572, 'skin1')
    Element.onClick(skin1, () => {
      key.skin = 'skin1'
      player.setTexture(key.skin)
    })

    const skin2 = this.add.image(disp + 256, 572, 'skin2')
    Element.onClick(skin2, () => {
      key.skin = 'skin2'
      player.setTexture(key.skin)
    })

    const skin3 = this.add.image(disp + 384, 572, 'skin3')
    Element.onClick(skin3, () => {
      key.skin = 'skin3'
      player.setTexture(key.skin)
    })

    const skin4 = this.add.image(disp + 522, 572, 'skin4')
    Element.onClick(skin4, () => {
      key.skin = 'skin4'
      player.setTexture(key.skin)
    })

    //Add ready button
    const title = this.add.text(disp + 320, 672, 'Ready', {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    Element.onClick(title, () => {
      key.ready = !key.ready
      title.setText(key.ready ? 'Cancel' : 'Ready');
    })
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
    //Both ready
    if (this.data.p1.ready && this.data.p2.ready) Scene.changeScene(this, 'Game', this.data)
  }
}
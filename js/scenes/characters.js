class SceneCharacters extends Phaser.Scene {
  constructor() {
    super({ key: 'Characters' });
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
      ['arrow_next', 'assets/characters/arrow_next.png'],
      ['preview1', 'assets/characters/p1.png'],
      ['preview2', 'assets/characters/p2.png'],
      ['preview3', 'assets/characters/p3.png'],
      ['preview4', 'assets/characters/p4.png'],
      ['skin1', 'assets/characters/s1.png'],
      ['skin2', 'assets/characters/s2.png'],
      ['skin3', 'assets/characters/s3.png'],
      ['skin4', 'assets/characters/s4.png'],
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
    const title = this.add.text(640, 120, 'Choose your character', {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Data to pass to game
    this.data = {
      p1: {
        number: 1,
        skin: Math.floor(Math.random() * (4 - 1) + 1),
        ready: false
      },
      p2: {
        number: 2,
        skin: Math.floor(Math.random() * (4 - 1) + 1),
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
    const scale = key.number == 1 ? 1 : -1

    //Create player skin indicator
    const player = this.add.image(disp + 320, 360, 'preview' + key.skin)
    player.setScale(scale * 2, 2)

    //Create skin swap buttons
    const prev = this.add.image(disp + 320 - 150, 360, 'arrow_next')
    prev.setScale(-0.1, 0.1)
    Element.onClick(prev, () => {
      key.skin--
      if (key.skin < 1) key.skin = 4
      player.setTexture('preview' + key.skin)
    })

    const next = this.add.image(disp + 320 + 150, 360, 'arrow_next')
    next.setScale(0.1, 0.1)
    Element.onClick(next, () => {
      key.skin++
      if (key.skin > 4) key.skin = 1
      player.setTexture('preview' + key.skin)
    })


    //Create skin buttons
    /*const skin1 = this.add.image(disp + 118, 525, 'skin1')
    skin1.setScale(scale * 1, 1)
    Element.onClick(skin1, () => {
      key.skin = 'skin1'
      player.setTexture(key.skin)
    })

    const skin2 = this.add.image(disp + 256, 525, 'skin2')
    skin2.setScale(scale * 1, 1)
    Element.onClick(skin2, () => {
      key.skin = 'skin2'
      player.setTexture(key.skin)
    })

    const skin3 = this.add.image(disp + 384, 525, 'skin3')
    skin3.setScale(scale * 1, 1)
    Element.onClick(skin3, () => {
      key.skin = 'skin3'
      player.setTexture(key.skin)
    })

    const skin4 = this.add.image(disp + 522, 525, 'skin4')
    skin4.setScale(scale * 1, 1)
    Element.onClick(skin4, () => {
      key.skin = 'skin4'
      player.setTexture(key.skin)
    })*/

    //Add ready button
    const ready = this.add.text(disp + 320, 600, 'Ready', {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    Element.onClick(ready, () => {
      key.ready = !key.ready
      ready.setText(key.ready ? 'Cancel' : 'Ready');
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
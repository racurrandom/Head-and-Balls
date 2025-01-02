class SceneCharactersOnline extends Phaser.Scene {
  constructor() {
    super({ key: 'CharactersOnline' });
  }

  player1 
  player2 

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
    const bg = this.add.image(1280 / 2, 720 / 2, 'bg_menu')
    const bgw = this.add.image(1280 / 2, 720 / 2, 'window')

    //Data
    console.log(data)

    


    //Add title
    const title = this.add.text(640, 120, 'Elije tu personaje', {  //120
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Data to pass to game
    this.data = {
      p1: {
        number: 1,
        skin: Util.rand(1, 4),
        ready: false
      },
      p2: {
        number: 2,
        skin: Util.rand(1, 4),
        ready: false
      }
    }

    this.player1 = this.add.image(320, 360, 'preview' + this.data.p1.skin)
    this.player2 = this.add.image(960, 360, 'preview' + this.data.p2.skin)
    
    //Player 1
    this.createCharacterSelectScreen(this.data.p1)
    
    //Player 2
    this.createCharacterSelectScreen(this.data.p2)

    //Stop music on scene close
    Scene.onClose(this, () => {
      SceneMain.music.stop()
    })

    //Register message listener
    Online.onSocketMessage = (type, data) => {
      switch (type) {
        default:
          break;

        case Online.TYPE.C_SKIN:
          this.updateOtherSkin(data, Online.isHost ? this.data.p2 : this.data.p1);
          break;
      }
    }
  }

  createCharacterSelectScreen(key) {
    //Displacement
    const disp = 640 * (key.number - 1)
    const scale = key.number == 1 ? 1 : -1

    //Is this me?
    const me = Online.isHost ^ (key.number - 1);

    //Create player skin indicator
    const player = (key.number-1) ? this.player2 : this.player1
    player.setScale(scale, 1)

    //Create skin swap buttons
    if(me){
      const prev = this.add.image(disp + 320 - 150, 360, 'arrow_next')
      prev.setScale(-0.1, 0.1) 
      Element.onClick(prev, () => {
        key.skin--
        if (key.skin < 1) key.skin = 4
        player.setTexture('preview' + key.skin)
        Online.changeSkin(key.skin);
      })

      const next = this.add.image(disp + 320 + 150, 360, 'arrow_next')
      next.setScale(0.1, 0.1)
      Element.onClick(next, () => {
        key.skin++
        if (key.skin > 4) key.skin = 1
        player.setTexture('preview' + key.skin)
        Online.changeSkin(key.skin);
      })

      //Create "TU" indicator
      const Tu = this.add.text(disp + 320, 120 + 100, 'TÚ', {
        fontFamily: 'college',
        fontSize: '42px',
        fill: '#fff',
        align: 'center'
      }).setOrigin(0.5)  
    }
    //Add ready button
    const ready = this.add.image(disp + 320, 600, 'button')
    const readyText = this.add.text(disp + 320, 600 - 6, 'No listo', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    if(me){
      Element.onHover(ready, () => {
        ready.setTexture('buttonHover')
      }, () => {
        ready.setTexture('button')
      })
      Element.onClick(ready, () => {
        key.ready = !key.ready
        readyText.setText(key.ready ? 'Listo' : 'No listo');
      })
    }
  }

  updateOtherSkin(data, key){
    key.skin = data;
    if(key.number-1) this.player2.setTexture('preview' + key.skin)
    else this.player1.setTexture('preview' + key.skin)
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
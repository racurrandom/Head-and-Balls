class SceneCharactersOnline extends Phaser.Scene {
  constructor() {
    super({ key: 'CharactersOnline' });
  }

  isLoading = false
  data 
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
        isHost: true,
        isMe: Online.isHost,
        number: 1,
        skin: data.p1.skin,
        ready: false
      },
      p2: {
        isHost: false,
        isMe: !Online.isHost,
        number: 2,
        skin: data.p2.skin,
        ready: false
      }
    }

    //Player skin previews
    this.player1 = this.add.image(320, 360, 'preview' + this.data.p1.skin)
    this.player2 = this.add.image(960, 360, 'preview' + this.data.p2.skin)
    


    //Create players
    this.createCharacterSelectScreen(this.data.p1)
    this.createCharacterSelectScreen(this.data.p2)


    //Stop music on scene close
    Scene.onClose(this, () => {
      SceneMain.music.stop()
    })


    //Register message listener
    Online.setSocketOnMessage((type, data) => {
      switch (type) {
        case Online.TYPE.C_SKIN:
          this.updateOtherSkin(data, Online.isHost ? this.data.p2 : this.data.p1);
          break;
        case Online.TYPE.C_READY:
          this.updateOtherReady(data, Online.isHost ? this.data.p2 : this.data.p1);
          break;
        case Online.TYPE.G_INIT:
          this.onBothReady(data)
          break;
      }
    })
  }

  createCharacterSelectScreen(key) {
    //Displacement
    const disp = 640 * (key.number - 1)

    //Create player skin indicator
    const player = key.isHost ? this.player1 : this.player2
    const scale = key.isHost ? 1 : -1
    player.setScale(scale, 1)

    //Create skin swap buttons
    if (key.isMe) {
      const prev = this.add.image(disp + 320 - 150, 360, 'arrow_next')
      prev.setScale(-0.1, 0.1) 
      Element.onClick(prev, () => {
        //Loading game
        if (this.isLoading) return

        //Change skin
        key.skin--
        if (key.skin < 1) key.skin = 4
        player.setTexture('preview' + key.skin)

        //Tell server skin changed
        this.onChangedSkin(key);
      })

      const next = this.add.image(disp + 320 + 150, 360, 'arrow_next')
      next.setScale(0.1, 0.1)
      Element.onClick(next, () => {
        //Loading game
        if (this.isLoading) return

        //Change skin
        key.skin++
        if (key.skin > 4) key.skin = 1
        player.setTexture('preview' + key.skin)

        //Tell server skin changed
        this.onChangedSkin(key);
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
    player.ready = new Button(this, disp + 320, 600, 'No listo', () => {
      //Loading game
      if (this.isLoading) return
      
      //Not me
      if (!key.isMe) return

      //Update ready
      key.ready = !key.ready
      player.ready.text.setText(key.ready ? 'Listo' : 'No listo');

      //Tell server ready changed
      this.onChangedReady(key)
    })
  }

  //This user changed something
  onChangedSkin(key) {
    const data = key.number + ":" + key.skin;
    Online.sendSocketMessage(Online.TYPE.C_SKIN, data)
  }

  onChangedReady(key) {
    const data = key.number + ":" + key.ready;
    Online.sendSocketMessage(Online.TYPE.C_READY, data)
  }

  //Other user changed something
  updateOtherSkin(data, key) {
    key.skin = data;
    if (key.isHost) 
      this.player1.setTexture('preview' + key.skin)
    else 
      this.player2.setTexture('preview' + key.skin)
  }

  updateOtherReady(data, key) {
    key.ready = data;
    if (key.isHost) 
      this.player1.ready.text.setText(key.ready ? 'Listo' : 'No listo');
    else 
      this.player2.ready.text.setText(key.ready ? 'Listo' : 'No listo');
  }

  //Load game
  onBothReady(data) {
    //Parse server data
    const serverData = JSON.parse(data)

    //Start loading game
    this.isLoading = true
    this.sound.add('piii').play()

    //Create init data
    const initData = this.data
    initData.game = serverData

    //Load game
    setTimeout(() => {
      Scene.changeScene(this, 'GameOnline', initData)
    }, 1000)
  }
}
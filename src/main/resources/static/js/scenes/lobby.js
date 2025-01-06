class SceneLobby extends Phaser.Scene {

  static checkLobbyInterval

  constructor() {
    super({ key: 'Lobby' });
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


    //Is waiting for server response
    this.waitingForResponse = false
    this.inLobby = undefined
    this.mainScene = mainScene


    //Add title
    const title = this.add.text(640, 120, 'Lobby', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Add create button
    this.createButton = new Button(this, -1000, -1000, 'Crear', () => {
      //Waiting for response
      if (this.waitingForResponse) return
      this.waitingForResponse = true

      //Create lobby
      Online.createLobby((data, error) => {
        //Stop waiting
        this.waitingForResponse = false

        //Update info text
        if (error) this.infoText.text = error.responseText
        
        //Hosting
        if (!error) { 
          this.setInLobby(true)
          Online.isHost = true
        }
      })
    })


    //Add join username input
    this.joinBox = this.add.image(-1000, -1000, 'textBox')
    this.joinInput = new InputField(this.add.text(-1000, -1000, '', {
      fontFamily: 'poppins',
      fontSize: '32px',
      fill: '#000',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Usuario host',
      max: 15
    })
    Element.onClick(this.joinBox, () => {
      this.joinInput.toggle()
    })


    //Add join button
    this.joinButton = new Button(this, -1000, -1000, 'Unirse', () => {
      //Waiting for response
      if (this.waitingForResponse) return
      this.waitingForResponse = true

      //Join lobby
      Online.joinLobby(this.joinInput.text, (data, error) => {
        //Stop waiting
        this.waitingForResponse = false

        //Update info text
        if (error) this.infoText.text = error.responseText

        //Joined
        if (!error) {
          this.setInLobby(true)
          Online.isHost = false
        }
      })
    })


    //Info text
    this.infoText = this.add.text(400, 520, 'Cargando...', {
      fontSize: '24px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //Add back button
    this.backButton = new Button(this, -1000, -1000, 'Volver', () => {
      if (this.inLobby) {
        //Leave lobby

        //Waiting for response
        if (this.waitingForResponse) return
        this.waitingForResponse = true
  
        //Create lobby
        Online.leaveLobby((data, error) => {
          //Stop waiting
          this.waitingForResponse = false
  
          //Update info text
          if (error) this.infoText.text = error.responseText

          //Leave
          if (!error) this.setInLobby(false)
        })
      } else {
        //Clear check interval
        clearInterval(SceneLobby.checkLobbyInterval)
        SceneLobby.checkLobbyInterval = undefined

        //Go back to modes
        this.scene.stop('ChatLobby')
        Scene.changeScene(this, 'Modes', mainScene)
      }
    })


    //Mini chat
    this.scene.launch('ChatLobby');


    //Check if in a lobby
    this.checkInLobby()
  }

  checkInLobby() {
    Online.checkInLobby((lobby, error) => {
      if (error) {
        console.log(error)
        return
      }

      switch (lobby.users) {
        //None
        case 0:
          //Not in a lobby -> Show buttons
          this.setInLobby(false)
          break

        //Only host
        case 1:
          //Alone in a lobby (hosting) -> Hide buttons
          this.setInLobby(true)
          break

        //Full lobby
        case 2:
          //In a full lobby -> Init websocket
          Online.initSocket((type, data) => {
            
            //Check if type is init characters
            if (type != Online.TYPE.C_INIT) return
    
            //Parse server data
            data = JSON.parse(data)

            //Load characters scene
            this.mainScene.scene.stop()
            this.scene.stop('ChatLobby')
            Scene.changeScene(this, 'CharactersOnline', data)
          })

          //Change status
          this.infoText.text = 'Cargando...'
  
          //Stop check interval
          if (SceneLobby.checkLobbyInterval) {
            clearInterval(SceneLobby.checkLobbyInterval)
            SceneLobby.checkLobbyInterval = undefined
          }
          return
      }

      //Start check interval
      if (!SceneLobby.checkLobbyInterval) {
        SceneLobby.checkLobbyInterval = setInterval(() => {
          this.checkInLobby()
        }, 1000)
      }
    })
  }

  setInLobby(inLobby) {
    //Already there
    if (this.inLobby == inLobby) return

    //Update var
    this.inLobby = inLobby

    //Update views
    if (inLobby) {
      this.infoText.text = 'Esperando a que alguien se una...'
      this.createButton.move(-1000, -1000)
      this.joinBox.x = -1000
      this.joinBox.y = -1000
      this.joinInput.move(-1000, -1000)
      this.joinButton.move(-1000, -1000)
    } else {
      this.infoText.text = ''
      this.createButton.move(250, 400)
      this.joinBox.x = 400
      this.joinBox.y = 300
      this.joinInput.move(400, 300)
      this.joinButton.move(550, 400)
    }
    this.backButton.move(640, 600)
  }
}
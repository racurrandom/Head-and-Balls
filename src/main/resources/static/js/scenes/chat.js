class SceneChat extends Phaser.Scene {
  constructor() {
    super({ key: 'Chat' });
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
    const bg = this.add.image(1280 / 2, 720 / 2, 'bg_menu')
    const bgw = this.add.image(1280 / 2, 720 / 2, 'window')


    //Add back button
    const back = this.add.image(1170, 110, 'back_button')
    Element.onClick(back, () => {
      InputField.reset()
      Scene.changeScene(this, 'Main')
    })


    //Error text
    const errorText = this.add.text(640, 75, '', {
      fontSize: '24px',
      fill: '#fff',
      align: 'right'
    }).setOrigin(0.5)


    //Create chat view
    const chat = new ChatView(this, 100, 570, 1080, 470)
    const onMessages = (data, error) => {
      //Update error text
      if (error) console.log(error.responseText)
      errorText.text = error ? 'Error... Puede que el servidor este offline' : ''

      //Get data
      if (typeof data !== 'object') return
      const lastID = data.lastID
      const usernames = data.usernames
      const messages = data.messages

      //Add messages
      for (let i = 0; i < messages.length; i++) {
        const ID = lastID - (messages.length - 1) + i
        const username = usernames[i]
        const message = messages[i]
        chat.addMessage(ID, username, message)
      }
    }
    
    //Read chat & create read loop
    OnlineManager.chatRead(onMessages)
    const readChatLoop = setInterval(() => {
      OnlineManager.chatRead(onMessages, chat.getLastID())
    }, 500)
    Scene.onClose(this, () => {
      clearInterval(readChatLoop);
    })


    //Create message input
    const messageInput = new InputField(this.add.text(100, 620, '', {
      fontFamily: 'poppins',
      fontSize: '30px',
      fill: '#fff'
    }).setOrigin(0, 0.5), {
      placeholder: 'Mensaje',
      max: 40,
      onEnter: (text) => {
        //Clear input text
        messageInput.setText('')

        //Send message
        OnlineManager.chatSend(text, (error) => {
          //Update error text
          if (error) console.log(error.responseText)
          errorText.text = error ? 'Error... Puede que el servidor este offline' : ''
        })
      }
    })


    //Add scroll to chat
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      chat.scroll(deltaY)
    })
  }
}

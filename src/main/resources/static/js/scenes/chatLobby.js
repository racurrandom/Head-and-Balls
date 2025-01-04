class SceneChatLobby extends Phaser.Scene {

  static openTime = 0

  constructor() {
    super({ key: 'ChatLobby' });
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
    //Save open time
    this.openTime = Date.now()
    SceneChat.openTime = this.openTime


    //Create chat view & users count
    const chat = new ChatView(this, 1280/2 - 130, 600, 1080, 450, 16)
   

    //Create read messages function
    const onMessages = (data, error) => {
      //Show error message
      if (error) this.onError(error)

     

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
    Online.chatRead(onMessages)
    this.readChatLoop = setInterval(() => {
      Online.chatRead(onMessages, chat.getLastID())
    }, 250)


    //Create message input
    const chatBox = this.add.image(1280 / 2, 620, 'textBox3')
    const messageInput = new InputField(this.add.text(1280/2 - 130, 620, '', {
      fontFamily: 'poppins',
      fontSize: '16px',
      fill: '#000'
    }).setOrigin(0, 0.5), {
      placeholder: 'Mensaje',
      max: 25,
      onEnter: (text) => {
        //Clear input text
        messageInput.setText('')

        //Send message
        Online.chatSend(text, (data, error) => {
          //Show error message
          if (error) this.onError(error)
        })
      }
    })
    Element.onClick(chatBox, () => {
      messageInput.toggle()
    })

    //Add scroll to chat
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      chat.scroll(deltaY)
    })
  }

  onError(error) {
    //Not the same chat scene
    if (SceneChat.openTime != this.openTime) return

    //Already closed scene
    if (this.exited) return
    this.exited = true

    //Do stuff
    console.log(error.responseText)
    clearInterval(this.readChatLoop)
    Scene.changeScene(this, 'Error')
  }
}

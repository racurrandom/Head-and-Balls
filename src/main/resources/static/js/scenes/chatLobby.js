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

    //Chat position
    const chatX = 1280/2 + 200


    //Create chat view & users count
    let checkUsersCounter = 0
    const chat = new ChatView(this, chatX, 590, 1080, 450, 16)
    const usersText = this.add.text(840, 120, '', {
      fontFamily: 'poppins',
      fontSize: '22px',
      fill: '#fff'
    }).setOrigin(0, 1)

    //Create read messages function
    const onMessages = (data, error) => {
      //Show error message
      if (error) this.onError(error)
        
      //Check users
      checkUsersCounter--
      if (checkUsersCounter <= 0) {
        checkUsersCounter = 10
        Online.getUsers((users, error) => {
          if (error) return
          usersText.text = 'Online: ' + users.length
        })
      }

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
    const chatBox = this.add.image(chatX + 170, 620, 'textBox3')
    const messageInput = new InputField(this.add.text(chatX, 620, '', {
      fontFamily: 'poppins',
      fontSize: '16px',
      fill: '#000'
    }).setOrigin(0, 0.5), {
      placeholder: 'Mensaje (chat global)',
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


    Scene.onClose(this, () => {
      clearInterval(this.readChatLoop)
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
    Scene.error(this)
  }
}

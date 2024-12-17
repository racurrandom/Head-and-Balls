class SceneChat extends Phaser.Scene {
  constructor() {
    super({ key: 'Chat' });
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
    //Error text
    const errorText = this.add.text(1210, 70, '', {
      fontSize: '24px',
      fill: '#fff',
      align: 'right'
    }).setOrigin(1, 0)


    //Create chat view
    const chat = new ChatView(this, 70, 600)
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
    }, 1000)
    Scene.onClose(this, () => {
      clearInterval(readChatLoop);
    })


    //Create message input
    const messageInput = new InputField(this.add.text(70, 650, '', {
      fontFamily: 'poppins',
      fontSize: '24px',
      fill: '#fff'
    }).setOrigin(0, 0.5), {
      placeholder: 'Mensaje',
      max: 100,
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
    
  }
}

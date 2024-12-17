class ChatView {
  
  x = 0
  y = 0

  w = 0
  h = 0

  spacing = 15

  scene = undefined
  messages = []


  constructor(scene, x, y, w, h) {
    this.scene = scene
    this.x = x
    this.y = y
  }

  addMessage(id, username, text) {
    //Create message view
    const view = this.scene.add.text(this.x, this.y, (username + ':\n' + text).split('\n'), {
      fontFamily: 'poppins',
      fontSize: '24px',
      fill: '#fff'
    }).setOrigin(0, 1)

    //Add message to list
    this.messages.push(new ChatMessage(id, username, text, view))

    //Reorder list
    this.reorder()
  }

  getLastID() {
    return this.messages.length == 0 ? 0 : this.messages[this.messages.length - 1].ID
  }

  reorder() {
    let y = this.y
    //Reposition messages
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i]
      message.view.y = y
      y -= message.view.height + this.spacing
    }
  }
}

class ChatMessage {
  ID
  username
  text
  view

  constructor(ID, username, text, view) {
    this.ID = ID
    this.username = username
    this.text = text
    this.view = view
  }
}
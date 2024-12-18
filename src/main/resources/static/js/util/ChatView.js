class ChatView {
  
  //Position & size
  _x = 0
  _y = 0
  _w = 0
  _h = 0
  _scroll = 0
  _scrollMax = 0

  //Gap between messages
  gap = 15

  //Mask
  maskRect = undefined
  mask = undefined

  //Other
  scene = undefined
  messages = []


  constructor(scene, x, y, w, h) {
    this.scene = scene
    this._x = x
    this._y = y
    this._w = w
    this._h = h
    this.updateMask()
  }

  updateMask() {
    //Delete previous mask
    if (this.maskRect) this.maskRect.destroy()

    //Create mask
    this.maskRect = this.scene.add.rectangle(this._x + this._w/2, this._y - this._h/2, this._w, this._h, 0x000000).setVisible(false)
    this.mask = this.maskRect.createGeometryMask()

    //Update messages mask
    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i]
      message.view.setMask(this.mask)
    }
  }

  addMessage(id, username, text) {
    //Create message view
    const view = this.scene.add.text(this._x, this._y, (username + ':\n' + text).split('\n'), {
      fontFamily: 'poppins',
      fontSize: '24px',
      fill: '#fff'
    }).setOrigin(0, 1)
    view.setMask(this.mask)

    //Add message to list
    this.messages.push(new ChatMessage(id, username, text, view))

    //Reorder list
    this.reorder()
  }

  getLastID() {
    return this.messages.length == 0 ? 0 : this.messages[this.messages.length - 1].ID
  }

  reorder() {
    //Starting height
    let y = this._y - this._scroll

    //Reposition messages
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i]
      message.view.y = y
      y -= message.view.height + this.gap
    }

    //Save next y as max scroll
    this._scrollMax = Math.min(y - this._y + this._scroll + this._h + this.gap, 0)
  }

  scroll(amount) {
    //Scroll only if
    if (this._scrollMax >= 0) return

    //Update scroll by amount
    this._scroll += amount

    //Clamp scroll between scrollMax and 0
    if (this._scroll > 0) this._scroll = 0
    if (this._scroll < this._scrollMax) this._scroll = this._scrollMax

    //Reorder list with scroll
    this.reorder()
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
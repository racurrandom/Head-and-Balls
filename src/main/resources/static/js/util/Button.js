class Button {

  image = undefined
  text = undefined

  constructor(scene, x, y, text, onClick, options) {
    //Fix options
    if (typeof options !== 'object') options = {}

    //Create image & text
    this.image = scene.add.image(x, y, 'button')
    this.text = scene.add.text(x, y - 6, text, {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Hover animation
    if (typeof options.animateHover !== 'boolean' || options.animateHover) {
      Element.onHover(this.image, () => {
        this.image.setTexture('buttonHover')
      }, () => {
        this.image.setTexture('button')
      })
    }

    //Click event
    if (typeof onClick !== 'function') return
    Element.onClick(this.image, onClick)
  }

  move(x, y){
    this.image.x = x
    this.image.y = y
    this.text.x = x
    this.text.y = y - 6
  }
}
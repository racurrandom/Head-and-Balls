class InputField {

  //Current input being used
  static current = undefined

  //Input info
  enabled = false
  canType = true
  onKey = undefined
  element = undefined
  next = undefined
  text = ''

  //Customizable info
  placeholder = 'Input'
  selectColor = '#02b33f'
  max = Infinity
  min = 0
  onInput = undefined
  onEnter = undefined

  constructor(element, options) {
    //Save element
    this.element = element
    this.text = element.text

    //Add click event to text (to toggle input)
    Element.onClick(element, () => { this.toggle() })

    //Check options
    if (typeof options === 'object') {
      if (typeof options.placeholder === 'string') this.placeholder = options.placeholder
      if (typeof options.selectColor === 'string') this.selectColor = options.selectColor
      if (typeof options.max === 'number') this.max = options.max
      if (typeof options.min === 'number') this.min = options.min
      if (typeof options.onInput === 'function') this.onInput = options.onInput
      if (typeof options.onEnter === 'function') this.onEnter = options.onEnter
    }

    //Update text
    this.updateText()
  }

  //Setters
  setText(text) {
    //Change text
    this.text = text
    this.updateText()

    //Call onInput
    if (typeof this.onInput === 'function') this.onInput(this.text)
  }

  setCanType(canType) {
    this.canType = canType
  }

  setNext(next) {
    if (typeof next !== 'object') return
    this.next = next
  }

  //Other
  updateText() {
    if (this.text.length <= 0) {
      //Placeholder
      this.element.alpha = 0.5
      this.element.text = this.placeholder
    } else {
      //Text
      this.element.alpha = 1
      this.element.text = this.text
    }
  }

  disable() {
    //Disable
    if (!this.enabled) return
    this.enabled = false

    //Deselect input
    InputField.current = undefined
    this.element.setBackgroundColor('transparent')
    
    //Remove listener
    window.removeEventListener('keydown', this.onKey)
  }

  enable() {
    //Disable other if cant type
    if (!this.canType) {
      InputField.reset()
      return
    }

    //Enable
    if (this.enabled) return
    this.enabled = true

    //Another enabled -> Disable it
    InputField.reset()

    //Select input (change background)
    InputField.current = this
    this.element.setBackgroundColor(this.selectColor)

    //Create & add listener
    this.onKey = async (event) => {
      //Should call onInput
      let callOnInput = true

      //Check key
      switch (event.key.toLowerCase()) {
        //Next input
        case 'tab':
          callOnInput = false
          if (typeof this.next !== 'object')
            this.disable()
          else
            this.next.enable()
          break

        //Enter
        case 'enter':
          callOnInput = false
          if (typeof this.onEnter === 'function') 
            this.onEnter(this.text)
          else
            this.disable()
          break

        //Remove key
        case 'backspace':
          //Minimum length reached
          if (this.text.length <= this.min) break
          
          //No text
          if (this.text == "") break

          //Remove character
          this.text = this.text.slice(0, -1)
          this.updateText()
          break

        //Normal key
        default:
          //Get key
          let key = event.key

          //Not a normal character
          if (key.length > 1) {
            callOnInput = false
            break
          }

          //Control is pressed
          if (event.ctrlKey) switch (key.toLowerCase()) {
            //Paste
            case 'v':
              key = await navigator.clipboard.readText()
              break
          }

          //Exceeds maximum length
          if (this.text.length + key.length > this.max) break

          //Add character
          this.text += key
          this.updateText()
          break
      }

      //Call onInput
      if (callOnInput && typeof this.onInput === 'function') 
        this.onInput(this.text)
      else if (!callOnInput)
        event.preventDefault()
    }
    window.addEventListener('keydown', this.onKey)
  }

  toggle() {
    if (this.enabled)
      this.disable()
    else
      this.enable()
  }

  static reset() {
    if (InputField.current) InputField.current.disable()
  }
}
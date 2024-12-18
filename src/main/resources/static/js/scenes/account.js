class SceneAccount extends Phaser.Scene {
  constructor() {
    super({ key: 'Account' });
  }

  delete
  register
  login
  logout
  updateButton

  usernameInput
  passwordInput

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


    const textBox1 = this.add.image(1280 / 2, 250, 'textBox')
    const textBox2 = this.add.image(1280 / 2, 325, 'textBox')

    //Add title
    const title = this.add.text(640, 120, 'Cuenta', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //Username input
    this.usernameInput = new InputField(this.add.text(640, 250, '', {
      fontFamily: 'poppins',
      fontSize: '35px',
      fill: '#000',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Usuario',
      max: 15
    })


    //Password input 
    this.passwordInput = new InputField(this.add.text(640, 325, '', {
      fontFamily: 'poppins',
      fontSize: '35px',
      fill: '#000',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Contraseña',
      max: 15
    })


    //Info text
    const errorText = this.add.text(640, 350, '', {
      fontSize: '24px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    

    //Register button
    this.register = new Button(this, 480, 450, 'Registrar')
    Element.onClick(this.register.image, () => {
      OnlineManager.register(this.usernameInput.text, this.passwordInput.text, (isLogged, error) => {
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Not logged in -> Return
        if (!isLogged) return
        
        //Save user & password
        OnlineManager.username = this.usernameInput.text
        OnlineManager.password = this.passwordInput.text

        //Reset input fields
        InputField.reset()
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })

    //Login button
    this.login = new Button(this, 800, 450, 'Entrar')
    Element.onClick(this.login.image, () => {
      OnlineManager.login(this.usernameInput.text, this.passwordInput.text, (isLogged, error) => {
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Not logged in -> Return
        if (!isLogged) return
        
        //Save user & password
        OnlineManager.username = this.usernameInput.text
        OnlineManager.password = this.passwordInput.text

        //Reset input fields
        InputField.reset()
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })

    //Logout button
    this.logout = new Button(this, 940, 450, 'Cerrar')
    Element.onClick(this.logout.image, () => {
      OnlineManager.logout((isLogged, error) => {
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Still logged in -> Return
        if (isLogged) return
        
        //Save user & password
        OnlineManager.username = ''
        OnlineManager.password = ''

        //Reset input fields
        InputField.reset()
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })


    //Add delete account button
    this.delete = new Button(this, 390, 450, 'Borrar')
    Element.onClick(this.delete.image, () =>{ 
      OnlineManager.deleteAccount((isLogged, error)=>{
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Still logged in -> Return
        if (isLogged) return
        
        //Save user & password
        OnlineManager.username = ''
        OnlineManager.password = ''

        //Reset input fields
        InputField.reset()

        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })

    //Add an update button
    this.updateButon = new Button(this, 640, 450, 'Actualizar')
    Element.onClick(this.updateButon.image, () =>{ 
      OnlineManager.updateAccount(this.usernameInput.text, this.passwordInput.text, (isLogged, error)=>{
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Still logged in -> Return
        if (!isLogged) return
        
        //Save user & password
        OnlineManager.username = this.usernameInput.text
        OnlineManager.password = this.passwordInput.text

        //Reset input fields
        InputField.reset()
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkLogged()
      })
    })


    //Add back button
    const back = new Button(this, 640, 600, 'Volver')
    Element.onClick(back.image, () => {
      //Reset input fields
      InputField.reset()
      
      //Stop scene
      this.scene.stop()

      //Check if logged in changed
      mainScene.checkLogged()
    })

    

    //Show the corresponding buttons
    this.toggleLogged()
  }

  toggleLogged() {
    if (OnlineManager.isLogged) {
      //Already logged

      //Move buttons
      this.register.Move(-200, -200)
      this.login.Move(-200, -200)
      this.delete.Move(340, 450)
      this.logout.Move(940, 450)
      this.updateButon.Move(640, 450)

      //Change text
      this.usernameInput.setText(OnlineManager.username)
      this.passwordInput.setText(OnlineManager.password)

      //Disable typing in user
      this.usernameInput.setCanType(false)

    } else {  
      //Not logged yet
      
      //Move buttons
      this.register.Move(480, 450)
      this.login.Move(800, 450)
      this.delete.Move(-200, -200)
      this.logout.Move(-200, -200)
      this.updateButon.Move(-200, -200)

      //Change text
      this.usernameInput.setText('')
      this.passwordInput.setText('')

      //Enable typing in user
      this.usernameInput.setCanType(true)
    }
  }
}
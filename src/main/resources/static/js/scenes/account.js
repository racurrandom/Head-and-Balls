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


    //Add title
    const title = this.add.text(640, 120, 'Cuenta', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)


    //Username input
    const usernameBox = this.add.image(640, 240, 'textBox')
    this.usernameInput = new InputField(this.add.text(640, 240, '', {
      fontFamily: 'poppins',
      fontSize: '32px',
      fill: '#000',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Usuario',
      max: 15
    })
    Element.onClick(usernameBox, () => {
      this.usernameInput.toggle()
    })


    //Password input 
    const passwordBox = this.add.image(640, 310, 'textBox')
    this.passwordInput = new InputField(this.add.text(640, 310, '', {
      fontFamily: 'poppins',
      fontSize: '32px',
      fill: '#000',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Contraseña',
      max: 15,
      isPassword: true
    })
    Element.onClick(passwordBox, () => {
      this.passwordInput.toggle()
    })
    this.usernameInput.setNext(this.passwordInput)


    //Password show
    this.passwordShow = this.add.image(900, 310, 'powerIce')
    Element.onClick(this.passwordShow, () => {
      const isPassword = !this.passwordInput.isPassword
      this.passwordInput.setIsPassword(isPassword)
      this.passwordShow.setTexture(isPassword ? 'powerIce' : 'powerIceBad')
    })


    //Info text
    const errorText = this.add.text(640, 370, '', {
      fontSize: '24px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    

    //Register button
    this.register = new Button(this, 480, 450, 'Registrar', () => {
      Online.register(this.usernameInput.text, this.passwordInput.text, (isLogged, error) => {
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Not logged in -> Return
        if (!isLogged) return
        
        //Save user & password
        Online.username = this.usernameInput.text
        Online.password = this.passwordInput.text
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkIsLogged()
      })
    })

    //Login button
    this.login = new Button(this, 800, 450, 'Entrar', () => {
      Online.login(this.usernameInput.text, this.passwordInput.text, (isLogged, error) => {
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Not logged in -> Return
        if (!isLogged) return
        
        //Save user & password
        Online.username = this.usernameInput.text
        Online.password = this.passwordInput.text
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkIsLogged()
      })
    })

    //Logout button
    this.logout = new Button(this, 940, 450, 'Cerrar', () => {
      Online.logout((isLogged, error) => {
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Still logged in -> Return
        if (isLogged) return
        
        //Save user & password
        Online.username = ''
        Online.password = ''
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkIsLogged()
      })
    })


    //Add delete account button
    this.delete = new Button(this, 390, 450, 'Borrar', () =>{ 
      Online.deleteAccount((isLogged, error)=>{
        //Update error text
        errorText.text = error ? error.responseText : ''

        //Still logged in -> Return
        if (isLogged) return
        
        //Save user & password
        Online.username = ''
        Online.password = ''

        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkIsLogged()
      })
    })

    //Add an update button
    this.updateButon = new Button(this, 640, 450, 'Actualizar', () => { 
      Online.updateAccount(this.passwordInput.text, (isLogged, error) => {
        //Update error text
        errorText.text = error ? error.responseText : 'Usuario actualizado correctamente'

        //Still logged in -> Return
        if (!isLogged) return
        
        //Save password
        Online.password = this.passwordInput.text
        
        //Update buttons
        this.toggleLogged()

        //Check if logged in changed
        mainScene.checkIsLogged()
      })
    })


    //Add back button
    const back = new Button(this, 640, 600, 'Volver', () => {
      //Stop scene
      this.scene.stop()

      //Check if logged in changed
      mainScene.checkIsLogged()
    })


    //Show the corresponding buttons
    this.toggleLogged()
  }

  toggleLogged() {
    if (Online.isLogged) {
      //Already logged

      //Move buttons
      this.register.move(-200, -200)
      this.login.move(-200, -200)
      this.delete.move(340, 450)
      this.logout.move(940, 450)
      this.updateButon.move(640, 450)

      //Change text
      this.usernameInput.setText(Online.username)
      this.passwordInput.setText(Online.password)

      //Disable typing in user
      this.usernameInput.setCanType(false)

    } else {  
      //Not logged yet
      
      //Move buttons
      this.register.move(480, 450)
      this.login.move(800, 450)
      this.delete.move(-200, -200)
      this.logout.move(-200, -200)
      this.updateButon.move(-200, -200)

      //Change text
      this.usernameInput.setText('')
      this.passwordInput.setText('')

      //Enable typing in user
      this.usernameInput.setCanType(true)
    }
  }
}
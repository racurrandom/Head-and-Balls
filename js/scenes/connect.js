class SceneConnect extends Phaser.Scene {
  constructor() {
    super({ key: 'Connect' });
  }



    /*$$$$$                                  /$$              
   /$$__  $$                                | $$              
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ |__/       \_______/ \_______/   \___/   \______*/

  create() {
    //Add background
    const bg = this.add.image(1280 / 2, 720 / 2, 'window')

    Element.onClick(bg, () => {}) //Prevent clickthrough

    //Add title
    const title = this.add.text(640, 120, 'Usuario', {
      fontFamily: 'college',
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //IP input
    const IPInput = new InputField(this.add.text(640, 250, OnlineManager.IP, {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'IP:PUERTO',
      max: 20,
      onInput: (text) => {
        OnlineManager.setIP(text)
      }
    })

    //Username input
    const usernameInput = new InputField(this.add.text(640, 300, '', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Usuario',
      max: 15
    })

    //Password input 
    const passwordInput = new InputField(this.add.text(640, 350, '', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5), {
      placeholder: 'Contraseña',
      max: 15
    })

    
    
    const register = this.add.image(480, 450, 'button')
    const registerText = this.add.text(480, 450 - 6, 'Crear', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(register, () => {
      register.setTexture('buttonHover')
    }, () => {
      register.setTexture('button')
    })

    const login = this.add.image(800, 450, 'button')
    const loginText = this.add.text(800, 450 - 6, 'Iniciar', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(login, () => {
      login.setTexture('buttonHover')
    }, () => {
      login.setTexture('button')
    })

    /*const logout = this.add.image(640, 450, 'button')
    const logoutText = this.add.text(640, 450 - 6, 'Cerrar', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(logout, () => {
      logout.setTexture('buttonHover')
    }, () => {
      logout.setTexture('button')
    })*/



    //Add resume button
    const resume = this.add.image(640, 600, 'button')
    const resumeText = this.add.text(640, 600 - 6, 'Volver', {
      fontFamily: 'college',
      fontSize: '30px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    Element.onHover(resume, () => {
      resume.setTexture('buttonHover')
    }, () => {
      resume.setTexture('button')
    })
    Element.onClick(resume, () => {
      if (InputField.current) InputField.current.disable()
      this.scene.stop()
    })
  }
}
class OnlineManager {

  static IP = ''
  static isLogged = false

  static init() {
    OnlineManager.IP = localStorage.getItem('ip')
    if (OnlineManager.IP == null) OnlineManager.IP = ''
  }

  static setIP(newIP) {
    OnlineManager.IP = newIP
    localStorage.setItem('ip', OnlineManager.IP)
  }

  //Checks
  static checkOnline(onCheck) {
    //Create request
    const request = new Request('http://' + OnlineManager.IP + '/api/test')

    //Send request
    fetch(request)
      .then((response) => {
        if (response.ok)
          onCheck(true)
        else
          throw new Error("Error checking if server is online")
      })
      .catch((error) => {
        console.log(error)
        onCheck(false)
      })
  }

  static checkLogged(onCheck) {
    //Create request
    const request = new Request('http://' + OnlineManager.IP + '/api/auth')

    //Send request
    fetch(request)
      .then((response) => {
        if (response.ok) {
          OnlineManager.isLogged = true
          onCheck(OnlineManager.isLogged)
        } else {
          throw new Error("User is not online")
        }
      })
      .catch((error) => {
        console.log(error)
        OnlineManager.isLogged = false
        onCheck(OnlineManager.isLogged)
      })
  }

  //Register
  static register(username, password, onRegister){
    //Create request
    const request = new Request('http://' + OnlineManager.IP + '/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    //Send request
    fetch(request)
      .then((response) => {
        if(response.ok) {
          login(this.username, this.password, this.onRegister)
        }else {
          throw new Error("Error registering")
        }
      })
      .catch((error) => {
        console.log(error)
        onRegister(false)
      })
  }

  //Loggin
  static login(username, password, onLogged) {
    //Create request
    const request = new Request('http://' + OnlineManager.IP + '/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    //Send request
    fetch(request)
      .then((response) => {
        if (response.ok) {
          OnlineManager.isLogged = true
          onLogged(OnlineManager.isLogged)
        } else {
          throw new Error("Error logging in")
        }
      })
      .catch((error) => {
        console.log(error)
        onLogged(OnlineManager.isLogged)
      })
  }

  static logout(onLogged) {
    //Create request
    const request = new Request('http://' + OnlineManager.IP + '/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    //Send request
    fetch(request)
      .then((response) => {
        if (response.ok) {
          OnlineManager.isLogged = false
          onCheck(OnlineManager.isLogged)
        } else {
          throw new Error("Error logging out")
        }
      })
      .catch((error) => {
        console.log(error)
        onCheck(OnlineManager.isLogged)
      })
  }
}
class Online {

  static IP = window.location.origin
  static username = ''
  static password = ''
  static isLogged = false
  static notifyInterval = undefined
  static isHost = false;

  static socket
  static onSocketMessage
  static TYPE = {
    //Characters scene
    C: 'C',
    C_INIT: 'CI',
    C_SKIN: 'CS',
    //Game scene
    G: 'G',
    G_INIT: 'GI',
  };


  //WebSocket
  static initSocket(onMessage) {
    //Close socket if active
    if (Online.socket) return
    Online.onSocketMessage = onMessage

    //Create WebSocket
    Online.socket = new WebSocket("ws://" + location.host + "/ws");

    //Add events
    Online.socket.onopen = () => {
      //Login with username
      Online.sendSocketMessage(Online.TYPE.C_INIT, Online.username)
    }

    Online.socket.onerror = (error) => {
      //Log error
      console.log(error); 
    }

    Online.socket.onclose = () => {
      //Clear socket variable
      Online.socket = undefined
      console.log("clossing socket nigga")
    }

    Online.socket.onmessage = (event) => {
      //Get scene, type & data
      const type = event.data.substring(0, 2)
      const data = event.data.length > 2 ? JSON.parse(event.data.substring(2)) : null

      //Run callback
      if (typeof Online.onSocketMessage == 'function') Online.onSocketMessage(type, data)
    }
  }

  static sendSocketMessage(type, data) {
    //Valid arguments
    if (typeof type !== 'string') return
    if (typeof data !== 'string') return

    //Send message
    Online.socket.send(`${type}${data}`)
  }

  static setSocketOnMessage(onMessage) {
    Online.onSocketMessage = onMessage
  }

  static changeSkin(skin){
    const data = (this.isHost ? "host" : "noob")+":"+skin;
    this.sendSocketMessage(Online.TYPE.C_SKIN, data)
  }


  //Methods
  static get(options) {
    //Invalid options
    if (typeof options !== 'object') return

    //Create settings
    const settings = {
      timeout: 5000,
      type: 'GET',
    }

    //Add options to settings
    for (const [key, value] of Object.entries(options)) settings[key] = value
    
    //Send request
    $.ajax(settings)
  }

  static post(options) {
    //Invalid options
    if (typeof options !== 'object') return

    //Create settings
    const settings = {
      timeout: 5000,
      type: 'POST',
    }

    //Add options to settings
    for (const [key, value] of Object.entries(options)) settings[key] = value
    
    //Send request
    $.ajax(settings)
  }

  static put(options) {
    //Invalid options
    if (typeof options !== 'object') return

    //Create settings
    const settings = {
      timeout: 5000,
      type: 'PUT',
    }

    //Add options to settings
    for (const [key, value] of Object.entries(options)) settings[key] = value
    
    //Send request
    $.ajax(settings)
  }

  static delete(options) {
    //Invalid options
    if (typeof options !== 'object') return

    //Create settings
    const settings = {
      timeout: 5000,
      type: 'DELETE',
    }

    //Add options to settings
    for (const [key, value] of Object.entries(options)) settings[key] = value
    
    //Send request
    $.ajax(settings)
  }


  //Server
  static checkServerOnline(callback) {
    Online.get({
      url: Online.IP + '/api/test',
      success: (data) => {
        if (typeof callback === 'function') callback(true)
      },
      error: (error) => {
        if (typeof callback === 'function') callback(false, error)
      },
    })
  }

  //Session
  static setIsLogged(isLogged) {
    //Update isLogged
    Online.isLogged = isLogged

    //Stop interval
    if (Online.notifyInterval) clearInterval(Online.notifyInterval)
    
    //Add a new one if logged
    if (!isLogged) return
    Online.notifyInterval = setInterval(() => {
      Online.checkIsLogged((logged, error) => {
        //No error or it isnt a timeout
        if (!error || error.status != 0) return

        //Timeout ocurred
      })
    }, 6000)
  }

  static checkIsLogged(callback) {
    Online.get({
      url: Online.IP + '/api/auth',
      success: (data) => {
        //Update isLogged
        Online.setIsLogged(true)

        //Run callback
        if (typeof callback === 'function') callback(data)
      },
      error: (error) => {
        //Update isLogged
        Online.setIsLogged(false)

        //Run callback
        if (typeof callback === 'function') callback(undefined, error)
      },
    })
  }

  //Update account
  static updateAccount(password, callback) {
    Online.put({
      url: Online.IP + '/api/auth/update',
      contentType: 'application/json',
      data: JSON.stringify({
        username: this.username,
        password: password
      }),
      success: (data) => {
        //Update isLogged
        Online.setIsLogged(true)

        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged, error)
      },
    })
  }

  //Register/delete
  static register(username, password, callback) {
    Online.post({
      url: Online.IP + '/api/auth/register',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      success: (data) => {
        //Update isLogged
        Online.setIsLogged(true)

        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged, error)
      },
    })
  }
  
  static deleteAccount(callback) {
    Online.delete({
      url: Online.IP + '/api/auth/delete',
      success: (data) => {
        //Update isLogged
        Online.setIsLogged(false)

        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged, error)
      },
    })
  }

  //Session
  static login(username, password, callback) {
    Online.post({
      url: Online.IP + '/api/auth/login',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      success: (data) => {
        //Update isLogged
        Online.setIsLogged(true)

        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged, error)
      },
    })
  }

  static logout(callback) {
    Online.post({
      url: Online.IP + '/api/auth/logout',
      success: (data) => {
        //Update isLogged
        Online.setIsLogged(false)

        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback === 'function') callback(Online.isLogged, error)
      },
    })
  }

  static getUsers(callback) {
    Online.get({
      url: Online.IP + '/api/auth/users',
      success: (data) => {
        if (typeof callback === 'function') callback(data)
      },
      error: (error) => {
        if (typeof callback === 'function') callback(undefined, error)
      },
    })
  }
  

  //Chat
  static chatRead(callback, after=0) {
    Online.get({
      url: Online.IP + '/api/chat?after=' + after,
      success: (data) => {
        if (typeof callback === 'function') callback(data)
      },
      error: (error) => {
        if (typeof callback === 'function') callback(undefined, error)
      },
    })
  }

  static chatSend(message, callback) {
    Online.post({
      url: Online.IP + '/api/chat?message=' + message,
      success: (data) => {
        if (typeof callback === 'function') callback(data)
      },
      error: (error) => {
        if (typeof callback === 'function') callback(undefined, error)
      },
    })
  }


  //Lobby
  static checkInLobby(callback) {
    Online.get({
      url: Online.IP + '/api/lobby',
      success: (data) => {
        if (typeof callback === 'function') callback(data)
      },
      error: (error) => {
        if (typeof callback === 'function') callback(undefined, error)
      },
    })
  }

  static createLobby(callback) {
    Online.post({
      url: Online.IP + '/api/lobby/create',
      success: (data) => {
        if (typeof callback === 'function') callback(data)
      },
      error: (error) => {
        if (typeof callback === 'function') callback(undefined, error)
      },
    })
  }
  
  static joinLobby(username, callback) {
    Online.post({
      url: Online.IP + '/api/lobby/join?host=' + username,
      success: (data) => {
        if (typeof callback === 'function') callback(data)
      },
      error: (error) => {
        if (typeof callback === 'function') callback(undefined, error)
      },
    })
  }
  
  static leaveLobby(callback) {
    Online.post({
      url: Online.IP + '/api/lobby/leave',
      success: (data) => {
        if (typeof callback === 'function') callback(data)
      },
      error: (error) => {
        if (typeof callback === 'function') callback(undefined, error)
      },
    })
  }
}
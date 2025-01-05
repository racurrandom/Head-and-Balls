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
    C_READY: 'CR',
    //Game scene
    G: 'G',
    G_INIT: 'GI',
    G_PLAYER: 'GP',
    G_BALL: 'GB',
    G_KICK: 'GK',
    G_ANIMATE: 'GA',
    G_GOAL: 'GG',
    G_VARIANT: 'GV',
    G_RESET: 'GR',
  };

  static reconnectInterval = 1000; //Attemp reconnect every 1 second
  static niceClose = false

  //WebSocket
  static attemptReconnect() {
    if (!Online.socket) {
      setTimeout(() => {
        console.log("Attempting to reconnect...");
        Online.initSocket(Online.onSocketMessage);
      }, Online.reconnectInterval);
    }
  }

  static initSocket(onMessage) {
    //A socket already exists
    if (Online.socket) return

    //Update on message event
    Online.setSocketOnMessage(onMessage)

    //Create WebSocket
    Online.socket = new WebSocket("ws://" + location.host + "/ws")

    //Add events
    Online.socket.onopen = () => {
      //Login with username
      Online.sendSocketMessage(Online.TYPE.C_INIT, Online.username)
      console.log("socket open")
    }

    Online.socket.onerror = (error) => {
      //Log error
      console.error("WebSocket error:", error.message);
      console.error("Details:", error); 
    }

    Online.socket.onclose = () => {
      //Clear socket variable
      Online.socket = undefined
      console.log("closing socket")

      //Attempt reconnect
      if(!this.niceClose)   //Closed on error -> Reconnect
        Online.attemptReconnect(); 
        
      Online.niceClose = false;
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
    if (typeof data === 'object') data = JSON.stringify(data)

    //Socket not open
    if (!Online.socket || Online.socket.readyState !== WebSocket.OPEN) {
      console.error("Socket is not open. Message not sent.");
      return
    }

    //Send message
    if (data)
      Online.socket.send(`${type}${data}`);
    else
      Online.socket.send(type);
  }

  static setSocketOnMessage(onMessage) {
    Online.onSocketMessage = onMessage
  }

  static closeSocket() {
    //No socket exists
    if (!Online.socket) return

    //Update on message event
    Online.setSocketOnMessage(undefined)

    //Close WebSocket
    Online.niceClose = true
    Online.socket.close()
    Online.socket = undefined
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
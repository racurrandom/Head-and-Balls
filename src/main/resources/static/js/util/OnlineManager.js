class OnlineManager {

  static IP = window.location.origin
  static username = ''
  static password = ''
  static isLogged = false
  static notifyInterval = undefined
  

  //Server
  static checkServerOnline(callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/test',
      timeout: 5000,
      type: 'GET',
      success: (data) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(true)
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(false, error)
      },
    })
  }

  //Session
  static setIsLogged(isLogged) {
    //Update isLogged
    OnlineManager.isLogged = isLogged

    //Stop interval
    if (OnlineManager.notifyInterval) clearInterval(OnlineManager.notifyInterval)
    
    //Add a new one if logged
    if (!isLogged) return
    OnlineManager.notifyInterval = setInterval(() => {
      OnlineManager.checkIsLogged((logged, error) => {
        //No error or it isnt a timeout
        if (!error || error.status != 0) return

        //Timeout ocurred
      })
    }, 10000)
  }

  static checkIsLogged(callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth',
      timeout: 5000,
      type: 'GET',
      success: (data) => {
        //Update isLogged
        OnlineManager.setIsLogged(true)
        //Run callback
        if (typeof callback !== 'function') return
        callback(data)
      },
      error: (error) => {
        //Update isLogged
        OnlineManager.setIsLogged(false)
        //Run callback
        if (typeof callback !== 'function') return
        callback(undefined, error)
      },
    })
  }

  //Update account
  static updateAccount(password, callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/update',
      timeout: 5000,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        username: this.username,
        password: password
      }),
      success: (data) => {
        //Update isLogged
        OnlineManager.setIsLogged(true)
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged, error)
      },
    })
  }

  //Register/delete
  static register(username, password, callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/register',
      timeout: 5000,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      success: (data) => {
        //Update isLogged
        OnlineManager.setIsLogged(true)
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged, error)
      },
    })
  }
  
  static deleteAccount(callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/delete',
      timeout: 5000,
      type: 'DELETE',
      success: (data) => {
        //Update isLogged
        OnlineManager.setIsLogged(false)
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged, error)
      },
    })
  }

  //Session
  static login(username, password, callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/login',
      timeout: 5000,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      success: (data) => {
        //Update isLogged
        OnlineManager.setIsLogged(true)
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged, error)
      },
    })
  }

  static logout(callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/logout',
      timeout: 5000,
      type: 'POST',
      success: (data) => {
        //Update isLogged
        OnlineManager.setIsLogged(false)
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged)
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(OnlineManager.isLogged, error)
      },
    })
  }

  static getUsers(callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/users',
      timeout: 5000,
      type: 'GET',
      success: (data) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(data)
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(undefined, error)
      },
    })
  }
  

  //Chat
  static chatRead(callback, after=0) {
    $.ajax({
      url: OnlineManager.IP + '/api/chat?after=' + after,
      timeout: 5000,
      type: 'GET',
      success: (data) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(data)
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(undefined, error)
      },
    })
  }

  static chatSend(message, callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/chat?message=' + message,
      timeout: 5000,
      type: 'POST',
      success: (data) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback()
      },
      error: (error) => {
        //Run callback
        if (typeof callback !== 'function') return
        callback(error)
      },
    })
  }
}
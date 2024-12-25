class OnlineManager {

  static IP = window.location.origin
  static username = ''
  static password = ''
  static isLogged = false
  static notifyInterval = undefined
  

  //Checks
  static checkOnline(callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/test',
      timeout: 5000,
      type: 'GET',
      success: (data) => {
        //Run callback
        callback(true)
      },
      error: (error) => {
        //Run callback
        callback(false, error)
      },
    })
  }

  static checkLogged(callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/check',
      timeout: 5000,
      type: 'GET',
      success: (data) => {
        //Update isLogged
        OnlineManager.setIsLogged(true)
        //Run callback
        callback(data)
      },
      error: (error) => {
        //Update isLogged
        OnlineManager.setIsLogged(false)
        //Run callback
        callback(undefined, error)
      },
    })
  }

  //Notify online
  static setIsLogged(isLogged) {
    //Update isLogged
    OnlineManager.isLogged = isLogged

    //Stop interval
    if (OnlineManager.notifyInterval) clearInterval(OnlineManager.notifyInterval)
    
    //Add a new one if logged
    if (!isLogged) return
    OnlineManager.notifyInterval = setInterval(OnlineManager.notifyOnline, 10000)
  }

  static notifyOnline(callback) {
    $.ajax({
      url: OnlineManager.IP + '/api/auth/notify',
      timeout: 5000,
      type: 'POST',
      success: (data) => {
        //Update isLogged
        OnlineManager.setIsLogged(true)
        //Run callback
        if (typeof callback !== 'function') return
        callback(true)
      },
      error: (error) => {
        //Update isLogged
        OnlineManager.setIsLogged(false)
        //Run callback
        if (typeof callback !== 'function') return
        callback(false, error)
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

  //Loggin/out
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

  //Chat
  static chatRead(onRead, after=0) {
    $.ajax({
      url: OnlineManager.IP + '/api/chat?after=' + after,
      timeout: 5000,
      type: 'GET',
      success: (data) => {
        onRead(data)
      },
      error: (error) => {
        onRead(undefined, error)
      },
    })
  }

  static chatSend(message, onSend) {
    $.ajax({
      url: OnlineManager.IP + '/api/chat?message=' + message,
      timeout: 5000,
      type: 'POST',
      success: (data) => {
        onSend()
      },
      error: (error) => {
        onSend(error)
      },
    })
  }
}
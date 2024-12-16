class OnlineManager {

  static IP = ''

  static init() {
    OnlineManager.IP = localStorage.getItem('ip')
    if (OnlineManager.IP == null) OnlineManager.IP = ''
  }

  static setIP(newIP) {
    OnlineManager.IP = newIP
    localStorage.setItem('ip', OnlineManager.IP)
  }

  static check(onCheck) {
    //No ip
    if (OnlineManager.IP == '') {
      onCheck(false)
      return
    }

    //Create request
    const request = new Request('http://' + OnlineManager.IP + '/api/auth/check', {
      method: 'GET',
      //body: '',
    })

    //Send request
    fetch(request)
      .then((response) => response.blob())
      .then((blob) => {
        onCheck(blob)
      })
      .catch((error) => {
        onCheck(false)
      })
  }
}
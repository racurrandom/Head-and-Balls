class Turbo {
  //Helper class because I hate JS and doing 'this.' before everything is the goofyest thing ever

    /*$$$$$                                 /$$
   /$$__  $$                               | $$
  | $$  \ $$  /$$$$$$$ /$$$$$$$  /$$$$$$  /$$$$$$   /$$$$$$$
  | $$$$$$$$ /$$_____//$$_____/ /$$__  $$|_  $$_/  /$$_____/
  | $$__  $$|  $$$$$$|  $$$$$$ | $$$$$$$$  | $$   |  $$$$$$ 
  | $$  | $$ \____  $$\____  $$| $$_____/  | $$ /$$\____  $$
  | $$  | $$ /$$$$$$$//$$$$$$$/|  $$$$$$$  |  $$$$//$$$$$$$/
  |__/  |__/|_______/|_______/  \_______/   \___/ |______*/

  static loadAudios(scene, audios) {
    /*
    Turbo.loadAudios(this, [
      ['select', 'Assets/select.mp3'],
      ['background', 'Assets/8bit-music.mp3']
    ])
    */

    //Not a valid array
    if (!Array.isArray(audios)) return

    //Loop audios
    audios.forEach(pair => {
      //Not a valid array
      if (!Array.isArray(pair)) return
      if (pair.length < 2) return

      //Not valid key
      const key = pair[0]
      if (typeof key !== 'string') return

      //Not valid path
      const path = pair[1]
      if (typeof path !== 'string') return

      //Load audio
      scene.load.audio(key, path)
    });
  }

  static loadImages(scene, images) {
    /*
    Turbo.loadImages(this, [
      ['start_button', 'Assets/start-button.svg'],
      ['help_button', 'Assets/help-button.svg'],
      ['config_button', 'Assets/config-button.svg']
    ])
    */

    //Not a valid array
    if (!Array.isArray(images)) return

    //Loop images
    images.forEach(pair => {
      //Not a valid array
      if (!Array.isArray(pair)) return
      if (pair.length < 2) return

      //Not valid key
      const key = pair[0]
      if (typeof key !== 'string') return

      //Not valid path
      const path = pair[1]
      if (typeof path !== 'string') return

      //Load audio
      scene.load.image(key, path)
    });
  }


   /*$       /$$             /$$
  | $$      |__/            | $$
  | $$       /$$  /$$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
  | $$      | $$ /$$_____/|_  $$_/   /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$_____/
  | $$      | $$|  $$$$$$   | $$    | $$$$$$$$| $$  \ $$| $$$$$$$$| $$  \__/|  $$$$$$
  | $$      | $$ \____  $$  | $$ /$$| $$_____/| $$  | $$| $$_____/| $$       \____  $$
  | $$$$$$$$| $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$       /$$$$$$$/
  |________/|__/|_______/    \___/   \_______/|__/  |__/ \_______/|__/      |______*/

  static on(scene, name, callback) {
    scene.events.on(name, callback); 
  }

  static once(scene, name, callback) {
    scene.events.once(name, callback); 
  }

  static onShutdown(scene, callback) {
    this.once(scene, 'shutdown', callback)
  }


  
   /*$$$$$                                 /$$
  |_  $$_/                                | $$
    | $$   /$$$$$$$   /$$$$$$  /$$   /$$ /$$$$$$
    | $$  | $$__  $$ /$$__  $$| $$  | $$|_  $$_/
    | $$  | $$  \ $$| $$  \ $$| $$  | $$  | $$
    | $$  | $$  | $$| $$  | $$| $$  | $$  | $$ /$$
   /$$$$$$| $$  | $$| $$$$$$$/|  $$$$$$/  |  $$$$/
  |______/|__/  |__/| $$____/  \______/    \___/
                    | $$
                    | $$
                    |_*/

  static input(scene, name, down, up) {
    scene.input.keyboard.on('keydown-' + name, down);

    scene.input.keyboard.on('keyup-' + name, up);
  }
}
class SceneResults extends Phaser.Scene {
  constructor() {
    super({ key: 'Results' });
  }



   /*$$$$$           /$$   /$$    
  |_  $$_/          |__/  | $$    
    | $$   /$$$$$$$  /$$ /$$$$$$  
    | $$  | $$__  $$| $$|_  $$_/  
    | $$  | $$  \ $$| $$  | $$    
    | $$  | $$  | $$| $$  | $$ /$$
   /$$$$$$| $$  | $$| $$  |  $$$$/
  |______/|__/  |__/|__/   \__*/

  init(data) {
    
  }



   /*$$$$$$                     /$$                           /$$
  | $$__  $$                   | $$                          | $$
  | $$  \ $$ /$$$$$$   /$$$$$$ | $$  /$$$$$$   /$$$$$$   /$$$$$$$
  | $$$$$$$//$$__  $$ /$$__  $$| $$ /$$__  $$ |____  $$ /$$__  $$
  | $$____/| $$  \__/| $$$$$$$$| $$| $$  \ $$  /$$$$$$$| $$  | $$
  | $$     | $$      | $$_____/| $$| $$  | $$ /$$__  $$| $$  | $$
  | $$     | $$      |  $$$$$$$| $$|  $$$$$$/|  $$$$$$$|  $$$$$$$
  |__/     |__/       \_______/|__/ \______/  \_______/ \______*/

  preload() {
    
  }



    /*$$$$$                                  /$$              
   /$$__  $$                                | $$              
  | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$       /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$      | $$  \__/| $$$$$$$$  /$$$$$$$  | $$    | $$$$$$$$
  | $$    $$| $$      | $$_____/ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ |__/       \_______/ \_______/   \___/   \______*/

  create(data) {
    //Get winner string
    const isTie = data.p1.points == data.p2.points
    let winner_s = 'Empate'
    
    //Not a tie
    if (!isTie) winner_s = 'Ganador\n' + (data.p1.points > data.p2.points ? 'Jugador 1' : 'Jugador 2')

    //Winner
    const winner = this.add.text(640, 360, winner_s, {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)
    
    //Player 1
    const player1 = this.add.image(320, 360, 'preview' + data.p1.skin)
    player1.setScale(2, 2)
    const player1points = this.add.text(320, 500, data.p1.points, {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Player 2
    const player2 = this.add.image(960, 360, 'preview' + data.p2.skin)
    player2.setScale(-2, 2)
    const player2points = this.add.text(960, 500, data.p2.points, {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Return to menu
    Scene.onClick(this, () => {
      Scene.changeScene(this, 'Main')
    })
  }


  
   /*$   /$$                 /$$             /$$
  | $$  | $$                | $$            | $$
  | $$  | $$  /$$$$$$   /$$$$$$$  /$$$$$$  /$$$$$$    /$$$$$$ 
  | $$  | $$ /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
  | $$  | $$| $$  \ $$| $$  | $$  /$$$$$$$  | $$    | $$$$$$$$
  | $$  | $$| $$  | $$| $$  | $$ /$$__  $$  | $$ /$$| $$_____/
  |  $$$$$$/| $$$$$$$/|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
   \______/ | $$____/  \_______/ \_______/   \___/   \_______/
            | $$
            | $$
            |_*/
 
  update(time, delta) {
    
  }
}

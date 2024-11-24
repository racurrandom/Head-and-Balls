class SceneOptions extends Phaser.Scene {
  constructor() {
    super({ key: 'Options' });
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

    Scene.loadImages(this, [
      ['ball', 'assets/game/ball.png'],
    ])
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
    //Add background
    const bg = this.add.rectangle(1280 / 2, 720 / 2, 1280 - 60, 720 - 60, 0xeb7434)

    Element.onClick(bg, () => {}) //Prevent clickthrough

    //Add title
    const title = this.add.text(640, 80, 'OPTIONS', {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    //Add volome slider
    const sliderBG = this.add.rectangle(1280/2, 200, 1280 - 800, 20, 0xffffff)
    this.slider = new Slider(this, 'ball', new Vec2(400, 200), new Vec2(1280-400, 200), Settings.volumen)    
    this.volume_t = this.add.text(960, 200, Math.floor(Settings.volumen * 100), {
      fontSize: '48px',
      align: 'center'
    }) .setOrigin(0.5)
    
    //Add resume button
    const resume = this.add.text(640, 360, 'RESUME', {
      fontSize: '64px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5)

    Element.onClick(resume, ()=>{
      this.scene.stop()
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
    Settings.volumen = this.slider.Value();
    this.volume_t.text = Math.floor(Settings.volumen * 100)
  }
}



//Slider
class Slider{

  scene
  position = new Vec2()

  startPoint = new Vec2()

  endPoint = new Vec2()

  value = 0

  image

  down = false;

  constructor(scene, img, startPoint, endPoint, value){
    this.scene = scene 
    this.startPoint = new Vec2(startPoint)
    this.endPoint = new Vec2(endPoint)
    this.value = value
    this.position = this.Interpolate(startPoint, endPoint, value)

    this.image = this.scene.add.image(this.position.x, this.position.y, img)

    this.image.setPosition(this.position.x, this.position.y);

    Element.onClick(this.image, (event)=>{
      this.down = true;
    })

    Element.onUp(this.image, () => {
      this.down = false;
    })

    Element.onOut(this.image, () => {
      this.down = false;
    })

    Element.onMove(this.image, (event) =>{this.Update(event)} )

  }

  Update(event){
    if(this.down){
      this.position.x = event.position.x;
      this.position.y = this.image.y;
      if(this.position.x < this.startPoint.x) this.position.x = this.startPoint.x
      if(this.position.x > this.endPoint.x) this.position.x = this.endPoint.x
      this.value = this.position.subtract(this.startPoint).magnitude() / this.endPoint.subtract(this.startPoint).magnitude() 
      this.image.setPosition(this.position.x, this.position.y);
    }
  }

  Interpolate(p1, p2, value){
    var dir = p2.subtract(p1).normalized()
    return p1.add(dir.multiply(value * p1.subtract(p2).magnitude()))
  }

  Value(){
    return this.value;
  }
}

class Settings{
  static volumen = 1

  
}
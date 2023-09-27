const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./img/fighter.png";
    image.onload = () => {
      const scale = 2;
      this.image = image;
      //set width anbd height
      const { width, height } = this.image;
      //set the player image
      this.width = width * scale;
      this.height = height * scale;
      //set postion for player
      this.position = {
        //initially place player at bottom of screen in center
        x: innerWidth / 2 - this.width / 2,
        y: innerHeight - this.height - 30,
      };

      animate();
    };
  }

  draw() {
    if (this.image) {
      const { width, height } = this;
      const { x, y } = this.position;
      // c.fillStyle = "red";
      // c.fillRect(position.x, position.y, width, height);
      //check if image has loaded, then draw image
      c.drawImage(this.image, x, y, width, height);
    }
  }
}

const player = new Player();
player.draw();

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "#212121";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
}

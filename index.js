const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

//Star class
class Star {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  draw() {
    c.fillStyle = "white"; // You can set the color you want for the star
    // Draw a rectangle centered at (this.x, this.y) with dimensions this.size x this.size
    c.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  update() {
    // Move the star downwards
    this.y += 1;

    // If the star goes below the canvas, reset its position to the top with a random x
    if (this.y > canvas.height + this.size / 2) {
      this.y = -this.size / 2;
      this.x = Math.random() * canvas.width;
    }
  }
}
const star = new Star(100, 100, 4); // x, y, and size

//Player class
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;

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
        y: innerHeight - this.height - 60,
      };
    };
  }

  draw() {
    //if iamge is loaded, draw the player's ship
    if (this.image) {
      // c.fillStyle = "red";
      // c.fillRect(position.x, position.y, width, height);
      //check if image has loaded, then draw image

      //save a "snapshot" of the rotated canvas in order to make the
      //character appear to when moving left and right (there is no
      //other way to do this that I know of)
      c.save();
      c.translate(
        player.position.x + player.width / 2,
        player.position.y + player.height / 2
      );

      c.rotate(this.rotation);

      c.translate(
        -player.position.x - player.width / 2,
        -player.position.y - player.height / 2
      );

      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );

      c.restore();
    }
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

const player = new Player();
const keys = {
  arrowLeft: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "#212121";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // Draw the player after clearing the canvas
  player.update();

  // Draw the star after the player
  star.update();

  // Draw the player after clearing the canvas
  player.draw();

  // Draw the star after the player
  star.draw();

  if (keys.arrowLeft.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.3;
  } else if (
    keys.arrowRight.pressed &&
    player.position.x + player.width <= innerWidth
  ) {
    player.velocity.x = 7;
    player.rotation = 0.3;
  } else player.velocity.x = 0;
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      console.log("left");
      keys.arrowLeft.pressed = true;
      break;
    case "ArrowRight":
      console.log("right");
      keys.arrowRight.pressed = true;
      break;
    case " ":
      console.log("space");
      keys.space.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      player.rotation = 0;
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      player.rotation = 0;
      break;
    case " ":
      keys.space.pressed = false;
      break;
  }
});

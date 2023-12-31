/* Dev log: 

Known issues:
1. Canvas rotation to rotate player also unwantedly moves player on the y axis roughly 10 pixels.

*/

const canvas = document.querySelector("canvas");
const fighterSpriteImg = new Image();
const invaderSpriteImg = new Image();
invaderSpriteImg.src = "./img/invader.png";
fighterSpriteImg.src = "./img/fighter-sprite.png";

// Wait for both images to load before starting the animation
Promise.all([loadImage(invaderSpriteImg), loadImage(fighterSpriteImg)]).then(
  () => {
    startAnimation();
  }
);

function loadImage(image) {
  return new Promise((resolve) => {
    image.onload = resolve;
  });
}

function startAnimation() {
  const c = canvas.getContext("2d");

  canvas.width = innerWidth + 60;
  canvas.height = innerHeight;

  //array of stars
  let starArray = [];

  /* Star class */
  class Star {
    constructor(x, y, size, opacity) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.opacity = opacity;
    }

    draw() {
      //dynamically set star opacity
      c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
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
  /* End of Star class */

  //create star function
  function createStar() {
    // x, y, and size
    let size = Math.floor(Math.random() * 4) + 2;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let opacity = Math.random() * (0.7 - 0.01) + 0.01;

    //Create a new star and push it to the array of stars
    const newStar = new Star(x, y, size, opacity);
    starArray.push(newStar);
  }

  const starCount = 40;

  //create 20 stars
  for (let i = starCount; i >= 0; i--) {
    createStar();
  }

  //define fighter (player sprite) parameters
  const fighterWidth = 32; //width of each animation frame
  const fighterHeight = 32; //height of each animation frame

  const fighterSprite = {
    x: 0, //initial x position
    y: 0, //initial y position
    width: fighterWidth,
    height: fighterHeight,
  };

  let currentFighterFrame = 0;
  const numberOfFighterFrames = 3 * 3; // 3 rows * 3 columns

  /* Player class  */
  class Player {
    constructor() {
      this.velocity = {
        x: 0,
        y: 0,
      };

      this.rotation = 0;

      //set fighter image
      this.image = fighterSpriteImg;
      const scale = 2;
      //set width anbd height
      const { width, height } = this.image;
      //set the player image
      this.width = width * scale;
      this.height = height * scale;
      //set postion for player
      this.position = {
        //initially place player at bottom of screen in center
        x: innerWidth / 2 - this.width / 2,
        y: innerHeight - this.height,
      };
    }

    draw() {
      //if image is loaded, draw the player's ship
      if (this.image) {
        c.save();
        c.translate(
          this.position.x + this.width,
          this.position.y + this.height
        );

        c.rotate(this.rotation);

        // Draw the player sprite
        c.drawImage(
          this.image,
          (currentFighterFrame % 3) * fighterWidth, //calculate column
          Math.floor(currentFighterFrame / 3) * fighterHeight, //calculate fram row
          fighterWidth, // source width
          fighterHeight, //source height
          -this.width, // destination x
          -this.height, // destination y
          fighterWidth * 2, // destination width
          fighterHeight * 2 // destination height
        );

        c.restore();
      }
    }

    update() {
      // Add movement logic
      if (keys.arrowLeft.pressed) {
        this.position.x -= 5; // Adjust val to change speed
        this.rotation = -0.1; // Rotate left
      }
      if (keys.arrowRight.pressed) {
        this.position.x += 5; //Adjust val to change speed
        this.rotation = 0.1; // Rotate left
      }

      // Ensure player stays within canvas bounds
      if (this.position.x < 0) this.position.x = 0;
      if (this.position.x + this.width > canvas.width)
        this.position.x = canvas.width - this.width;

      this.draw();
    }
  }
  /* End of Player class  */

  /* Projectile class */

  class Projectile {
    constructor({ position, velocity }) {
      this.position = position;
      this.velocity = velocity;
      this.radius = 3;
    }
    draw() {
      //following is a set pattern to draw a circle on canvas (to make circular projectile)
      c.beginPath();
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      c.fillStyle = "red";
      c.fill();
      c.closePath();
    }
    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  /* End of Projectile class */

  /* Invader class  */
  class Invader {
    constructor() {
      this.velocity = {
        x: 0,
        y: 0,
      };

      //set invader image
      this.image = invaderSpriteImg;

      const scale = 2;
      //set width anbd height
      const { width, height } = this.image;
      //set the player image
      this.width = width * scale;
      this.height = height * scale;
      //set postion for player
      this.position = {
        //initially place player at bottom of screen in center
        x: innerWidth / 2 - this.width / 2,
        y: innerHeight / 2,
      };
    }

    draw() {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }

    update() {
      if (this.image) {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
    }
  }
  /* End of Invader class  */

  const player = new Player();
  const projectiles = [];
  const invader = new Invader();
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

  // introduce a frame delay counter and set the delay value
  let frameDelayCounter = 0;
  const frameDelayThreshold = 15; // Adjust this value to control the animation speed

  function animate() {
    c.fillStyle = "#212121";
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw each star in the starArray
    starArray.forEach((star) => {
      star.update();
      star.draw();
    });

    // Increment the frame delay counter
    frameDelayCounter++;

    // Check if the frame delay counter reached the threshold
    if (frameDelayCounter >= frameDelayThreshold) {
      // Update the current frame and reset the counter
      currentFighterFrame = (currentFighterFrame + 1) % numberOfFighterFrames;
      frameDelayCounter = 0;
    }

    //update the invader's position
    invader.update();
    // Update the player's position
    player.update();
    // Update/redraw the projectiles position
    projectiles.forEach((projectile, index) => {
      //basically if the projectile is past the top of the viewport, splice it out of the array
      //setTime is just a hack to resolve a rendering flashing issue
      if (projectile.position.y + projectile.radius <= 0) {
        setTimeout(() => {
          projectiles.splice(index, 1);
        }, 0);
      } else {
        projectile.update();
      }
    });

    // Request the next frame
    requestAnimationFrame(animate);
  }

  animate();

  addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "ArrowLeft":
        keys.arrowLeft.pressed = true;
        break;
      case "ArrowRight":
        keys.arrowRight.pressed = true;
        break;
      case " ":
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + fighterWidth,
              y: player.position.y,
            },
            velocity: {
              x: player.velocity.x,
              y: -5,
            },
          })
        );
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
}

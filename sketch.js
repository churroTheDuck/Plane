let corsair;
let oceanGraphics;
var scrollX;
var scrollY;
var tracers = [];
var mil = 0;

function preload() {
  corsair = loadImage("F4U-1D Corsair.png");
  corsairShadow = loadImage("F4U-1D Corsair Shadow.png");
  corsairIcon = loadImage("F4U-1D Corsair Icon.png");
  tracer = loadImage("Tracer.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  angleMode(DEGREES);
  imageMode(CENTER);
  generateOcean();

  scrollX = 0 - width / 2;
  scrollY = 0 - height / 2;
  corsairWidth = corsair.width;
  corsairHeight = corsair.height;
  corsairRatio = corsairHeight / corsairWidth;

  playerShadow = new Sprite();
  playerShadow.x = width / 2 - 10;
  playerShadow.y = height / 2 + 10;
  playerShadow.collider = "none";
  playerShadow.image = corsairShadow;
  playerShadow.image.width = corsairWidth / 500;
  playerShadow.image.height = corsairHeight / 500;
  playerShadow.opacity = 0.1;

  player = new Sprite();
  player.x = width / 2;
  player.y = height / 2;
  player.height = height / 2;
  player.width = corsairWidth / 500;
  player.height = corsairHeight / 500;
  player.image = corsair;
  player.image.width = corsairWidth / 500;
  player.image.height = corsairHeight / 500;
}

function generateOcean() {
  oceanGraphics = createGraphics(2000, 2000);
  oceanGraphics.noStroke();

  let noiseScale = 0.001; // Increase noise scale for faster generation
  let blockSize = 10; // Use larger blocks for faster drawing

  // Generate ocean colors on the graphics buffer
  for (let y = 0; y < 2000; y += blockSize) {
    for (let x = 0; x < 2000; x += blockSize) {
      let waterNoiseValue = noise(x * noiseScale, y * noiseScale);
      // Compute water color based on the noise value
      let r = map(waterNoiseValue, 0, 1, 0, 50); // Darker shades of blue
      let g = map(waterNoiseValue, 0, 1, 50, 150); // Lighter shades of blue
      let b = map(waterNoiseValue, 0, 1, 100, 200); // Even lighter shades of blue
      oceanGraphics.fill(r, g, b);
      oceanGraphics.rect(x, y, blockSize, blockSize); // Draw larger blocks
    }
  }
}

function draw() {
  background(0, 119, 190); // Ocean color
  image(oceanGraphics, 0 - scrollX, 0 - scrollY, 2000, 2000);
  player.rotateMinTo(mouseX, mouseY, 5, 0);
  playerShadow.rotation = player.rotation;
  scrollX += cos(player.rotation) * 5;
  scrollY += sin(player.rotation) * 5;
  for (let i = 0; i < tracers.length; i++) {
    tracers[i].x += cos(tracers[i].direction) * 20;
    tracers[i].y += sin(tracers[i].direction) * 20;
    push();
    translate(tracers[i].x - scrollX, tracers[i].y - scrollY);
    rotate(tracers[i].direction);
    image(tracer, 0, 0, 10, 10 * tracer.height / tracer.width);
    pop();
  }
  push();
  noFill();
  stroke("white");
  strokeWeight(2);
  ellipse(mouseX, mouseY, 10, 10);
  pop();
  image(oceanGraphics, width - 100, 100, 200, 200);
  push();
  translate((player.x + scrollX) * 0.1 + width - 100, (player.y + scrollY) * 0.1 + 80);
  rotate(player.rotation);
  image(corsairIcon, 0, 0, 10, 10 * corsairIcon.height / corsairIcon.width);
  pop();
  if (keyIsPressed && key == " " && millis() >= mil + 80) {
    tracers.push({
      x: player.x + scrollX + cos(player.rotation - 90) * 5,
      y: player.y + scrollY + sin(player.rotation - 90) * 5,
      direction: player.rotation
    });
    tracers.push({
      x: player.x + scrollX + cos(player.rotation - 90) * 6,
      y: player.y + scrollY + sin(player.rotation - 90) * 6,
      direction: player.rotation
    });
    tracers.push({
      x: player.x + scrollX + cos(player.rotation - 90) * 7,
      y: player.y + scrollY + sin(player.rotation - 90) * 7,
      direction: player.rotation
    });
    tracers.push({
      x: player.x + scrollX + cos(player.rotation + 90) * 5,
      y: player.y + scrollY + sin(player.rotation + 90) * 5,
      direction: player.rotation
    })
    tracers.push({
      x: player.x + scrollX + cos(player.rotation + 90) * 6,
      y: player.y + scrollY + sin(player.rotation + 90) * 6,
      direction: player.rotation
    })
    tracers.push({
      x: player.x + scrollX + cos(player.rotation + 90) * 7,
      y: player.y + scrollY + sin(player.rotation + 90) * 7,
      direction: player.rotation
    })
    mil = millis();
  }
}

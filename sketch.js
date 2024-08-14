var corsair;
var oceanGraphics;
var oceanCopy;
var scrollX;
var scrollY;
var soundMil = 0;
var shootMil = 0;
var bots;
var tracers;
var tracersArray = [];
var gameSize = 2000;
var mgAmmo = 400;

function preload() {
  corsair = loadImage("F4U-1D Corsair.png");
  corsairShadow = loadImage("F4U-1D Corsair Shadow.png");
  corsairIcon = loadImage("F4U-1D Corsair Icon.png");
  tracer = loadImage("Tracer.png");
  tree = loadImage("Tree.png");
  bg = loadImage("BG.png");
  m2 = loadSound("M2 Browning Sound.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  angleMode(DEGREES);
  imageMode(CENTER);
  generateOcean();

  scrollX = -width / 2;
  scrollY = -height / 2;
  corsairWidth = corsair.width;
  corsairHeight = corsair.height;
  corsairRatio = corsairHeight / corsairWidth;

  playerShadow = new Sprite();
  playerShadow.x = width / 2 - 10;
  playerShadow.y = height / 2 + 10;
  playerShadow.collider = "none";
  playerShadow.image = corsairShadow;
  playerShadow.image.width = corsairWidth / 200;
  playerShadow.image.height = corsairHeight / 200;
  playerShadow.opacity = 0.1;

  player = new Sprite();
  player.x = width / 2;
  player.y = height / 2;
  player.width = corsairWidth / 200;
  player.height = corsairHeight / 200;
  player.image = corsair;
  player.image.width = corsairWidth / 200;
  player.image.height = corsairHeight / 200;

  bots = new Group();
  bots.x = 100;
  bots.y = 100;
  bots.width = corsairWidth / 200;
  bots.height = corsairHeight / 200;
  bots.image = corsair;
  bots.image.width = corsairWidth / 200;
  bots.image.height = corsairHeight / 200;

  tracers = new Group();
  tracers.x = 0;
  tracers.y = 0;
  tracers.width = 10;
  tracers.height = 10;
  tracers.image = tracer;
  tracers.image.width = tracer.width / 200;
  tracers.image.height = tracer.height / 200;

  while (bots.length < 1) {
		let bot = new bots.Sprite();
	}
}

function generateOcean() {
  let green = 0;
  let trees = [];
  oceanGraphics = createGraphics(gameSize, gameSize);
  oceanGraphics.noStroke();
  oceanGraphics.rectMode(CORNER);
  oceanGraphics.imageMode(CORNER);
  oceanCopy = createGraphics(gameSize, gameSize);
  oceanCopy.noStroke();
  let noiseScale = 0.001; // Increase noise scale for faster generation
  let blockSize = 1; // Use larger blocks for faster drawing

  // Generate ocean colors on the graphics buffer
  for (let y = 0; y < gameSize; y += blockSize) {
    for (let x = 0; x < gameSize; x += blockSize) {
      let waterNoiseValue = noise(x * noiseScale, y * noiseScale);
      
      // Compute water color based on the noise value
      if (waterNoiseValue > 0.65) { // Threshold for light enough water to become yellow
        if (waterNoiseValue > 0.7) {
          oceanGraphics.fill("#2E6930");
          oceanGraphics.rect(x, y, blockSize, blockSize);
          green += 1;
          if (Math.random() > 0.999) {
            trees.push({
              x: x,
              y: y
            });
          }
        } else if (waterNoiseValue > 0.66) {
          oceanGraphics.fill("#F6D7B0");
          oceanGraphics.rect(x, y, blockSize, blockSize);
        } else {
          oceanGraphics.fill("#E1BF92");
          oceanGraphics.rect(x, y, blockSize, blockSize);
        }
      } else {
        let r = map(waterNoiseValue, 0, 1, 0, 50); // Darker shades of blue
        let g = map(waterNoiseValue, 0, 1, 50, 150); // Lighter shades of blue
        let b = map(waterNoiseValue, 0, 1, 100, 200); // Even lighter shades of blue
        oceanGraphics.fill(r, g, b);
        oceanGraphics.rect(x, y, blockSize, blockSize); // Draw larger blocks
      }
      let r = map(waterNoiseValue, 0, 1, 0, 50); // Darker shades of blue
      let g = map(waterNoiseValue, 0, 1, 50, 150); // Lighter shades of blue
      let b = map(waterNoiseValue, 0, 1, 100, 200); // Even lighter shades of blue
      oceanCopy.fill(r, g, b);
      oceanCopy.rect(x, y, blockSize, blockSize); // Draw larger blocks
    }
  }
  for (let i = 0; i < trees.length; i++) {
    oceanGraphics.image(tree, trees[i].x, trees[i].y, 50, 50);
  }
}

function draw() {
  background(161, 44, 64); // Ocean color
  image(oceanGraphics, -scrollX, -scrollY);
  push();
  translate(gameSize - scrollX, -scrollY);
  scale (-1, 1);
  image(oceanCopy, 0, 0);
  pop();
  push();
  translate(-gameSize - scrollX, -scrollY);
  scale (-1, 1);
  image(oceanCopy, 0, 0);
  pop();
  push();
  translate(-scrollX, - gameSize -scrollY);
  scale (1, -1);
  image(oceanCopy, 0, 0);
  pop();
  push();
  translate(-scrollX, gameSize -scrollY);
  scale (1, -1);
  image(oceanCopy, 0, 0);
  pop();
  player.rotateMinTo(mouseX, mouseY, 5, 0);
  playerShadow.rotation = player.rotation;
  scrollX += cos(player.rotation) * 5;
  scrollY += sin(player.rotation) * 5;
  for (let i = 0; i < tracers.length; i++) {
    tracersArray[i].x += cos(tracersArray[i].direction) * 20;
    tracersArray[i].y += sin(tracersArray[i].direction) * 20;
    tracers[i].x = tracersArray[i].x - scrollX;
    tracers[i].y = tracersArray[i].y - scrollY;
    tracers[i].rotation = tracersArray[i].direction;
    if (tracers[i].collides(bots)) {
      print("PEW")
    }
  }
  playerShadow.draw();
  player.draw();
  tracers.draw();
  push();
  noFill();
  stroke("white");
  strokeWeight(2);
  ellipse(mouseX, mouseY, 10, 10);
  pop();
  push();
  noFill();
  stroke(255, 0, 0, 150);
  strokeWeight(4000);
  ellipse(-scrollX, -scrollY, gameSize + 4000, gameSize + 4000);
  pop();
  image(oceanGraphics, width - 100, 100, 200, 200);
  push();
  translate((player.x + scrollX) * 0.1 + width - 100, (player.y + scrollY) * 0.1 + 80);
  rotate(player.rotation);
  image(corsairIcon, 0, 0, 10, 10 * corsairIcon.height / corsairIcon.width);
  pop();
  push();
  fill("white");
  if (Math.round(Math.abs(dist(-scrollX, -scrollY, width / 2, height / 2))) > gameSize / 2) {
    text("Out of bounds", width / 2, height / 2 - 200);
  }
  text("MG", 50, 50);
  text(mgAmmo, 150, 50);
  pop();
  if (keyIsPressed && key == " " && millis() >= soundMil + 80) {
    m2.play();
    mgAmmo -= 6;
    soundMil = millis();
  }
  if (keyIsPressed && key == " " && millis() >= shootMil + 80 * 5) {
    tracersArray.push({
      x: player.x + scrollX + cos(player.rotation - 90) * 4 + cos(player.rotation) * 20,
      y: player.y + scrollY + sin(player.rotation - 90) * 4 + sin(player.rotation) * 20,
      direction: player.rotation
    });
    tracersArray.push({
      x: player.x + scrollX + cos(player.rotation - 90) * 8 + cos(player.rotation) * 20,
      y: player.y + scrollY + sin(player.rotation - 90) * 8 + sin(player.rotation) * 20,
      direction: player.rotation
    });
    tracersArray.push({
      x: player.x + scrollX + cos(player.rotation - 90) * 12 + cos(player.rotation) * 20,
      y: player.y + scrollY + sin(player.rotation - 90) * 12 + sin(player.rotation) * 20,
      direction: player.rotation
    });
    tracersArray.push({
      x: player.x + scrollX + cos(player.rotation + 90) * 12 + cos(player.rotation) * 20,
      y: player.y + scrollY + sin(player.rotation + 90) * 12 + sin(player.rotation) * 20,
      direction: player.rotation
    })
    tracersArray.push({
      x: player.x + scrollX + cos(player.rotation + 90) * 8 + cos(player.rotation) * 20,
      y: player.y + scrollY + sin(player.rotation + 90) * 8 + sin(player.rotation) * 20,
      direction: player.rotation
    })
    tracersArray.push({
      x: player.x + scrollX + cos(player.rotation + 90) * 4 + cos(player.rotation) * 20,
      y: player.y + scrollY + sin(player.rotation + 90) * 4 + sin(player.rotation) * 20,
      direction: player.rotation
    })
    for(let i = 0; i < 6; i++) {
      let tracer = new tracers.Sprite();
    }
    shootMil = millis();
  }
}
let pg; 
let gkcount = 20; 
let undoStack = [];
let redoStack = [];
const maxStates = 25; 

// Palette
let deepBlue, skyBlue, slateBlue, seafoamGreen, mintBG;

function setup() {
  createCanvas(1750, 1000);
  deepBlue     = color(51, 102, 153);
  skyBlue      = color(134, 187, 216);
  slateBlue    = color(47, 72, 88);
  seafoamGreen = color(158, 228, 147);
  mintBG       = color(218, 247, 220);
  
  pg = createGraphics(1750, 1000);
  pg.background(mintBG);
  saveState();
  noCursor();
}

function draw() {
  background(255); 
  if (mouseIsPressed) drawChoice();
  image(pg, 0, 0); 
  drawCustomCursor();
  drawUI();
}

function drawUI() {
  let mode = key || '1';
  push();
  fill(slateBlue);
  noStroke();
  textSize(12);
  let name = (mode === '7') ? "Timmy's Rainbow Pulse" : "Brush " + mode;
  text(`ACTIVE: ${name} | SIZE: ${floor(gkcount)}`, 20, height - 20);
  pop();
}

function drawCustomCursor() {
  push();
  noFill();
  stroke(slateBlue);
  strokeWeight(1);
  ellipse(mouseX, mouseY, gkcount);
  line(mouseX - 5, mouseY, mouseX + 5, mouseY);
  line(mouseX, mouseY - 5, mouseX, mouseY + 5);
  pop();
}

function drawChoice() {
  switch(key) {
    case '1': TL_drawlineFancy(deepBlue, mouseX, mouseY, pmouseX, pmouseY, gkcount); break;
    case '2': TL_scatterBrush(skyBlue, gkcount, mouseX, mouseY); break;
    case '3': TL_flowerBurst(gkcount); break;
    case '4': TL_drawFatLine(seafoamGreen, mouseX, mouseY, pmouseX, pmouseY, gkcount); break;
    case '5': TL_eraser(mintBG, mouseX, mouseY, gkcount); break;
    case '6': TL_randomStrokes(slateBlue, gkcount, mouseX, mouseY); break;
    
    case '7': // Timmy's Rainbow Pulse
      timmyRanBrush(gkcount, mouseX, mouseY, pmouseX, pmouseY);
      // Auto-scaling logic
      if (gkcount > 50) {
        gkcount = 1; 
      } else {
        gkcount += 0.8; // Grow speed
      }
      break;

    default: TL_drawlineFancy(deepBlue, mouseX, mouseY, pmouseX, pmouseY, gkcount); break;
  }
}

// --- Brushes ---

function TL_drawlineFancy(k, lx, ly, px, py, sz) {
  pg.stroke(k);
  pg.strokeWeight(sz * 0.6);
  pg.line(lx + random(-sz*0.1, sz*0.1), ly, px, py);
}

function TL_scatterBrush(k, sz, mx, my) {
  pg.fill(k);
  pg.noStroke();
  for (let i = 0; i < 3; i++) {
    let a = random(TWO_PI), d = random(sz/2);
    pg.ellipse(mx + cos(a)*d, my + sin(a)*d, sz/4, sz/4);
  }
}

function TL_flowerBurst(sz) {
  pg.noStroke();
  for (let i = 0; i < 8; i++) {
    pg.fill(random(100,255), random(100,255), random(100,255), 180);
    let a = TWO_PI / 8 * i;
    let px = mouseX + cos(a) * sz;
    let py = mouseY + sin(a) * sz;
    pg.ellipse(px, py, sz*0.5, sz*0.8);
  }
  pg.fill(255, 255, 0, 200);
  pg.ellipse(mouseX, mouseY, sz*0.5, sz*0.5);
}

function TL_drawFatLine(k, lx, ly, px, py, sz) {
  pg.strokeWeight(sz); pg.stroke(k); pg.line(lx, ly, px, py);
}

function TL_eraser(k, lx, ly, sz) {
  pg.fill(k); pg.noStroke(); pg.ellipse(lx, ly, sz, sz);
}

function TL_randomStrokes(k, sz, mx, my) {
  pg.stroke(red(k), green(k), blue(k), 180); 
  for (let i = 0; i < 5; i++) {
    let a1 = random(TWO_PI), d1 = random(sz/2), a2 = random(TWO_PI), d2 = random(sz/2);
    pg.strokeWeight(random(1, sz*0.1)); 
    pg.line(mx + cos(a1)*d1, my + sin(a1)*d1, mx + cos(a2)*d2, my + sin(a2)*d2);
  }
}

function timmyRanBrush(sz, mx, my, px, py) {
  let amt = map(sz, 1, 50, 0, 1);
  let dynamicColor = lerpColor(deepBlue, seafoamGreen, amt);
  
  pg.stroke(dynamicColor);
  pg.strokeWeight(sz * 0.4);
  pg.line(mx, my, px, py);
  
  pg.stroke(slateBlue);
  pg.strokeWeight(1);
  pg.line(mx + random(-sz, sz), my + random(-sz, sz), px, py);
}

// --- System ---
function mouseReleased() { saveState(); }
function saveState() {
  undoStack.push(pg.get());
  redoStack = [];
  if (undoStack.length > maxStates) undoStack.shift();
}
function keyPressed() {
  let k = key.toLowerCase();
  if (k === 'z') undo();
  if (k === 'y') redo();
  if (k === 'x') { pg.background(mintBG); saveState(); }
  if (k === 'p') pg.save('timmy_art.png');
}
function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    pg.image(undoStack[undoStack.length - 1], 0, 0);
  }
}
function redo() {
  if (redoStack.length > 0) {
    let n = redoStack.pop(); undoStack.push(n); pg.image(n, 0, 0);
  }
}
function mouseWheel(event) {
  gkcount += event.delta * -0.05;
  gkcount = constrain(gkcount, 5, 250);
}
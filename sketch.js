let img;
let printedLayer;

// Regler
let nozzleCount = 40;
let nozzleSpacing = 2;
let jitterStrength = 0.4;

function preload() {
  img = loadImage("assets/MHD-2.png"); // Pfad anpassen
}

function setup() {
  const container = document.getElementById("canvas-container");
  let w = container.offsetWidth;
  let h = container.offsetHeight;

  let canvas = createCanvas(w, h);
  canvas.parent("canvas-container");

  printedLayer = createGraphics(width, height);
  printedLayer.clear();

  setupSliders();
  setupResetButton();
}

function draw() {
  background(255);
  image(printedLayer, 0, 0);

  // Inkjet-Druck nur bei Mausbewegung
  if (mouseIsPressed && mouseX >= 0 && mouseX <= width &&
      mouseY >= 0 && mouseY <= height) {
    drawInkjetStreifen(pmouseX, pmouseY, mouseX, mouseY);
  }
}

// --- Druck: Bild wird Stück für Stück horizontal gedruckt ---
function drawInkjetStreifen(px, py, x, y) {
  let dx = x - px;
  let dy = y - py;
  let steps = max(abs(dx), abs(dy), 1);

  for (let s = 0; s <= steps; s++) {
    let sx = px + (dx * s) / steps;
    let sy = py + (dy * s) / steps;

    // Berechne den relativen x-Wert ins Bild
    let imgXStart = map(sx, 0, width, 0, img.width - 1);

    let stripWidth = 5; // kleine horizontale Streifen
    stripWidth = min(stripWidth, img.width - imgXStart); // Rand sichern

    for (let i = 0; i < nozzleCount; i++) {
      let yOffset = (i - nozzleCount / 2) * nozzleSpacing;

      let jitterX = random(-jitterStrength * 5, jitterStrength * 5);
      let jitterY = random(-jitterStrength * 5, jitterStrength * 5);

      let imgY = int(map(i, 0, nozzleCount, 0, img.height - 1));
      let stripHeight = img.height / nozzleCount;

      printedLayer.image(
        img,
        sx + jitterX, // Zielposition X
        sy + yOffset + jitterY, // Zielposition Y
        stripWidth,  // Zielbreite
        stripHeight, // Zielhöhe
        imgXStart,   // Quell-X im Bild
        imgY,        // Quell-Y im Bild
        stripWidth,  // Quellbreite
        stripHeight  // Quellhöhe
      );
    }
  }
}



// --- Regler ---
function setupSliders() {
  const nozzleCountSlider = document.getElementById("nozzleCountSlider");
  const nozzleSpacingSlider = document.getElementById("nozzleSpacingSlider");
  const jitterStrengthSlider = document.getElementById("jitterStrengthSlider");

  const nozzleCountValue = document.getElementById("nozzleCountValue");
  const nozzleSpacingValue = document.getElementById("nozzleSpacingValue");
  const jitterStrengthValue = document.getElementById("jitterStrengthValue");

  nozzleCountSlider.addEventListener("input", () => {
    nozzleCount = int(nozzleCountSlider.value);
    nozzleCountValue.textContent = nozzleCount;
  });

  nozzleSpacingSlider.addEventListener("input", () => {
    nozzleSpacing = float(nozzleSpacingSlider.value);
    nozzleSpacingValue.textContent = nozzleSpacing;
  });

  jitterStrengthSlider.addEventListener("input", () => {
    jitterStrength = float(jitterStrengthSlider.value);
    jitterStrengthValue.textContent = jitterStrength;
  });
}

// --- Reset Button ---
function setupResetButton() {
  const resetBtn = document.getElementById("resetButton");
  resetBtn.addEventListener("click", () => {
    printedLayer.clear();
  });

   // Export Button
  const exportBtn = document.getElementById("exportButton");
  exportBtn.addEventListener("click", () => {
    saveCanvas(printedLayer, "druckergebnis", "png");
  });
}

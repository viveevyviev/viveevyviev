let mainImg; // The main image in the center
let pixelateMainImg = true; // Flag for the main image's state
let mainImgPixelSize = 10;
let mainImgDisplayWidth;
let mainImgDisplayHeight;

// OPTIMIZATION: Create a pixelated version of the image once for smaller random images
let pixelatedMainImgSmall;

const NUM_RANDOM_IMAGES_ON_HOVER = 5; // How many random images to draw each frame while hovering

let customFont; // Variable to hold our custom font (HP001_Kieu2 2.ttf)
let neueHaasFont; // Variable to hold the new custom font (NeueHaasDisplayRoman.ttf)

// Marquee text variables
let marquee1X = 0;
let marquee2X;
const MARQUEE_SPEED = 1.5; // Adjust speed as needed
let marqueeTextSize = 20; // Shared size for marquee text
let TextSize = 20; // Size for "Touch me, please..."
const MARQUEE_TEXT_TOP_PADDING = 20; // Distance from top edge
const MARQUEE_TEXT_BOTTOM_PADDING = 20; // Distance from bottom edge

// New text content for the marquees
const TOP_MARQUEE_CONTENT = "FLORIST/ DRAG KING/ GRAPHIC DESIGNER/ POET/ LEZBIEN";
const TOP_BLINKING_WORD = "GRAPHIC DESIGNER"; // The word to make blink and underline
const BOTTOM_MARQUEE_CONTENT = "YEN VEE/ VY DINH/ YEN-VI DINH/ VIVEEVYVIEV/ VIE YEN";
const BOTTOM_BLINKING_WORD = "YEN-VI DINH"; // The word to make blink and underline

// Blinking effect variables
let blinkState = true;
let lastBlinkTime = 0;
const BLINK_INTERVAL = 500; // Milliseconds to toggle blink (slow blink)

function preload() {
  mainImg = loadImage('ID nghiem tuc 4.6.png'); // Your main image
  customFont = loadFont('HP001_Kieu2 2.ttf'); // Load your custom font
  neueHaasFont = loadFont('NeueHaasDisplayRoman.ttf'); // Load the new font
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Ensure body and html are set to full width/height for canvas to fill
  document.querySelector('body').style.margin = '0';
  document.querySelector('body').style.padding = '0';
  document.querySelector('body').style.height = '100%';
  document.querySelector('body').style.width = '100%';
  document.querySelector('html').style.height = '100%';
  document.querySelector('html').style.width = '100%';

  updateImageDisplayAndPixelation();

  textAlign(CENTER, TOP); // Default alignment for "Touch me, please..."
  // textSize for marquees is set within drawCustomMarquee, and for "Touch me, please..." below

  // Initialize marquee2X to start off-screen to the right
  marquee2X = width;
}

function draw() {
  background(255); // White background

  // Display loading message if image or pixelated version isn't ready
  if (!mainImg || !mainImg.width || !mainImg.height || !pixelatedMainImgSmall) {
    fill(0);
    textAlign(CENTER, CENTER);
    text("Loading...", width / 2, height / 2);
    return;
  }

  // Calculate position for the main image to be centered
  let mainImgX = (width - mainImgDisplayWidth) / 2;
  let mainImgY = (height - mainImgDisplayHeight) / 2;

  // Check if mouse is over the main image
  let mouseOverMainImg = mouseX > mainImgX && mouseX < mainImgX + mainImgDisplayWidth &&
                         mouseY > mainImgY && mouseY < mainImgY + mainImgDisplayHeight;

  if (mouseOverMainImg) {
    pixelateMainImg = false; // Unpixelate main image on hover

    // Draw random smaller images around the screen
    for (let k = 0; k < NUM_RANDOM_IMAGES_ON_HOVER; k++) {
        let newImgX = random(0, width);
        let newImgY = random(0, height);

        // Calculate a random scale relative to the main image's display size
        let maxRandomScale = 0.5 * (mainImgDisplayWidth / mainImg.width);
        let minRandomScale = 0.1 * (mainImgDisplayWidth / mainImg.width);

        let newImgScale = random(minRandomScale, maxRandomScale);
        let newImgIsPixelated = random() > 0.5; // Randomly choose pixelated or not

        let rImgW = mainImg.width * newImgScale;
        let rImgH = mainImg.height * newImgScale;

        // Draw the small random image
        if (pixelatedMainImgSmall.width > 0 && pixelatedMainImgSmall.height > 0) {
            if (newImgIsPixelated) {
                // Draw the pre-pixelated small version
                image(pixelatedMainImgSmall, newImgX, newImgY, rImgW, rImgH);
            } else {
                // Draw a scaled-down non-pixelated version of the main image
                image(mainImg, newImgX, newImgY, rImgW, rImgH);
            }
        }
    }

    // Handle blinking state for the blinking words
    if (millis() - lastBlinkTime > BLINK_INTERVAL) {
      blinkState = !blinkState;
      lastBlinkTime = millis();
    }

    // Draw top marquee (left-aligned)
    drawCustomMarquee(TOP_MARQUEE_CONTENT, TOP_BLINKING_WORD, marquee1X, MARQUEE_TEXT_TOP_PADDING, neueHaasFont, 'left');
    // Draw bottom marquee (right-aligned)
    drawCustomMarquee(BOTTOM_MARQUEE_CONTENT, BOTTOM_BLINKING_WORD, marquee2X, height - MARQUEE_TEXT_BOTTOM_PADDING - marqueeTextSize, neueHaasFont, 'right');

    // Update marquee positions
    // Calculate full width for top marquee (repeated content) for wrap-around
    let fullTopMarqueeContentForWidth = TOP_MARQUEE_CONTENT + " / " + TOP_MARQUEE_CONTENT + " / " + TOP_MARQUEE_CONTENT;
    textFont(neueHaasFont); // Use the correct font for textWidth calculation
    textSize(marqueeTextSize);
    let fullTopMarqueeContentWidth = textWidth(fullTopMarqueeContentForWidth);

    marquee1X += MARQUEE_SPEED;
    if (marquee1X > width) { // If it scrolls entirely off-screen to the right
        marquee1X = -fullTopMarqueeContentWidth + (marquee1X - width); // Reset to left, accounting for overshoot
    }

    // Calculate full width for bottom marquee (repeated content) for wrap-around
    let fullBottomMarqueeContentForWidth = BOTTOM_MARQUEE_CONTENT + " / " + BOTTOM_MARQUEE_CONTENT + " / " + BOTTOM_MARQUEE_CONTENT;
    let fullBottomMarqueeContentWidth = textWidth(fullBottomMarqueeContentForWidth);

    marquee2X -= MARQUEE_SPEED;
    if (marquee2X < -fullBottomMarqueeContentWidth) { // If it scrolls entirely off-screen to the left
        marquee2X = width + (marquee2X + fullBottomMarqueeContentWidth); // Reset to right, accounting for overshoot
    }

  } else {
    // If not hovering, pixelate main image and reset marquee positions
    pixelateMainImg = true;
    marquee1X = 0;
    marquee2X = width;
  }

  // Draw the main image (pixelated or not)
  if (pixelateMainImg) {
    if (mainImg.width > 0 && mainImg.height > 0) {
        // Create a temporary graphics buffer to pixelate the image accurately
        let graphics = createGraphics(mainImgDisplayWidth, mainImgDisplayHeight);
        graphics.image(mainImg, 0, 0, mainImgDisplayWidth, mainImgDisplayHeight);

        // Draw pixelated image by sampling colors from the buffer
        for (let i = 0; i < graphics.width; i += mainImgPixelSize) {
          for (let j = 0; j < graphics.height; j += mainImgPixelSize) {
            let c = graphics.get(i, j);
            fill(c);
            noStroke();
            rect(mainImgX + i, mainImgY + j, mainImgPixelSize, mainImgPixelSize);
          }
        }
        graphics.remove(); // Dispose of the temporary buffer
    }
  } else {
    // Draw the non-pixelated main image
    if (mainImg.width > 0 && mainImg.height > 0) {
        image(mainImg, mainImgX, mainImgY, mainImgDisplayWidth, mainImgDisplayHeight);
    }
  }

  // "Touch me, please..." text below the main image
  let textContent = "Touch me, please...";
  // Position it just below the main image
  let textY = mainImgY + mainImgDisplayHeight + 10; // Added some vertical padding

  textFont(customFont); // Use the custom font
  textSize(TextSize);
  textAlign(CENTER, TOP); // Center align for this text

  let glowColor = color('#ff0000'); // Red glow color
  // Draw glow layers for "Touch me, please..."
  for (let i = 0; i < 10; i++) {
      glowColor.setAlpha(map(i, 0, 9, 10, 80)); // Fading alpha
      fill(glowColor);
      // Apply slight random jitter for glow effect
      text(textContent, width / 2 + random(-i * 0.2, i * 0.2), textY + random(-i * 0.2, i * 0.2));
  }

  // Draw main "Touch me, please..." text
  fill('#ff00a2'); // Bright pink
  text(textContent, width / 2, textY);
}

// Custom helper function for marquees with blinking and underlining
function drawCustomMarquee(txt, blinkingWord, xPos, yPos, font, alignment) {
  textFont(font);
  textSize(marqueeTextSize);

  // Repeat content multiple times to ensure continuous marquee effect
  const REPETITION_COUNT = 3; // How many times to repeat the base text
  let fullText = txt;
  for(let i = 0; i < REPETITION_COUNT - 1; i++) {
      fullText += " / " + txt;
  }

  // Default to LEFT for accurate textWidth measurements
  textAlign(LEFT, TOP);

  let segments = fullText.split(blinkingWord); // Split by the blinking word

  let currentX = xPos;
  let glowColor = color('#ff0000'); // Red glow for underline glow
  let mainColor = color('#ff00a2'); // Bright pink main color for underline

  const UNDERLINE_OFFSET = 5; // Pixels below text baseline for underline
  const UNDERLINE_THICKNESS = 2; // Thickness of the underline

  push(); // Isolate text alignment changes

  if (alignment === 'right') {
    // For right-aligned marquee, we build a list of all pieces
    let piecesToDraw = [];
    for (let i = 0; i < segments.length; i++) {
        if (segments[i].length > 0) { // Only add non-empty segments
            piecesToDraw.push(segments[i]);
        }
        if (i < segments.length - 1) { // Add blinking word between segments
            piecesToDraw.push(blinkingWord);
        }
    }

    // Calculate the total width of all pieces to draw
    let totalPiecesWidth = 0;
    for(let piece of piecesToDraw) {
        totalPiecesWidth += textWidth(piece);
    }

    // Adjust currentX so the entire block of text starts at the correct position
    // and ends at xPos (which is the rightmost point of the marquee)
    currentX = xPos - totalPiecesWidth;

    // Iterate and draw each piece from left to right
    for (let i = 0; i < piecesToDraw.length; i++) {
      let piece = piecesToDraw[i];
      let pieceWidth = textWidth(piece);

      // Check if the current piece is the blinking word
      if (piece === blinkingWord) {
        // ONLY draw the blinking word and its underline if blinkState is true
        if (blinkState) {
          // Draw glow layers for the blinking word
          for (let j = 0; j < 10; j++) {
            glowColor.setAlpha(map(j, 0, 9, 10, 80));
            fill(glowColor);
            text(piece, currentX + random(-j * 0.2, j * 0.2), yPos + random(-j * 0.2, j * 0.2));
          }
          // Draw main text for the blinking word
          fill(mainColor);
          text(piece, currentX, yPos);

          // Underline effect (with glow) for blinking word
          for (let j = 0; j < 10; j++) { // Glow layers for underline
            glowColor.setAlpha(map(j, 0, 9, 10, 80));
            stroke(glowColor);
            strokeWeight(UNDERLINE_THICKNESS);
            let underlineY = yPos + marqueeTextSize + UNDERLINE_OFFSET + random(-j * 0.2, j * 0.2); // Jitter
            line(currentX + random(-j * 0.2, j * 0.2), underlineY, currentX + pieceWidth + random(-j * 0.2, j * 0.2), underlineY);
          }
          stroke(mainColor); // Main underline
          strokeWeight(UNDERLINE_THICKNESS);
          let underlineY = yPos + marqueeTextSize + UNDERLINE_OFFSET;
          line(currentX, underlineY, currentX + pieceWidth, underlineY);
          noStroke();
        }
        // If blinkState is false, nothing is drawn for this piece, making it blink
      } else {
        // For non-blinking words, draw unconditionally
        // Draw glow layers first
        for (let j = 0; j < 10; j++) {
          glowColor.setAlpha(map(j, 0, 9, 10, 80));
          fill(glowColor);
          text(piece, currentX + random(-j * 0.2, j * 0.2), yPos + random(-j * 0.2, j * 0.2));
        }
        // Draw main text
        fill(mainColor);
        text(piece, currentX, yPos);
      }
      currentX += pieceWidth; // Always advance currentX by pieceWidth, even if blinking word is not drawn
    }

  } else { // Left alignment (existing and working logic)
    for (let i = 0; i < segments.length; i++) {
      // Draw segment before blinking word (non-blinking parts)
      // Draw glow layers first
      for (let j = 0; j < 10; j++) {
        glowColor.setAlpha(map(j, 0, 9, 10, 80));
        fill(glowColor);
        text(segments[i], currentX + random(-j * 0.2, j * 0.2), yPos + random(-j * 0.2, j * 0.2));
      }
      fill(mainColor);
      text(segments[i], currentX, yPos);
      currentX += textWidth(segments[i]);

      // If not the last segment, check if it's the blinking word
      if (i < segments.length - 1) {
        if (blinkState) { // Only draw if blinkState is true
          // Glow for blinking word
          for (let j = 0; j < 10; j++) {
            glowColor.setAlpha(map(j, 0, 9, 10, 80));
            fill(glowColor);
            text(blinkingWord, currentX + random(-j * 0.2, j * 0.2), yPos + random(-j * 0.2, j * 0.2));
          }
          fill(mainColor);
          text(blinkingWord, currentX, yPos);

          // Underline effect (with glow)
          for (let j = 0; j < 10; j++) { // Glow layers for underline
            glowColor.setAlpha(map(j, 0, 9, 10, 80));
            stroke(glowColor);
            strokeWeight(UNDERLINE_THICKNESS);
            let underlineY = yPos + marqueeTextSize + UNDERLINE_OFFSET + random(-j * 0.2, j * 0.2);
            line(currentX + random(-j * 0.2, j * 0.2), underlineY, currentX + textWidth(blinkingWord) + random(-j * 0.2, j * 0.2), underlineY);
          }
          stroke(mainColor); // Main underline
          strokeWeight(UNDERLINE_THICKNESS);
          let underlineY = yPos + marqueeTextSize + UNDERLINE_OFFSET;
          line(currentX, underlineY, currentX + textWidth(blinkingWord), underlineY);
          noStroke();
        }
        currentX += textWidth(blinkingWord); // Always advance currentX, even if blinking word is not drawn
      }
    }
  }
  pop(); // Restore previous text alignment
  textAlign(CENTER, TOP); // Ensure alignment is reset for other texts
}


function updateImageDisplayAndPixelation() {
  if (mainImg && mainImg.width > 0 && mainImg.height > 0) {
      // Calculate display size for the main image to fit within 50% of the canvas
      let scaleFactor = 0.5;
      let canvasAspectRatio = width / height;
      let imgAspectRatio = mainImg.width / mainImg.height;

      if (canvasAspectRatio > imgAspectRatio) {
          // Canvas is wider relative to its height than the image; fit by height
          mainImgDisplayHeight = height * scaleFactor;
          mainImgDisplayWidth = mainImgDisplayHeight * imgAspectRatio;
      } else {
          // Image is wider relative to its height than the canvas; fit by width
          mainImgDisplayWidth = width * scaleFactor;
          mainImgDisplayHeight = mainImgDisplayWidth / imgAspectRatio;
      }

      // Create a small pixelated version of the main image once for efficiency
      // This is used for the random images drawn on hover
      let pixelatedSmallWidth = min(mainImg.width / 4, 100); // Max 100px for small version
      let pixelatedSmallHeight = pixelatedSmallWidth * (mainImg.height / mainImg.width);

      if (pixelatedSmallWidth <= 0) pixelatedSmallWidth = 10; // Fallback for tiny images
      if (pixelatedSmallHeight <= 0) pixelatedSmallHeight = 10;

      pixelatedMainImgSmall = createGraphics(pixelatedSmallWidth, pixelatedSmallHeight);
      pixelatedMainImgSmall.image(mainImg, 0, 0, pixelatedSmallWidth, pixelatedSmallHeight);

      // Apply pixelation to the small version
      let tempPixelSize = 5; // Pixel block size for the small pixelated image
      let tempGraphics = createGraphics(pixelatedMainImgSmall.width, pixelatedMainImgSmall.height);
      tempGraphics.image(pixelatedMainImgSmall, 0, 0); // Copy original small image to temp

      pixelatedMainImgSmall.clear(); // Clear the original small graphics to redraw pixelated
      for (let i = 0; i < tempGraphics.width; i += tempPixelSize) {
        for (let j = 0; j < tempGraphics.height; j += tempPixelSize) {
          let c = tempGraphics.get(i, j); // Get color of a pixel block
          pixelatedMainImgSmall.fill(c);
          pixelatedMainImgSmall.noStroke();
          pixelatedMainImgSmall.rect(i, j, tempPixelSize, tempPixelSize); // Draw pixel block
        }
      }
      tempGraphics.remove(); // Dispose of temporary buffer
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateImageDisplayAndPixelation(); // Recalculate image sizes on resize

  // Reset marquee positions on resize
  marquee1X = 0;
  marquee2X = width;
}
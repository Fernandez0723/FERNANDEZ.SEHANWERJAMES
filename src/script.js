let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const updatePosition = (x, y) => {
      this.mouseX = x;
      this.mouseY = y;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse support
    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) updatePosition(e.clientX, e.clientY);

      if (this.rotating) {
        this.updateRotation(e.clientX, e.clientY);
      }
    });

    paper.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;
      if (e.button === 0) {
        this.mouseTouchX = e.clientX;
        this.mouseTouchY = e.clientY;
        this.prevMouseX = this.mouseX = e.clientX;
        this.prevMouseY = this.mouseY = e.clientY;
      }

      if (e.button === 2) this.rotating = true;
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Touch support
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;

      const touch = e.touches[0];
      this.mouseTouchX = touch.clientX;
      this.mouseTouchY = touch.clientY;
      this.prevMouseX = this.mouseX = touch.clientX;
      this.prevMouseY = this.mouseY = touch.clientY;
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper) return;

      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    });

    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Disable context menu on right-click
    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  updateRotation(x, y) {
    const dirX = x - this.mouseTouchX;
    const dirY = y - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);

    if (dirLength === 0) return;

    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (180 * angle) / Math.PI;
    this.rotation = (360 + Math.round(degrees)) % 360;
  }
}

// Initialize
document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

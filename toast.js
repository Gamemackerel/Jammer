var toastTimer;
function ToastMessage(message, x, y, duration) {
    this.message = message;
    this.isActive = false;

    this.drawToast = function() {
      fill(30, 30, 30, 220);
      stroke(100);
      rect(x - (this.message.length * FONTSIZE / 2), y - FONTSIZE, this.message.length * FONTSIZE, FONTSIZE * 2, 20);

      stroke(230);
      fill(230);
      strokeWeight(1);
      textSize(FONTSIZE)
      text(this.message, x, y);
    }

    this.start = function() {
        this.isActive = true;
        f = this
        toastTimer = window.setTimeout(function(){ f.end() }, duration);
    }

    this.end = function() {
        this.isActive = false;
    }
}

function toaster(toast) {
  if(toast && toast.isActive) {
    toast.drawToast()
  }
}
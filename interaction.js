function mousePressed() {
  if (isFreePlay) {
    freePlayMouseEvent();
  } else if (isRuleMaker) {
    ruleMakerMouseEvent();
  } else {
    seedMakerMouseEvent();  
  }
  return false;
}

// When user clicks on tile, play its associated note
function freePlaymouseEvent() {
  let gridIndex = gridView.getCR(mouseX, mouseY);
    if (grid.isInBounds(gridIndex[0], gridIndex[1])) {
      grid.setState(gridIndex[0], gridIndex[1], 1);
    }

    if (grid.getState(gridIndex[0], gridIndex[1]) == 1) {
      notes.playNote(gridIndex[0], gridIndex[1]);
      setTimeout(() => grid.setState(gridIndex[0], gridIndex[1], 1), 200)
    }
}

// When user clicks on tile, toggle its state and play its associated note
function seedMakerMouseEvent() {
  let gridIndex = gridView.getCR(mouseX, mouseY);
    if (grid.isInBounds(gridIndex[0], gridIndex[1])) {
      let newState = grid.getState(gridIndex[0], gridIndex[1]) ? 0 : 1;
      grid.setState(gridIndex[0], gridIndex[1], newState);
    }

    if (grid.getState(gridIndex[0], gridIndex[1]) == 1) {
      notes.playNote(gridIndex[0], gridIndex[1]);
    }
}

// When user clicks on tile in rule definer, toggle tile state
function ruleMakerMouseEvent() {
  let gridIndex = ruleGridView.getCR(mouseX, mouseY);
    if (ruleGrid.isInBounds(gridIndex[0], gridIndex[1])) {
      let newState = ruleGrid.getState(gridIndex[0], gridIndex[1]) ? 0 : 1;
      ruleGrid.setState(gridIndex[0], gridIndex[1], newState);
    }
}

function keyPressed() {
  switch(keyCode) {
    case 32: // space
      if (!isRuleMaker) {
        if (isPaused) {
          unpause();
        } else {
          pause();
        }
      }
        break;
    case 82: // r
      if (isPaused) {
        startRuleGui();
      }
      break;
    case 80:
      if (isFreePlay) {
        isFreePlay = false;
      } else if (isPaused && !isFreePlay) {
        startFreePlay();
      }
      break;
    case 27: //esc
      if (isRuleMaker) {
        isRuleMaker = false;
      }
      break;
    case 13: //enter
      if (isRuleMaker) {
        saveRule();
        defaultToast = new ToastMessage("Saved", WIDTH / 2, HEIGHT / 2, 300);
        defaultToast.start();
        startRuleGui();
      }
      break;
  }
  return 0;
}


function NoteMap(note_grid) {

  this.note_grid = note_grid;

  // play a single key on the keyboard using the MUSIC GRID
  this.playNote = function(column, row) {
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0,this.note_grid[column][row], 70, 0,);
    MIDI.noteOff(0,this.note_grid[column][row], 0.2);
  }

  // play all the notes with state 1 on the given hexgrid as a chord
  this.playNotes = function(grid) {
    let notes = [];
    for (let column = 0; column < grid.columns; column++) {
      for (let row = 0; row < grid.rows; row++) {
        if (grid.getState(column, row) == 1) {
          notes.push(this.note_grid[column][row]);
        }
      }
    }
    MIDI.setVolume(0, 127);
    MIDI.chordOn(0, notes, 70, 0);
    MIDI.chordOff(0, notes, 0.2);
  }
}

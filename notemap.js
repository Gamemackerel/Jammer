
function NoteMap(max_note) {

  this.note_grid = harmonicTableMidiLayout(max_note)

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
      for (let row = 0; row < grid.rows(column); row++) {
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

// Generate a Jammer keyboard grid with the harmonic table layout
function harmonicTableMidiLayout(max_note) {
  let first_column_first_row_midi = max_note - 4;
  let second_column_first_row_midi = max_note; //119
  let grid = [];
  for (let column = 0; column < 14; column++) {
    grid[column] = [];
    let midi_column_start;
    if (!(column % 2)) {
      midi_column_start = first_column_first_row_midi - Math.floor(column/2);
    } else {
      midi_column_start = second_column_first_row_midi - Math.floor(column/2);
    }
    for (let row = 0; row < 8; row++) {
      grid[column][row] = midi_column_start - 7 * row;
    }
  }
  return grid;
}
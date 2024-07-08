import mido
import json

# Function to convert MIDI note number to note name and octave
def note_number_to_name(note_number):
    note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    octave = (note_number // 12) - 1
    note_name = note_names[note_number % 12]
    return note_name, octave

# Function to calculate the duration of one pulse in seconds
def calculate_pulse_duration(bpm, ppqn):
    return 60 / (bpm * ppqn)

# Load a MIDI file
midi_file = mido.MidiFile('./canon-3.mid')

# Extract PPQN from the MIDI file
ppqn = midi_file.ticks_per_beat

# Assuming a default tempo (120 BPM) if not specified in the file
microseconds_per_beat = 500000  # Corresponds to 120 BPM
bpm = 60000000 / microseconds_per_beat

# Extracting the actual tempo from the MIDI file, if specified
for track in midi_file.tracks:
    for msg in track:
        if msg.type == 'set_tempo':
            microseconds_per_beat = msg.tempo
            bpm = 60000000 / microseconds_per_beat
            break

# Calculate the duration of one pulse in seconds
pulse_duration = calculate_pulse_duration(bpm, ppqn)

midi_data = {'tracks': [], 'ppqn': ppqn, 'bpm': bpm, 'pulse_duration': pulse_duration}

# Iterate through MIDI tracks and extract note information
for i, track in enumerate(midi_file.tracks):
    track_data = {'name': track.name if track.name else f'Track {i + 1}', 'notes': []}
    current_time = 0  # This will be in ticks
    note_start_times = {}
    for msg in track:
        current_time += msg.time  # Accumulate delta-time to get the current time in ticks
        if msg.type == 'note_on' and msg.velocity > 0:
            note_start_times[msg.note] = current_time
        elif (msg.type == 'note_off' or (msg.type == 'note_on' and msg.velocity == 0)) and msg.note in note_start_times:
            start_time = note_start_times.pop(msg.note)
            duration = current_time - start_time
            duration_ratio = duration / ppqn  # Calculate duration as a ratio of PPQN
            note_name, octave = note_number_to_name(msg.note)
            track_data['notes'].append({
                'note': msg.note,
                'note_name': note_name,
                'octave': octave,
                'start_time': start_time,  # Start time in ticks
                'duration': duration,  # Duration in ticks
                'duration_ratio': duration_ratio  # Ratio of duration to PPQN
            })
    midi_data['tracks'].append(track_data)

# Save the modified MIDI data to a JSON file
with open('midi_data.json', 'w') as outfile:
    json.dump(midi_data, outfile, indent=4)

# Example usage: Print the pulse duration
print(f"Pulse duration in seconds: {pulse_duration}")
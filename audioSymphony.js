// A C-Major Pentatonic scale spanning 4 octaves (harmonious and impossible to play a "wrong" note)
const pentatonicScale = [
  130.81, 146.83, 164.81, 196.00, 220.00, // Octave 3
  261.63, 293.66, 329.63, 392.00, 440.00, // Octave 4
  523.25, 587.33, 659.25, 783.99, 880.00, // Octave 5
  1046.50, 1174.66, 1318.51, 1567.98, 1760.00 // Octave 6
];

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(frequency, duration, volume = 0.05) {
  if (!audioCtx) return;
  
  let oscillator = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();

  oscillator.type = 'sine'; // A smooth, bell-like tone
  oscillator.frequency.value = frequency;

  // Envelope to create a "plucked" sound and avoid clicking
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.01); // Quick attack
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration); // Fade out

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}

function playNoteForNode(currentNodeId, targetNodeId) {
  if (!window.soundEnabled) return;
  initAudio();

  // 1. Calculate Manhattan distance from the current node to the target
  let currentCoords = currentNodeId.split("-").map(Number);
  let targetCoords = targetNodeId.split("-").map(Number);
  let distance = Math.abs(currentCoords[0] - targetCoords[0]) + Math.abs(currentCoords[1] - targetCoords[1]);

  // 2. Map the distance to our musical scale (closer distance = higher pitch)
  let maxGridDistance = 75; // Rough estimate of max distance across a standard screen
  let fraction = 1 - (distance / maxGridDistance);
  let scaleIndex = Math.floor(fraction * pentatonicScale.length);
  
  // Bound the index to ensure we don't crash
  scaleIndex = Math.max(0, Math.min(pentatonicScale.length - 1, scaleIndex));
  
  let frequency = pentatonicScale[scaleIndex];

  // Play a very short note (50ms) so it sounds like a fast arpeggio
  playTone(frequency, 0.05); 
}

function playSuccessChord() {
  if (!window.soundEnabled) return;
  initAudio();
  // Play a triumphant C-Major chord (C, E, G, C)
  playTone(261.63, 1.0, 0.1); 
  playTone(329.63, 1.0, 0.1); 
  playTone(392.00, 1.0, 0.1); 
  playTone(523.25, 1.0, 0.1); 
}

module.exports = { playNoteForNode, playSuccessChord };

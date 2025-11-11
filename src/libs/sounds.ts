export const soundMap: Record<string, string> = {
  si: '/sounds/drums/virtual-drum_sounds_snare.wav',
  hithat: '/sounds/Cymatics%20-%20Blitz%20Hihat.wav',
  crash: '/sounds/Cymatics%20-%20Hard%20Crash.wav',
  snare: '/sounds/Cymatics%20-%20Iconic%20Snare%20-%20F%23.wav',
  tape: '/sounds/Cymatics%20-%20Fire%20Kick%20-%20D.wav',
  clap: '/sounds/drums/Cymatics%20-%20Champagne%20Clap.wav',
  trilha: '/sounds/Cymatics%20-%20Harm%20Way%20-%20133%20BPM%20C%23%20Min.wav',
};

let audioBuffers: Map<string, AudioBuffer> | null = null;
let audioContext: AudioContext | null = null;

export function initializeAudio(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export async function loadSounds(ctx: AudioContext): Promise<Map<string, AudioBuffer>> {
  if (audioBuffers) {
    return audioBuffers;
  }

  const newBufferMap = new Map<string, AudioBuffer>();
  
  const loadPromises = Object.entries(soundMap).map(async ([soundId, path]) => {
    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      newBufferMap.set(soundId, audioBuffer);
    } catch (e) {
      console.error(`Erro ao carregar o som: ${soundId}`, e);
    }
  });

  await Promise.all(loadPromises);
  audioBuffers = newBufferMap;
  console.log('Todos os sons carregados!', audioBuffers);
  return audioBuffers;
}

export function playSound(ctx: AudioContext, buffer: AudioBuffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}
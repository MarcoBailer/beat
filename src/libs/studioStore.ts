import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { initializeAudio, loadSounds as loadBuiltinSounds } from './sounds';

export interface LibrarySound {
  id: string;
  name: string;
  url: string;
  duration: number;
}

export interface Track {
  id: string;
  name: string;
}

export interface TimelineClip {
  id: string;
  soundId: string;
  trackId: string;
  startTime: number;
  duration: number;
  name: string;
}

interface StudioState {
  tracks: Track[];
  sounds: LibrarySound[];
  clips: TimelineClip[];

  addTrack: () => void;
  addSound: (sound: Omit<LibrarySound, 'id'>) => void;
  addClip: (clip: Omit<TimelineClip, 'id'>) => void;
  moveClip: (clipId: string, newTrackId: string, newStartTime: number) => void;
}

export interface StudioTransportState {
  isPlaying: boolean;
  playheadSec: number;
  ctxStartTime: number;
  audioCtx: AudioContext | null;
  buffers: Map<string, AudioBuffer>;
  waveforms: Map<string, Float32Array>;
  scheduled: Set<string>;
  schedulerId: number | null;
  lookaheadSec: number;

  setPlayhead: (sec: number) => void;
  initAudio: () => Promise<void>;
  play: () => Promise<void>;
  stop: () => void;
}

export type StudioStore = StudioState & StudioTransportState;

const defaultTracks: Track[] = Array.from({ length: 15 }, (_, i) => ({
  id: `track_${i + 1}`,
  name: `Track ${i + 1}`,
}));

function computePeaks(buffer: AudioBuffer, buckets = 2048): Float32Array {
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }
  const total = buffer.length;
  const step = Math.max(1, Math.ceil(total / buckets));
  const peaks = new Float32Array(Math.ceil(total / step));

  let i = 0;
  for (let start = 0; start < total; start += step, i++) {
    const end = Math.min(start + step, total);
    let maxAbs = 0;
    for (let s = start; s < end; s++) {
      // média entre canais
      let sample = 0;
      for (let ch = 0; ch < channels.length; ch++) {
        sample += channels[ch][s];
      }
      sample /= channels.length || 1;
      const a = Math.abs(sample);
      if (a > maxAbs) maxAbs = a;
    }
    peaks[i] = maxAbs; // 0..1
  }
  return peaks;
}

export const useStudioStore = create<StudioStore>((set, get) => ({
  // Estado base
  tracks: defaultTracks,
  sounds: [
    { id: 'sound_kick', name: 'Kick 808.wav', url: '/sounds/Cymatics - Fire Kick - D.wav', duration: 1.5 },
    { id: 'sound_snare', name: 'Snare.wav', url: '/sounds/drums/virtual-drum_sounds_snare.wav', duration: 1.0 },
    { id: 'sound_hat', name: 'Hihat.wav', url: '/sounds/drums/virtual-drum_sounds_hihat.wav', duration: 0.5 },
  ],
  clips: [
    { id: 'clip_1', soundId: 'sound_kick', trackId: 'track_1', startTime: 0, duration: 1.5, name: 'Kick 808.wav' },
    { id: 'clip_2', soundId: 'sound_snare', trackId: 'track_2', startTime: 1, duration: 1.0, name: 'Snare.wav' },
    { id: 'clip_3', soundId: 'sound_kick', trackId: 'track_1', startTime: 2, duration: 1.5, name: 'Kick 808.wav' },
  ],

  isPlaying: false,
  playheadSec: 0,
  ctxStartTime: 0,
  audioCtx: null,
  buffers: new Map<string, AudioBuffer>(),
  waveforms: new Map<string, Float32Array>(),
  scheduled: new Set<string>(),
  schedulerId: null,
  lookaheadSec: 0.25,

  setPlayhead: (sec: number) => set({ playheadSec: Math.max(0, sec) }),

  initAudio: async () => {
    const ctx = initializeAudio();

    const builtin = await loadBuiltinSounds(ctx);
    const merged = new Map<string, AudioBuffer>(get().buffers);
    const wf = new Map<string, Float32Array>(get().waveforms);

    builtin.forEach((buf, key) => {
      merged.set(key, buf);
      if (!wf.has(key)) {
        wf.set(key, computePeaks(buf));
      }
    });

    const sounds: Array<{ id: string; url: string }> = get().sounds || [];
    await Promise.all(
      sounds.map(async (s) => {
        if (!merged.has(s.id)) {
          try {
            const resp = await fetch(s.url);
            const ab = await resp.arrayBuffer();
            const buf = await ctx.decodeAudioData(ab);
            merged.set(s.id, buf);
            wf.set(s.id, computePeaks(buf));
          } catch (e) {
            console.warn('Falha ao carregar som do usuário', s.id, e);
          }
        } else {
          const buf = merged.get(s.id)!;
          if (!wf.has(s.id)) wf.set(s.id, computePeaks(buf));
        }
      })
    );

    set({ audioCtx: ctx, buffers: merged, waveforms: wf });
  },

  play: async () => {
    if (!get().audioCtx) {
      await get().initAudio();
    }
    const ctxInit: AudioContext = get().audioCtx!;
    if (ctxInit.state === 'suspended') await ctxInit.resume();

    const now = ctxInit.currentTime;
    const startTime = now - get().playheadSec;

    const scheduled = new Set<string>();
    set({ isPlaying: true, ctxStartTime: startTime, scheduled });

    const tick = () => {
      const g = get();
      if (!g.isPlaying || !g.audioCtx) return;

      const ctx = g.audioCtx;
      const position = ctx.currentTime - g.ctxStartTime;
      set({ playheadSec: position });

      const windowStart = position;
      const windowEnd = position + g.lookaheadSec;

      const clips = g.clips as TimelineClip[];

      clips.forEach((clip) => {
        const key = `${clip.id}@${clip.startTime}`;
        if (
          clip.startTime >= windowStart &&
          clip.startTime < windowEnd &&
          !g.scheduled.has(key)
        ) {
          const buffer = g.buffers.get(clip.soundId) || null;
          const scheduleAt = g.ctxStartTime + clip.startTime;

          if (buffer) {
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            src.connect(ctx.destination);
            try {
              src.start(scheduleAt);
              const stopAt = scheduleAt + (clip.duration || buffer.duration);
              try {
                src.stop(stopAt);
              } catch {}
              g.scheduled.add(key);
            } catch (e) {
              console.warn('Falha ao agendar clip', clip.id, e);
            }
          } else {
            const lib = (g.sounds || []).find((s) => s.id === clip.soundId);
            if (lib) {
              fetch(lib.url)
                .then((r) => r.arrayBuffer())
                .then((ab) => ctx.decodeAudioData(ab))
                .then((buf) => {
                  const merged = new Map(get().buffers);
                  const wf = new Map(get().waveforms);
                  merged.set(lib.id, buf);
                  wf.set(lib.id, computePeaks(buf));
                  set({ buffers: merged, waveforms: wf });
                })
                .catch((err) => console.warn('Decode on-demand falhou', err));
            }
          }
        }
      });
    };

    const id = window.setInterval(tick, 25);
    set({ schedulerId: id as unknown as number });
  },

  stop: () => {
    const id = get().schedulerId;
    if (id) window.clearInterval(id);
    set({
      isPlaying: false,
      schedulerId: null,
      scheduled: new Set<string>(),
      playheadSec: 0,
    });
  },

  addTrack: () =>
    set((state: StudioStore) => ({
      tracks: [
        ...state.tracks,
        { id: `track_${state.tracks.length + 1}`, name: `Track ${state.tracks.length + 1}` },
      ],
    })),

  addSound: (sound: Omit<LibrarySound, 'id'>) =>
    set((state: StudioStore) => ({
      sounds: [...state.sounds, { id: nanoid(10), ...sound }],
    })),

  addClip: (clip: Omit<TimelineClip, 'id'>) =>
    set((state: StudioStore) => ({
      clips: [...state.clips, { id: nanoid(10), ...clip }],
    })),

  moveClip: (clipId: string, newTrackId: string, newStartTime: number) =>
    set((state: StudioStore) => ({
      clips: state.clips.map((clip) =>
        clip.id === clipId ? { ...clip, trackId: newTrackId, startTime: newStartTime } : clip
      ),
    })),
}));
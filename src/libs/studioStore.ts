import { create } from 'zustand';
import { nanoid } from 'nanoid';


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


const defaultTracks = Array.from({ length: 15 }, (_, i) => ({
  id: `track_${i + 1}`,
  name: `Track ${i + 1}`,
}));

export const useStudioStore = create<StudioState>((set) => ({
  tracks: defaultTracks,
  sounds: [
    { id: 'sound_kick', name: 'Kick 808.wav', url: '/sounds/kick.wav', duration: 1.5 },
    { id: 'sound_snare', name: 'Snare.wav', url: '/sounds/snare.wav', duration: 1.0 },
    { id: 'sound_hat', name: 'Hihat.wav', url: '/sounds/hithat.wav', duration: 0.5 },
  ],
  clips: [
    { id: 'clip_1', soundId: 'sound_kick', trackId: 'track_1', startTime: 0, duration: 1.5, name: 'Kick 808.wav' },
    { id: 'clip_2', soundId: 'sound_snare', trackId: 'track_2', startTime: 1, duration: 1.0, name: 'Snare.wav' },
    { id: 'clip_3', soundId: 'sound_kick', trackId: 'track_1', startTime: 2, duration: 1.5, name: 'Kick 808.wav' },
  ],

  addTrack: () => set((state) => ({
    tracks: [
      ...state.tracks,
      { id: `track_${state.tracks.length + 1}`, name: `Track ${state.tracks.length + 1}` }
    ]
  })),

  addSound: (sound) => set((state) => ({
    sounds: [
      ...state.sounds,
      { id: nanoid(10), ...sound }
    ]
  })),

  addClip: (clip) => set((state) => ({
    clips: [
      ...state.clips,
      { id: nanoid(10), ...clip }
    ]
  })),

  moveClip: (clipId, newTrackId, newStartTime) => set((state) => ({
    clips: state.clips.map(clip => 
      clip.id === clipId 
        ? { ...clip, trackId: newTrackId, startTime: newStartTime } 
        : clip
    )
  })),
}));
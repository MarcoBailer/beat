'use client';

import React from 'react';

const TOTAL_SECONDS = 60; 
const PIXELS_PER_SECOND = 100;

export default function TimelineRuler() {
  const totalWidth = TOTAL_SECONDS * PIXELS_PER_SECOND;
  
  return (
    <div className="sticky top-0 z-10 flex bg-background-dark border-b-2 border-brand-primary/30" style={{ width: `calc(${totalWidth}px + 12rem)` }}>
      <div className="w-48 h-8 shrink-0 border-r border-brand-primary/10" /> 
      
      <div className="relative h-8" style={{ width: `${totalWidth}px` }}>
        {Array.from({ length: TOTAL_SECONDS }).map((_, sec) => (
          <div
            key={sec}
            className="absolute top-0 h-full border-l border-text-secondary/30"
            style={{ left: `${sec * PIXELS_PER_SECOND}px` }}
          >
            <span className="absolute top-1 left-1 text-xs text-text-secondary">
              {sec}s
            </span>
            <div className="absolute top-5 left-1/4 w-px h-3 bg-text-secondary/20" />
            <div className="absolute top-5 left-1/2 w-px h-3 bg-text-secondary/20" />
            <div className="absolute top-5 left-3/4 w-px h-3 bg-text-secondary/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings } from 'lucide-react';

const Controls = ({ isRunning, onStart, onPause, onReset, onSkip, onSettingsOpen }) => {
  return (
    <div className="controls">
      <button
        onClick={onReset}
        className="control-btn control-btn-secondary"
        title="Reset"
        id="btn-reset"
      >
        <RotateCcw size={20} />
      </button>

      <button
        onClick={isRunning ? onPause : onStart}
        className="control-btn control-btn-primary"
        title={isRunning ? 'Pause' : 'Start'}
        id="btn-play-pause"
      >
        {isRunning ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
      </button>

      <button
        onClick={onSkip}
        className="control-btn control-btn-secondary"
        title="Skip"
        id="btn-skip"
      >
        <SkipForward size={20} />
      </button>

      <button
        onClick={onSettingsOpen}
        className="control-btn control-btn-tertiary"
        title="Settings"
        id="btn-settings"
      >
        <Settings size={18} />
      </button>
    </div>
  );
};

export default Controls;

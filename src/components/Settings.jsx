import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Settings = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    const num = Math.max(1, Math.min(99, parseInt(value, 10) || 1));
    setLocalSettings((prev) => ({ ...prev, [key]: num }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="settings-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="settings-close" id="btn-settings-close">
            <X size={20} />
          </button>
        </div>

        <div className="settings-body">
          <div className="setting-item">
            <label htmlFor="setting-work">Focus (minutes)</label>
            <div className="setting-input-group">
              <input
                id="setting-work"
                type="range"
                min="1"
                max="60"
                value={localSettings.work}
                onChange={(e) => handleChange('work', e.target.value)}
                className="setting-slider"
              />
              <span className="setting-value">{localSettings.work}</span>
            </div>
          </div>

          <div className="setting-item">
            <label htmlFor="setting-short-break">Short Break (minutes)</label>
            <div className="setting-input-group">
              <input
                id="setting-short-break"
                type="range"
                min="1"
                max="30"
                value={localSettings.shortBreak}
                onChange={(e) => handleChange('shortBreak', e.target.value)}
                className="setting-slider"
              />
              <span className="setting-value">{localSettings.shortBreak}</span>
            </div>
          </div>

          <div className="setting-item">
            <label htmlFor="setting-long-break">Long Break (minutes)</label>
            <div className="setting-input-group">
              <input
                id="setting-long-break"
                type="range"
                min="1"
                max="45"
                value={localSettings.longBreak}
                onChange={(e) => handleChange('longBreak', e.target.value)}
                className="setting-slider"
              />
              <span className="setting-value">{localSettings.longBreak}</span>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={onClose} className="btn-cancel" id="btn-cancel">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-save" id="btn-save">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

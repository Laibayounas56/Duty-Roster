import React from 'react';
import './styles.css';

const TimePicker = ({ value, onChange, label, placeholder }) => {
  // Parse the current value (e.g., "09:30 AM")
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '', minute: '', period: 'AM' };
    
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      return {
        hour: String(match[1]).padStart(2, '0'), // Pad hour to match dropdown values
        minute: match[2],
        period: match[3].toUpperCase()
      };
    }
    return { hour: '', minute: '', period: 'AM' };
  };

  const { hour, minute, period } = parseTime(value);

  const handleChange = (newHour, newMinute, newPeriod) => {
    if (newHour && newMinute && newPeriod) {
      const formattedTime = `${String(newHour).padStart(2, '0')}:${newMinute} ${newPeriod}`;
      onChange(formattedTime);
    } else {
      onChange('');
    }
  };

  // Generate hours 1-12
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  // Generate minutes 00-59
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select
          className="form-input"
          value={hour}
          onChange={(e) => handleChange(e.target.value, minute, period)}
          style={{ flex: '1' }}
        >
          <option value="" disabled>Hour</option>
          {hours.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        
        <span style={{ color: '#6b7280', fontWeight: 'bold', fontSize: '18px' }}>:</span>
        
        <select
          className="form-input"
          value={minute}
          onChange={(e) => handleChange(hour, e.target.value, period)}
          style={{ flex: '1' }}
        >
          <option value="" disabled>Min</option>
          {minutes.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        
        <select
          className="form-input"
          value={period}
          onChange={(e) => handleChange(hour, minute, e.target.value)}
          style={{ flex: '0 0 80px' }}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default TimePicker;

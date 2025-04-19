import React, { useState } from "react";
import "../styles/professional.css"

const daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
const timeSlots = Array.from({ length: 12 }, (_, i) => `${(9 + i).toString().padStart(2, "0")}:00 hs`)

const ScheduleSelector = ({ onSubmit }) => {
  const [schedule, setSchedule] = useState(() =>
    Object.fromEntries(daysOfWeek.map(day => [day, []]))
  )

  const toggleHour = (day, hour) => {
    setSchedule(prev => {
      const daySchedule = prev[day]
      const updatedDay = daySchedule.includes(hour)
        ? daySchedule.filter(h => h !== hour)
        : [...daySchedule, hour]
      return { ...prev, [day]: updatedDay.sort() }
    })
  }

  const handleSubmit = () => {
    onSubmit({ schedule })
  }

  const isSlotEnabled = (day, hour) => {
    const hourInt = parseInt(hour.replace(" hs", "").split(":")[0]);
  
    if (["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"].includes(day)) {
      return hourInt >= 9 && hourInt <= 20;
    }
  
    if (day === "Sabado") {
      return hourInt >= 10 && hourInt <= 18;
    }
  
    if (day === "Domingo") {
      return hourInt >= 10 && hourInt <= 15;
    }
  
    return false;
  };
  
  const renderScheduleGrid = () => {
    return timeSlots.map((hour) => {
      const row = [
        <div key={`hour-${hour}`} className="schedule-hour">{hour}</div>,
        ...daysOfWeek.map(day => {
          const isEnabled = isSlotEnabled(day, hour);
          const selected = schedule[day].includes(hour);
          return (
            <div
              key={`${day}-${hour}`}
              className={`schedule-cell ${selected ? "selected" : ""} ${!isEnabled ? "disabled" : ""}`}
              onClick={() => isEnabled && toggleHour(day, hour)}
              style={{ cursor: isEnabled ? "pointer" : "not-allowed", opacity: isEnabled ? 1 : 0.3 }}
            >
              {selected ? "✓" : ""}
            </div>
          );
        })
      ];
      return row;
    });
  };

  return (
    <div className="schedule-table-container">
      <div className="schedule-grid">
        <div className="schedule-header"></div>
        {daysOfWeek.map(day => (
          <div key={day} className="schedule-header">{day}</div>
        ))}
        {renderScheduleGrid()}
      </div>
      <button 
        className="professional-service-btn view-details-btn" 
        onClick={handleSubmit}
        > Guardar Horarios
      </button>
    </div>
  )
}

export default ScheduleSelector

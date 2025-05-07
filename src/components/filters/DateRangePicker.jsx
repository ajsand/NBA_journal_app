import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

function DateRangePicker({ selectedRange, onChange, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [localRange, setLocalRange] = useState({
    start: selectedRange?.start ? new Date(selectedRange.start) : null,
    end: selectedRange?.end ? new Date(selectedRange.end) : null
  });
  
  // Month navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Date selection
  const handleDateClick = (day) => {
    const clickedDate = new Date(day);
    
    if (!localRange.start || (localRange.start && localRange.end)) {
      // Start new selection
      setLocalRange({
        start: clickedDate,
        end: null
      });
    } else {
      // Complete selection
      if (clickedDate < localRange.start) {
        setLocalRange({
          start: clickedDate,
          end: localRange.start
        });
      } else {
        setLocalRange({
          start: localRange.start,
          end: clickedDate
        });
      }
    }
  };
  
  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Helper to determine if date in selected range
  const isInRange = (day) => {
    if (!localRange.start || !localRange.end) return false;
    return day >= localRange.start && day <= localRange.end;
  };
  
  // Helper to determine if date in hover range
  const isInHoverRange = (day) => {
    if (!localRange.start || localRange.end || !hoveredDate) return false;
    return localRange.start < hoveredDate 
      ? (day > localRange.start && day <= hoveredDate)
      : (day < localRange.start && day >= hoveredDate);
  };
  
  // Predefined ranges
  const applyPredefinedRange = (range) => {
    setLocalRange(range);
  };
  
  // Apply selection and close
  const applySelection = () => {
    onChange(localRange);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-72">
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h3 className="text-lg font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
      </div>
      
      <div className="p-2">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => setHoveredDate(day)}
              className={`
                w-8 h-8 rounded-full text-sm flex items-center justify-center
                ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : 'text-gray-700'}
                ${(localRange.start && isSameDay(day, localRange.start)) || (localRange.end && isSameDay(day, localRange.end)) 
                  ? 'bg-primary-500 text-white hover:bg-primary-600' 
                  : isInRange(day) 
                    ? 'bg-primary-100 text-primary-700' 
                    : isInHoverRange(day)
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-100'
                }
              `}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-3">
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <button 
            onClick={() => applyPredefinedRange({
              start: new Date(),
              end: new Date()
            })}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center"
          >
            Today
          </button>
          <button 
            onClick={() => {
              const today = new Date();
              const start = startOfWeek(today);
              const end = endOfWeek(today);
              applyPredefinedRange({ start, end });
            }}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center"
          >
            This Week
          </button>
          <button 
            onClick={() => {
              const today = new Date();
              const start = startOfMonth(today);
              const end = endOfMonth(today);
              applyPredefinedRange({ start, end });
            }}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-center"
          >
            This Month
          </button>
        </div>
        
        <div className="flex justify-between mt-2">
          <button 
            onClick={onClose}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={applySelection}
            disabled={!localRange.start || !localRange.end}
            className={`px-3 py-1 text-sm rounded text-white ${
              !localRange.start || !localRange.end
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateRangePicker;
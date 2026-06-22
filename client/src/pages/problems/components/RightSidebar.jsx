import React, { useMemo } from 'react';

const RightSidebar = () => {
  // Generate current month calendar logic
  const { currentMonth, currentYear, calendarCells } = useMemo(() => {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    
    // Get number of days in the current month
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    // Get the day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
    const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const cells = [];
    
    // Add empty padding cells for the start of the month
    for (let i = 0; i < startDay; i++) {
      cells.push({ type: 'empty', id: `empty-${i}` });
    }
    
    // Add the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isPastOrToday = i <= today.getDate();
      // Randomly decide if this day has a submission (e.g. 70% chance)
      const hasSubmission = isPastOrToday ? Math.random() > 0.3 : false;
      
      cells.push({ 
        type: 'day', 
        day: i, 
        isToday: i === today.getDate(),
        isPastOrToday,
        hasSubmission,
        id: `day-${i}` 
      });
    }

    return { currentMonth, currentYear, calendarCells: cells };
  }, []);
  return (
    <aside className="w-full xl:w-80 h-auto xl:h-full overflow-y-auto custom-scrollbar border-t xl:border-t-0 xl:border-l border-outline-variant/30 bg-surface-container-lowest p-md lg:p-lg flex flex-col gap-lg z-20">
      
      {/* Calendar Widget */}
      <div>
        <h3 className="font-body-md font-semibold text-on-surface mb-sm flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <span
              className="material-symbols-outlined text-on-surface-variant text-[18px]"
              data-icon="calendar_month"
            >
              calendar_month
            </span>
            Activity
          </div>
          <span className="text-xs font-semibold text-primary">{currentMonth} {currentYear}</span>
        </h3>
        
        <div className="glass-panel rounded-xl p-md">
          {/* Days of the week header */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <span key={day} className="text-[10px] font-code-sm text-on-surface-variant uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-md">
            {calendarCells.map((cell) => {
              if (cell.type === 'empty') {
                return <div key={cell.id} className="w-full aspect-square" />;
              }
              
              return (
                <div
                  key={cell.id}
                  className={`relative flex items-center justify-center w-full aspect-square rounded-md text-xs font-code-sm transition-all duration-200 cursor-default
                    ${cell.isToday ? "bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(77,142,255,0.4)]" : "bg-surface-variant/30 text-on-surface hover:bg-surface-variant"}
                  `}
                >
                  {cell.day}
                  
                  {/* Dot for submissions */}
                  {cell.isPastOrToday && (
                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      cell.hasSubmission 
                        ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]" 
                        : "bg-orange-800/80 shadow-[0_0_4px_rgba(154,52,18,0.4)]"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-code-sm text-on-surface-variant border-t border-outline-variant/20 pt-3 mt-1">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]" />
                 <span>Solved</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-800/80 shadow-[0_0_4px_rgba(154,52,18,0.4)]" />
                 <span>Missed</span>
               </div>
            </div>
            <div className="text-primary font-semibold hidden 2xl:block">
              842 submissions this year
            </div>
          </div>
        </div>
      </div>

      {/* Trending */}
      <div>
        <h3 className="font-body-md font-semibold text-on-surface mb-sm flex items-center gap-xs">
          <span
            className="material-symbols-outlined text-on-surface-variant text-[18px]"
            data-icon="trending_up"
          >
            trending_up
          </span>
          Trending Technologies
        </h3>
        <div className="glass-panel rounded-xl p-xs">
          <div className="flex items-center justify-between p-sm hover:bg-surface-variant/50 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-center gap-sm">
              <span className="font-code-sm text-outline w-4">1</span>
              <span className="font-body-sm text-on-surface">React</span>
            </div>
            <span className="font-code-sm text-green-400 flex items-center text-[10px]">
              <span
                className="material-symbols-outlined text-[12px]"
                data-icon="arrow_upward"
              >
                arrow_upward
              </span>{" "}
              12%
            </span>
          </div>
          <div className="flex items-center justify-between p-sm hover:bg-surface-variant/50 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-center gap-sm">
              <span className="font-code-sm text-outline w-4">2</span>
              <span className="font-body-sm text-on-surface">Node.js</span>
            </div>
            <span className="font-code-sm text-green-400 flex items-center text-[10px]">
              <span
                className="material-symbols-outlined text-[12px]"
                data-icon="arrow_upward"
              >
                arrow_upward
              </span>{" "}
              8%
            </span>
          </div>
          <div className="flex items-center justify-between p-sm hover:bg-surface-variant/50 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-center gap-sm">
              <span className="font-code-sm text-outline w-4">3</span>
              <span className="font-body-sm text-on-surface">TypeScript</span>
            </div>
            <span className="font-code-sm text-green-400 flex items-center text-[10px]">
              <span
                className="material-symbols-outlined text-[12px]"
                data-icon="arrow_upward"
              >
                arrow_upward
              </span>{" "}
              15%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;

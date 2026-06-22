const RightSidebar = ({ heatmapCells }) => {
  return (
    <aside className="w-full xl:w-80 h-auto xl:h-full overflow-y-auto custom-scrollbar border-t xl:border-t-0 xl:border-l border-outline-variant/30 bg-surface-container-lowest p-md lg:p-lg flex flex-col gap-lg z-20">
      
      {/* Calendar Widget / Heatmap */}
      <div>
        <h3 className="font-body-md font-semibold text-on-surface mb-sm flex items-center gap-xs">
          <span
            className="material-symbols-outlined text-on-surface-variant text-[18px]"
            data-icon="calendar_month"
          >
            calendar_month
          </span>
          Activity
        </h3>
        <div className="glass-panel rounded-xl p-md">
          <div className="flex justify-between items-end mb-sm px-xs">
            <div className="flex gap-lg text-[10px] font-code-sm text-on-surface-variant uppercase tracking-wider">
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
            <div className="text-[10px] font-code-sm text-primary font-semibold">
              842 submissions this year
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-md">{heatmapCells}</div>
          <div className="flex justify-end items-center text-[10px] font-code-sm text-on-surface-variant gap-xs">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-sm bg-surface-variant" />
              <div className="w-2 h-2 rounded-sm bg-primary/30" />
              <div className="w-2 h-2 rounded-sm bg-primary/60" />
              <div className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            <span>More</span>
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

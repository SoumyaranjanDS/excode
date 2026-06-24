import { useNavigate } from "react-router-dom";

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (!problem.locked) {
      navigate(`/workspace/${problem.id}`);
    }
  };

  // Status button UI mapping
  const getButtonUI = () => {
    switch (problem.status) {
      case "Solve":
        return (
          <button
            onClick={handleAction}
            className="bg-primary hover:bg-primary-container text-on-primary font-body-sm font-medium px-sm py-xs rounded-lg transition-all glow-hover ml-sm"
          >
            Solve
          </button>
        );
      case "Solved":
        return (
          <button
            onClick={handleAction}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 font-body-sm font-medium px-sm py-xs rounded-lg transition-all ml-sm border border-green-500/30 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]" data-icon="check">check</span>
            Solved
          </button>
        );
      case "Review":
        return (
          <button
            onClick={handleAction}
            className="bg-surface-variant hover:bg-surface-bright text-on-surface px-sm py-xs rounded-lg font-body-sm font-medium transition-colors ml-sm border border-outline-variant/30"
          >
            Review
          </button>
        );
      case "Continue":
        return (
          <button
            onClick={handleAction}
            className="bg-surface-variant hover:bg-surface-bright text-on-surface px-sm py-xs rounded-lg font-body-sm font-medium transition-colors ml-sm border border-outline-variant/30 flex items-center gap-1"
          >
            Continue{" "}
            <span
              className="material-symbols-outlined text-[16px]"
              data-icon="arrow_forward"
            >
              arrow_forward
            </span>
          </button>
        );
      default:
        return null;
    }
  };

  if (problem.locked) {
    return (
      <div className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-md items-start md:items-center opacity-60 bg-surface-container-highest/20">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/30">
          <span
            className="material-symbols-outlined text-[16px] text-outline"
            data-icon="lock"
          >
            lock
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-sm mb-1">
            <h3 className="font-body-md font-semibold text-on-surface-variant">
              {problem.title}
            </h3>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-${problem.color}-500/10 text-${problem.color}-400 border border-${problem.color}-500/20`}
            >
              {problem.difficulty}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {problem.technology}
            </span>
          </div>
          <p className="font-body-sm text-outline line-clamp-1">
            {problem.description}
          </p>
        </div>
        <div className="flex items-center gap-md font-code-sm text-outline md:ml-auto w-full md:w-auto justify-between md:justify-end mt-sm md:mt-0">
          <div className="text-xs flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[14px]"
              data-icon="lock_clock"
            >
              lock_clock
            </span>{" "}
            Unlocks at Level {problem.unlockLevel}
          </div>
        </div>
      </div>
    );
  }

  // Determine icon and left border based on status or difficulty
  let iconContent;
  let iconContainerClass;
  let cardBorderClass;

  if (problem.status === "Review" || problem.status === "Solved") {
    cardBorderClass = "border-l-2 border-l-green-500/50";
    iconContainerClass = "bg-green-500/20 border-green-500/30";
    iconContent = (
      <span
        className="material-symbols-outlined text-[18px] text-green-400"
        data-icon="check"
        data-weight="fill"
      >
        check
      </span>
    );
  } else if (problem.status === "Continue") {
    cardBorderClass = "border-l-2 border-l-amber-500/50";
    iconContainerClass = "bg-amber-500/10 border-amber-500/30";
    iconContent = <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>;
  } else {
    cardBorderClass = "border-l-2 border-l-red-500/50"; // default for hard/unsolved
    if (problem.difficulty === "Easy") cardBorderClass = "border-l-2 border-l-green-500/50";
    if (problem.difficulty === "Medium") cardBorderClass = "border-l-2 border-l-amber-500/50";
    
    iconContainerClass = "bg-surface-variant border-outline-variant/30";
    iconContent = <span className="w-2 h-2 rounded-full bg-outline"></span>;
  }

  return (
    <div
      className={`glass-panel rounded-xl p-md flex flex-col md:flex-row gap-md items-start md:items-center group hover:border-outline-variant/60 transition-all ${cardBorderClass}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${iconContainerClass}`}
      >
        {iconContent}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-sm mb-1">
          <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors cursor-pointer" onClick={handleAction}>
            {problem.title}
          </h3>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-${problem.color}-500/10 text-${problem.color}-400 border border-${problem.color}-500/20`}
          >
            {problem.difficulty}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {problem.technology}
          </span>
        </div>
        <p className="font-body-sm text-on-surface-variant line-clamp-1">
          {problem.description}
        </p>
      </div>
      <div className="flex items-center gap-md font-code-sm text-on-surface-variant md:ml-auto w-full md:w-auto justify-between md:justify-end mt-sm md:mt-0">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]" data-icon="toll">
            toll
          </span>{" "}
          {problem.xp} XP
        </div>
        <div className="flex items-center gap-1">
          <span
            className="material-symbols-outlined text-[14px]"
            data-icon="schedule"
          >
            schedule
          </span>{" "}
          {problem.timeEst}
        </div>
        {problem.successRate && (
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[14px]"
              data-icon="group"
            >
              group
            </span>{" "}
            {problem.successRate}
          </div>
        )}
        {getButtonUI()}
      </div>
    </div>
  );
};

export default ProblemCard;

// components/DraggableChartWrapper.tsx
import React from "react";

const DraggableChartWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`${className} h-full w-full`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        {...props}
      >
        <div className="h-full w-full">
          {" "}
          {/* 👈 ensures children stretch too */}
          {children}
        </div>
      </div>
    );
  }
);

DraggableChartWrapper.displayName = "DraggableChartWrapper";
export default DraggableChartWrapper;

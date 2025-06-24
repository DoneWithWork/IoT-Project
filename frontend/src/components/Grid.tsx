"use client";
import { useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Chart from "./Chart";

const layouts = {
  lg: [
    { i: "1", x: 0, y: 0, w: 3, h: 2 },
    { i: "2", x: 3, y: 0, w: 3, h: 2 },
    { i: "3", x: 8, y: 0, w: 4, h: 2 },
  ],
  md: [
    { i: "1", x: 0, y: 0, w: 5, h: 2 },
    { i: "2", x: 5, y: 0, w: 5, h: 2 },
    { i: "3", x: 0, y: 2, w: 10, h: 2 },
  ],
};

export default function Grid() {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  return (
    <ResponsiveReactGridLayout
      className="layout overflow-x-hidden h-full "
      containerPadding={[0, 0]}
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996 }}
      cols={{ lg: 12, md: 10 }}
      rowHeight={100}
      width={1200}
    >
      <div key="1" className="bg-red-200">
        1
      </div>
      <div key="2" className="bg-green-200">
        2
      </div>
      <div key={"3"}>
        <Chart />
      </div>
      {/* <div key="3" className="bg-blue-200">
          3
        </div> */}
    </ResponsiveReactGridLayout>
  );
}

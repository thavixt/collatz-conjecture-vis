import { TooltipProps } from "recharts";
import { getNext } from "./collatz";

export const CustomTooltip = (payload: TooltipProps<number, number>) => {
  if (payload?.payload?.[0]) {
    const index = payload?.payload?.[0].payload.name;
    const value = payload?.payload?.[0].value;
    return (
      <div className="text-sm border-2 rounded-md p-2 bg-slate-300 text-gray-950 flex flex-col place-items-end">
        <p>x: {index}</p>
        {/* <p className="italic">Previous: <strong>{getPrevious(value)}</strong></p> */}
        <p className="font-bold" style={{ color: payload?.payload?.[0].stroke }}>y: {value}</p>
        <p className="italic">next y: {value ? getNext(value) : '-'}</p>
      </div>
    );
  }
  return null;
};

export const CustomScatterTooltip = (payload: TooltipProps<number, number>) => {
  if (payload?.payload?.[0]) {
    const seed = payload?.payload?.[0].payload.seed;
    const stoppingTime = payload?.payload?.[0].payload.stoppingTime;
    return (
      <div className="text-sm border-2 rounded-md p-2 bg-slate-300 text-gray-950 flex flex-col place-items-end">
        <p>Seed number: {seed}</p>
        <p>Stopping time: {stoppingTime}</p>
      </div>
    );
  }
  return null;
};

export const CustomTotalScatterTooltip = (payload: TooltipProps<number, number>) => {
  if (payload?.payload?.[0]) {
    const seed = payload?.payload?.[0].payload.seed;
    const totalStoppingTime = payload?.payload?.[0].payload.totalStoppingTime;
    return (
      <div className="text-sm border-2 rounded-md p-2 bg-slate-300 text-gray-950 flex flex-col place-items-end">
        <p>Seed number: {seed}</p>
        <p>Total stopping time: {totalStoppingTime}</p>
      </div>
    );
  }
  return null;
};

"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Staff } from "@/entities/Staff";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Pencil, PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AddShiftDialog } from "./add_shift_dialog";
import { SetTimeDialog } from "./set_time_dialog";
import Image from "next/image";

const HeaderCellStyleWeek =
  "w-[calc(100%/8)] h-10 border border-gray-100 border-[1px]";
const CellStyleWeek =
  "w-[calc(100%/8)] h-44 border border-gray-100 border-[1px]";
const HeaderCellStyleMonth = "w-40 h-10 border border-gray-100 border-[1px]";
const CellStyleMonth = "w-40 h-44 border border-gray-100 border-[1px]";
export type DisplayType = "Day" | "Week" | "Month";

const AttendanceTable = ({
  data,
  rangeDate,
  displayType = "Week",
  staffList,
  onUpdateShift,
  onSetTime,
}: {
  data: Shift[];
  rangeDate: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  staffList: Staff[];
  onUpdateShift?: (values: Shift) => void;
  onSetTime?: (values: Shift[]) => void;
}) => {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [openAddShiftDialog, setOpenAddShiftDialog] = useState<boolean>(false);
  const [selectedDailyShift, setSelectedDailyShift] =
    useState<DailyShift | null>(null);
  const [openSetTimeDialog, setOpenSetTimeDialog] = useState<boolean>(false);

  const handleOpenAddShiftDialog = (shift: Shift | null) => {
    setSelectedShift(shift);
    setOpenAddShiftDialog(true);
  };
  const handleOpenSetTimeDialog = (dailyShift: DailyShift | null) => {
    setSelectedDailyShift(dailyShift);
    setOpenSetTimeDialog(true);
  };

  data.sort((a, b) => {
    if (a.workingTime.start > b.workingTime.start) return 1;
    else if (a.workingTime.start < b.workingTime.start) return -1;
    else return 0;
  });
  return (
    <ScrollArea className={cn("w-full rounded-md shadow pb-2")}>
      <table className="w-full bg-white">
        <tr>
          <AttendanceHeaderRow
            range={rangeDate}
            displayType={displayType}
            handleOpenShiftDialog={handleOpenAddShiftDialog}
          />
        </tr>
        {data.length === 0 && (
          <tr>
            <Image
              alt="No shift found"
              width={200}
              height={150}
              src={"/no-shift-found.png"}
              className="object-contain mx-auto"
            />
          </tr>
        )}
        {data.map((shift, index) => {
          return (
            <tr key={shift.name + index}>
              <AttendanceDataRow
                shift={shift}
                rangeDate={rangeDate}
                displayType={displayType}
                handleOpenSetTimeDialog={handleOpenSetTimeDialog}
                handleOpenShiftDialog={handleOpenAddShiftDialog}
              />
            </tr>
          );
        })}
      </table>
      <AddShiftDialog
        shift={selectedShift}
        open={openAddShiftDialog}
        setOpen={setOpenAddShiftDialog}
        submit={onUpdateShift}
      />
      <SetTimeDialog
        open={openSetTimeDialog}
        setOpen={setOpenSetTimeDialog}
        shiftList={data}
        staffList={staffList}
        specificShift={selectedDailyShift}
        submit={onSetTime}
      />
      <ScrollBar orientation="horizontal" className="bg-red-300" />
    </ScrollArea>
  );
};

const createRangeDate = (range: { startDate: Date; endDate: Date }): Date[] => {
  const rangeDate: Date[] = [];
  //create an array of date from startDate to endDate
  for (
    let i = range.startDate.getTime();
    i <= range.endDate.getTime();
    i += 86400000
  ) {
    rangeDate.push(new Date(i));
  }
  return rangeDate;
};

const AttendanceHeaderRow = ({
  range,
  displayType = "Week",
  handleOpenShiftDialog,
}: {
  range: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  handleOpenShiftDialog?: (values: Shift | null) => void;
}) => {
  const rangeDate: Date[] = createRangeDate(range);
  return (
    <div className={cn("w-full flex flex-row items-center")}>
      <ShiftCell
        className={cn(
          displayType === "Month" ? HeaderCellStyleMonth : HeaderCellStyleWeek
        )}
        handleOpenShiftDialog={handleOpenShiftDialog}
      />
      {rangeDate.map((date, index) => {
        return (
          <DateCell
            key={index}
            date={date}
            displayType={displayType}
            className={cn(
              displayType === "Month"
                ? HeaderCellStyleMonth
                : HeaderCellStyleWeek
            )}
          />
        );
      })}
    </div>
  );
};

const formatDailyShiftList = (
  shift: Shift,
  rangeDate: { startDate: Date; endDate: Date }
) => {
  const range: Date[] = createRangeDate(rangeDate);

  const formattedDailyShiftList: Array<DailyShift> = [];
  range.forEach((date) => {
    const dailyShift = shift.dailyShiftList.find(
      (dailyShift) =>
        dailyShift.date.toLocaleDateString() === date.toLocaleDateString()
    );
    if (dailyShift === undefined)
      formattedDailyShiftList.push({
        shiftId: shift.id,
        shiftName: shift.name,
        date: date,
        note: "",
        attendList: [],
      });
    else formattedDailyShiftList.push(dailyShift);
  });
  return formattedDailyShiftList;
};

const AttendanceDataRow = ({
  shift,
  rangeDate,
  displayType = "Week",
  handleOpenShiftDialog,
  handleOpenSetTimeDialog,
}: {
  shift: Shift;
  rangeDate: { startDate: Date; endDate: Date };
  displayType?: DisplayType;
  handleOpenShiftDialog?: (values: Shift | null) => void;
  handleOpenSetTimeDialog?: (values: DailyShift | null) => void;
}) => {
  const formattedDailyShiftList = formatDailyShiftList(shift, rangeDate);

  return (
    <div className={cn("w-full flex flex-row items-center")}>
      <ShiftInfoCell
        shift={shift}
        className={cn(displayType === "Month" ? CellStyleMonth : CellStyleWeek)}
        handleOpenShiftDialog={handleOpenShiftDialog}
      />
      {formattedDailyShiftList.map((dailyShift, index) => {
        return (
          <DataCell
            key={index}
            data={dailyShift}
            handleOpenSetTimeDialog={handleOpenSetTimeDialog}
            className={cn(
              displayType === "Month" ? CellStyleMonth : CellStyleWeek
            )}
          />
        );
      })}
    </div>
  );
};

const ShiftCell = ({
  className,
  handleOpenShiftDialog,
}: {
  className?: string;
  handleOpenShiftDialog?: (values: Shift | null) => void;
}) => {
  return (
    <div
      className={cn(
        "px-2 flex flex-row items-center justify-between select-none",
        className
      )}
    >
      <span className="font-semibold">Shift</span>
      <PlusCircle
        size={16}
        className="opacity-50 hover:opacity-100 ease-linear duration-100 cursor-pointer select-none"
        onClick={() => {
          if (handleOpenShiftDialog) handleOpenShiftDialog(null);
        }}
      />
    </div>
  );
};

const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DateCell = ({
  date,
  className,
  displayType = "Week",
}: {
  date: Date;
  className?: string;
  displayType?: DisplayType;
}) => {
  return (
    <div
      className={cn(
        "p-2 flex flex-row items-center justify-start gap-1 select-none",
        className
      )}
    >
      <span className={cn("font-semibold")}>{day[date.getDay()]}</span>
      <span
        className={cn(
          "rounded-md px-1 py-1 text-xs",
          date.toLocaleDateString() === new Date().toLocaleDateString()
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-black"
        )}
      >
        {format(date, "dd/MM")}
      </span>
    </div>
  );
};

const ShiftInfoCell = ({
  shift,
  className,
  handleOpenShiftDialog,
}: {
  shift: Shift;
  className?: string;
  handleOpenShiftDialog?: (values: Shift | null) => void;
}) => {
  return (
    <div
      className={cn("p-2 flex flex-col relative", className)}
      onClick={() => {
        if (handleOpenShiftDialog) handleOpenShiftDialog(shift);
      }}
    >
      <span className="font-semibold">{shift.name}</span>
      <span className="text-xs">{`${format(
        shift.workingTime.start,
        "hh:mm a"
      )} - ${format(shift.workingTime.end, "hh:mm a")}`}</span>

      <div className="w-full h-full absolute top-0 left-0 cursor-pointer select-none opacity-0 hover:opacity-100 ease-linear duration-100">
        <div className="flex justify-center p-1 absolute top-2 right-2 bg-gray-100 rounded-full">
          <Pencil size={16} />
        </div>
      </div>
    </div>
  );
};

const DataCell = ({
  data,
  className,
  maxItem = 2,
  handleOpenSetTimeDialog,
}: {
  data: DailyShift;
  className?: string;
  maxItem?: number;
  handleOpenSetTimeDialog?: (values: DailyShift | null) => void;
}) => {
  const toShow = data.attendList.slice(0, maxItem);
  const hidedItem = data.attendList.length - maxItem;
  return (
    <div
      className={cn(
        "h-full flex flex-col items-center justify-start gap-2 py-2 relative",
        data.attendList.length == 0
          ? "hover:bg-gray-100 ease-linear duration-200 cursor-pointer"
          : "",
        className
      )}
    >
      {toShow.map((attend, index) => {
        return (
          <StaffAttendCell key={index} data={attend} className="w-11/12" />
        );
      })}

      <span
        className={cn(
          "self-start bg-pink-200 rounded-md py-1 px-2 text-xs ml-2",
          hidedItem > 0 ? "visible" : "hidden"
        )}
      >
        +{hidedItem}
      </span>

      <div
        className={cn(
          "w-full opacity-0 flex flex-col items-center justify-center absolute bottom-0 hover:opacity-100 ease-linear duration-100 cursor-pointer select-none",
          data.attendList.length === 0 || data.attendList.length > maxItem
            ? "h-full"
            : "",
          data.attendList.length === 1 ? "h-1/3 absolute bottom-0" : "",
          data.attendList.length === 2 ? "h-1/4 absolute bottom-0" : ""
        )}
      >
        <div
          className={cn(
            "w-full flex flex-row items-center justify-center bg-gray-100 hover:bg-green-400 hover:text-white hover:font-semibold backdrop-blur-sm text-gray-600 ease-linear duration-100 cursor-pointer select-none",
            data.attendList.length > maxItem ? "h-1/2" : "h-full"
          )}
          onClick={() => {
            if (handleOpenSetTimeDialog) handleOpenSetTimeDialog(data);
          }}
        >
          Set time
        </div>
        <div
          className={cn(
            "w-full h-1/2 flex flex-row items-center justify-center bg-gray-100 hover:bg-blue-400 hover:text-white hover:font-semibold backdrop-blur-sm text-gray-600 ease-linear duration-100 cursor-pointer select-none",
            data.attendList.length > maxItem ? "visible" : "hidden"
          )}
        >
          Expand
        </div>
      </div>
    </div>
  );
};

const StaffAttendCell = ({
  data,
  className,
}: {
  data: AttendanceRecord;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md p-2 ease-linear duration-200 cursor-pointer select-none",
        data.hasAttend
          ? "bg-blue-100 hover:bg-blue-200"
          : "bg-orange-100 hover:bg-orange-200",
        className
      )}
    >
      <span>{data.staffName}</span>
      <span className="text-xs">{`${
        data.hasAttend ? format(data.timeIn, "hh:mm") : "--:--"
      } ${data.hasAttend ? format(data.timeIn, "hh:mm") : "--:--"}`}</span>
    </div>
  );
};

export enum Status {
  Working = "Working",
  NotWorking = "Not working",
}

export type Shift = {
  id: any;
  name: string;
  workingTime: { start: Date; end: Date };
  editingTime: { start: Date; end: Date };
  dailyShiftList: DailyShift[];
  status: Status;
};

export type DailyShift = {
  date: Date;
  shiftId: any;
  shiftName: string;
  note: string;
  attendList: AttendanceRecord[];
};

export type AttendanceRecord = {
  staffId: any;
  staffName: string;
  hasAttend: boolean;
  date: Date;
  timeIn: Date;
  timeOut: Date;
  note: string;
};

const Table = dynamic(() => Promise.resolve(AttendanceTable), {
  ssr: false,
});

export { Table };

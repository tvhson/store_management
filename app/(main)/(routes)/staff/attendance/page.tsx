"use client";

import { Button } from "@/components/ui/button";
import {
  FilterDay,
  FilterMonth,
  FilterTime,
  FilterWeek,
} from "@/components/ui/filter";
import { Input } from "@/components/ui/input";
import { TimeFilterType, formatID, getStaticRangeFilterTime } from "@/utils";
import { AlignJustify, FileDown, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DisplayType, Shift, Status, Table } from "./attendance_table";
import { ButtonGroup } from "./button_group";
import { MyDateRangePicker } from "./my_date_range_picker";
import { SetTimeDialog } from "./set_time_dialog";
import { set } from "date-fns";
import { el } from "date-fns/locale";
import { Sex, Staff } from "@/entities/Staff";
import { BonusUnit, SalaryType } from "@/entities/SalarySetting";

const dataTable: Shift[] = [
  {
    id: 1,
    name: "Ca sang",
    status: Status.Working,
    workingTime: { start: new Date(), end: new Date() },
    editingTime: { start: new Date(), end: new Date() },
    dailyShiftList: [
      {
        shiftId: 1,
        shiftName: "Ca sang",
        date: new Date(),
        note: "",
        attendList: [],
      },
    ],
  },
  {
    id: 2,
    name: "Ca chieu",
    status: Status.Working,
    workingTime: { start: new Date(), end: new Date() },
    editingTime: { start: new Date(), end: new Date() },
    dailyShiftList: [
      {
        shiftId: 2,
        shiftName: "Ca chieu",
        date: new Date(),
        note: "",
        attendList: [],
      },
    ],
  },
];

const originalStaffList: Staff[] = [
  {
    avatar: "",
    id: 1,
    name: "Henry",
    email: "henry@gmail.com",
    address: "address",
    phoneNumber: "0123456789",
    note: "",
    sex: Sex.MALE,
    CCCD: "012301923012",
    birthday: new Date("2003-8-4"),
    createAt: new Date(),
    position: "Safe guard",
    salaryDebt: 0,
    salarySetting: {
      baseSalary: {
        value: 100000,
        salaryType: SalaryType.ByDay,
      },
      baseBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
      overtimeBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
    },
  },
  {
    avatar: "",
    id: 2,
    name: "Mary",
    email: "mary@gmail.com",
    address: "address Mary",
    phoneNumber: "0123456769",
    note: "",
    sex: Sex.FEMALE,
    CCCD: "012301923011",
    birthday: new Date("2003-4-4"),
    createAt: new Date(),
    position: "Cashier",
    salaryDebt: 0,
    salarySetting: {
      baseSalary: {
        value: 100000,
        salaryType: SalaryType.ByDay,
      },
      baseBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
      overtimeBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
    },
  },
  {
    avatar: "",
    id: 3,
    name: "David",
    email: "david@gmail.com",
    address: "address David",
    phoneNumber: "0124456789",
    note: "",
    sex: Sex.MALE,
    CCCD: "012301943012",
    birthday: new Date("2003-8-8"),
    createAt: new Date(),
    position: "Store Manager",
    salaryDebt: 0,
    salarySetting: {
      baseSalary: {
        value: 100000,
        salaryType: SalaryType.ByDay,
      },
      baseBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
      overtimeBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
    },
  },
];

export default function Attendance() {
  const [range, setRange] = useState<{ startDate: Date; endDate: Date }>(
    getStaticRangeFilterTime(FilterWeek.ThisWeek)
  );
  const [displayType, setDisplayType] = useState<DisplayType>("Week");
  const [table, setTable] = useState<Shift[]>([]);

  const [staffList, setStaffList] = useState<Staff[]>([]);
  useEffect(() => {
    const res = originalStaffList;
    const formattedData = res.map((row) => {
      const newRow = { ...row };
      newRow.id = formatID(newRow.id, "NV");
      return newRow;
    });
    setStaffList(formattedData);
  }, []);
  useEffect(() => {
    const res = dataTable;
    setTable(res);
  }, []);

  const handleRangeTimeFilterChange = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRange(range);
    setDisplayType("Month");
  };
  const handleStaticRangeFilterChange = (value: string) => {
    if (value === "Day") setRange(getStaticRangeFilterTime(FilterDay.Today));
    else if (value === "Week")
      setRange(getStaticRangeFilterTime(FilterWeek.ThisWeek));
    else setRange(getStaticRangeFilterTime(FilterMonth.ThisMonth));
    setDisplayType(value as DisplayType);
  };
  const handleSubmitOrUpdateShift = (value: Shift) => {
    const index = table.findIndex((shift) => shift.id === value.id);
    if (index !== -1) {
      const newTable = [...table];
      newTable[index] = value;
      setTable(newTable);
    } else {
      value.id = table.length + 1;
      setTable((prev) => [...prev, value]);
    }
  };

  return (
    <div className="text-sm flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Input placeholder="Search anything..." className="max-w-sm" />
          <MyDateRangePicker
            rangeTimeValue={range}
            onRangeTimeFilterChanged={handleRangeTimeFilterChange}
          />
          <ButtonGroup
            choices={["Day", "Week", "Month"]}
            defaultValue="Week"
            onValueChange={handleStaticRangeFilterChange}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <SetTimeDialog
            staffList={staffList}
            shiftList={table}
            triggerElement={
              <Button
                variant={"default"}
                className="bg-green-500 hover:bg-green-600 gap-2"
              >
                <Plus size={16} />
                <span>Set time</span>
              </Button>
            }
            submit={setTable}
          />
          <Button
            variant={"default"}
            className="bg-green-500 hover:bg-green-600 gap-2"
          >
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button
            variant={"default"}
            className="bg-green-500 hover:bg-green-600"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Table
        staffList={staffList}
        rangeDate={range}
        data={table}
        displayType={displayType}
        onUpdateShift={handleSubmitOrUpdateShift}
        onSetTime={setTable}
      />
    </div>
  );
}

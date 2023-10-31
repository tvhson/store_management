"use client";
import { nanoid } from "nanoid";

import { useEffect, useState } from "react";
import { DataTable } from "./datatable";

import { Button } from "@/components/ui/button";
import {
  ChoicesFilter,
  FilterDay,
  FilterMonth,
  FilterQuarter,
  FilterTime,
  FilterWeek,
  FilterYear,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import {
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionType,
} from "@/entities/Transaction";
import {
  getMinMaxOfListTime,
  getStaticRangeFilterTime,
  handleMultipleFilter,
  handleRangeFilter,
  handleSingleFilter,
} from "@/utils";
const originalSalesList: Transaction[] = [
  {
    id: nanoid(9).toUpperCase(),
    targetType: TargetType.CUSTOMER,
    targetName: "David",
    formType: FormType.RECEIPT,
    description: "Receive from Customer",
    transactionType: TransactionType.CASH,
    value: "100000",
    creator: "NGUYEN VAN A",
    createdDate: new Date(),
    status: Status.PAID,
    note: "",
  },
  {
    id: nanoid(9).toUpperCase(),
    targetType: TargetType.CUSTOMER,
    targetName: "Henry",
    formType: FormType.RECEIPT,
    description: "Receive from Customer",
    transactionType: TransactionType.TRANSFER,
    value: "200000",
    creator: "NGUYEN VAN B",
    createdDate: new Date(),
    status: Status.CANCELLED,
    note: "",
  },
  {
    id: nanoid(9).toUpperCase(),
    targetType: TargetType.SUPPLIER,
    targetName: "Mary",
    formType: FormType.EXPENSE,
    description: "Pay for Supplier",
    transactionType: TransactionType.TRANSFER,
    value: "20000000",
    creator: "NGUYEN VAN C",
    createdDate: new Date(),
    status: Status.PAID,
    note: "",
  },
];

export default function SalesPage() {
  const [salesList, setSalesList] = useState<Transaction[]>([]);
  const [filteredSaleList, setFilterSaleList] = useState<Transaction[]>([]);
  const [multiFilter, setMultiFilter] = useState({
    transactionType: [] as string[],
    formType: [] as string[],
    status: [] as string[],
    creator: [] as string[],
    targetType: [] as string[],
    targetName: [] as string[],
  });
  const [singleFilter, setSingleFilter] = useState({
    createdDate: FilterYear.AllTime as FilterTime,
  });
  const [rangeFilter, setRangeFilter] = useState({
    createdDate: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // hook use effect
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const res = originalSalesList;
        setSalesList(res);
      }, 1000);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredList = [...salesList];
    filteredList = handleMultipleFilter<Transaction>(multiFilter, filteredList);
    filteredList = handleRangeFilter<Transaction>(rangeFilter, filteredList);

    setFilterSaleList([...filteredList]);
  }, [multiFilter, rangeFilter, salesList]);

  //function
  function handleFormSubmit(values: Transaction) {
    setSalesList((prev) => [...prev, values]);
  }

  const updateCreatedDateRangeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeFilter((prev) => ({ ...prev, createdDate: range }));
  };

  const updateCreatedDateStaticRangeFilter = (value: FilterTime) => {
    setSingleFilter((prev) => ({ ...prev, createdDate: value }));

    //the purpose of this area is just to get min date and max date to cover case FilterTime.Alltime
    const rangeTime: { minDate: Date; maxDate: Date } = getMinMaxOfListTime(
      salesList.map((row) => row.createdDate)
    );
    //--------------------------------------------------------------------------------------------
    const range: { startDate: Date; endDate: Date } = getStaticRangeFilterTime(
      value,
      rangeTime.minDate,
      rangeTime.maxDate
    );

    setRangeFilter((prev) => ({
      ...prev,
      createdDate: range,
    }));
  };
  const updateTransactionTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, transactionType: values }));
  };
  const updateFormTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, formType: values }));
  };
  const updateStatusMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, status: values }));
  };
  const updateCreatorMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, creator: values }));
  };
  const updateTargetTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, targetType: values }));
  };
  const updateTargetNameMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, targetName: values }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <TimeFilter
        key={1}
        title="Date Modified"
        rangeTimeValue={rangeFilter.createdDate}
        singleTimeValue={singleFilter.createdDate}
        onRangeTimeFilterChanged={updateCreatedDateRangeFilter}
        onSingleTimeFilterChanged={updateCreatedDateStaticRangeFilter}
      />
      <ChoicesFilter
        key={2}
        title="Transaction Type"
        choices={Object.values(TransactionType)}
        isSingleChoice={false}
        defaultValues={multiFilter.transactionType}
        onMultiChoicesChanged={updateTransactionTypeMultiFilter}
      />

      <ChoicesFilter
        key={3}
        title="Form Type"
        choices={Object.values(FormType)}
        isSingleChoice={false}
        defaultValues={multiFilter.formType}
        onMultiChoicesChanged={updateFormTypeMultiFilter}
      />

      <ChoicesFilter
        key={4}
        title="Status"
        choices={Object.values(Status)}
        isSingleChoice={false}
        defaultValues={multiFilter.status}
        onMultiChoicesChanged={updateStatusMultiFilter}
      />

      <SearchFilter
        key={5}
        choices={Array.from(new Set(salesList.map((row) => row.creator)))}
        chosenValues={multiFilter.creator}
        title="Creator"
        placeholder="Select creator"
        onValuesChanged={updateCreatorMultiFilter}
      />

      <ChoicesFilter
        key={6}
        title="Receiver/Payer Type"
        choices={Object.values(TargetType)}
        isSingleChoice={false}
        defaultValues={multiFilter.targetType}
        onMultiChoicesChanged={updateTargetTypeMultiFilter}
      />

      <SearchFilter
        key={7}
        title="Receiver/Payer"
        chosenValues={multiFilter.targetName}
        choices={Array.from(new Set(salesList.map((row) => row.targetName)))}
        placeholder="Select reveiver/payer"
        alwaysOpen
        onValuesChanged={updateTargetNameMultiFilter}
      />
    </div>,
  ];

  const headerButtons = [<Button key={0}>More+</Button>];

  return (
    <PageWithFilters
      title="Fund Ledger"
      filters={filters}
      headerButtons={headerButtons}
    >
      <DataTable data={filteredSaleList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}

"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { nanoid } from "nanoid";

import { Combobox } from "@/components/ui/combobox";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { AddCustomerDialog } from "./add_customer_dialog";
import {
  Customer,
  CustomerType,
  Sex,
  Status,
  getFinalSale,
} from "@/entities/Customer";
import {
  ChoicesFilter,
  FilterTime,
  FilterYear,
  PageWithFilters,
  RangeFilter,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import {
  getMinMaxOfListTime,
  getStaticRangeFilterTime,
  handleMultipleFilter,
  handleRangeTimeFilter,
  handleSingleFilter,
} from "@/utils";

const originalCustomerList: Customer[] = [
  {
    id: nanoid(9).toUpperCase(),
    name: "David Silva",
    customerType: CustomerType.SINGLE,
    customerGroup: "",
    phoneNumber: "0123456789",
    address: "222 ABC Street",
    sex: Sex.MALE,
    email: "david@gmail.com",
    birthday: new Date(),
    creator: "",
    createdDate: new Date(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date(),
    debt: 100000,
    sale: 2000000,
    finalSale: 1900000,
    status: Status.WORKING,
    image: "",
  },
  {
    id: nanoid(9).toUpperCase(),
    name: "Harry",
    customerType: CustomerType.SINGLE,
    customerGroup: "",
    phoneNumber: "0123456789",
    address: "222 ABC Street",
    sex: Sex.MALE,
    email: "harry@gmail.com",
    birthday: new Date(),
    creator: "",
    createdDate: new Date(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date(),
    debt: 0,
    sale: 0,
    finalSale: 0,
    status: Status.NOT_WORKING,
    image: "",
  },
  {
    id: nanoid(9).toUpperCase(),
    name: "John",
    customerType: CustomerType.SINGLE,
    customerGroup: "",
    phoneNumber: "0123456789",
    address: "222 ABC Street",
    sex: Sex.MALE,
    email: "john@gmail.com",
    birthday: new Date(),
    creator: "",
    createdDate: new Date(),
    company: "ABC Company",
    taxId: nanoid(9),
    note: "",
    lastTransaction: new Date(),
    debt: 100000,
    sale: 2000000,
    finalSale: 1900000,
    status: Status.WORKING,
    image: "",
  },
];

export default function CustomerPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [filteredCustomerList, setFilteredCustomerList] = useState<Customer[]>(
    []
  );
  const [multiFilter, setMultiFilter] = useState({
    customerGroup: [] as string[],
    customerType: [] as string[],
    sale: [] as number[],
    debt: [] as number[],
    sex: [] as string[],
    status: [] as string[],
  });
  const [singleFilter, setSingleFilter] = useState({
    createdDate: FilterYear.AllTime as FilterTime,
    birthday: FilterYear.AllTime as FilterTime,
    lastTransaction: FilterYear.AllTime as FilterTime,
  });
  const [rangeTimeFilter, setRangeTimeFilter] = useState({
    createdDate: {
      startDate: new Date(),
      endDate: new Date(),
    },
    birthday: {
      startDate: new Date(),
      endDate: new Date(),
    },
    lastTransaction: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  useEffect(() => {
    setCustomerList(originalCustomerList);
  }, []);

  useEffect(() => {
    var filteredList = [...customerList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);
    filteredList = handleRangeTimeFilter(rangeTimeFilter, filteredList);

    setFilteredCustomerList([...filteredList]);
  }, [multiFilter, rangeTimeFilter, customerList]);

  function handleFormSubmit(values: Customer) {
    setCustomerList((prev) => [...prev, values]);
  }

  const updateCustomerGroupMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, customerGroup: values }));
  };

  const updateCreatedDateStaticRangeFilter = (value: FilterTime) => {
    setSingleFilter((prev) => ({ ...prev, createdDate: value }));

    //the purpose of this area is just to get min date and max date to cover case FilterTime.Alltime
    const rangeTime: { minDate: Date; maxDate: Date } = getMinMaxOfListTime(
      customerList.map((row) => row.createdDate)
    );
    //--------------------------------------------------------------------------------------------
    const range: { startDate: Date; endDate: Date } = getStaticRangeFilterTime(
      value,
      rangeTime.minDate,
      rangeTime.maxDate
    );

    setRangeTimeFilter((prev) => ({
      ...prev,
      createdDate: range,
    }));
  };
  const updateCreatedDateRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, createdDate: range }));
  };
  const updateBirthdayRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, birthday: range }));
  };
  const updateBirthdayStaticRangeFilter = (value: FilterTime) => {
    setSingleFilter((prev) => ({ ...prev, birthday: value }));

    //the purpose of this area is just to get min date and max date to cover case FilterTime.Alltime
    const rangeTime: { minDate: Date; maxDate: Date } = getMinMaxOfListTime(
      customerList.map((row) => row.birthday)
    );
    //--------------------------------------------------------------------------------------------
    const range: { startDate: Date; endDate: Date } = getStaticRangeFilterTime(
      value,
      rangeTime.minDate,
      rangeTime.maxDate
    );

    setRangeTimeFilter((prev) => ({
      ...prev,
      birthday: range,
    }));
  };
  const updateLastTransactionRangeTimeFilter = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeTimeFilter((prev) => ({ ...prev, lastTransaction: range }));
  };
  const updateLastTransactionStaticRangeFilter = (value: FilterTime) => {
    setSingleFilter((prev) => ({ ...prev, lastTransaction: value }));

    //the purpose of this area is just to get min date and max date to cover case FilterTime.Alltime
    const rangeTime: { minDate: Date; maxDate: Date } = getMinMaxOfListTime(
      customerList.map((row) => row.lastTransaction)
    );
    //--------------------------------------------------------------------------------------------
    const range: { startDate: Date; endDate: Date } = getStaticRangeFilterTime(
      value,
      rangeTime.minDate,
      rangeTime.maxDate
    );

    setRangeTimeFilter((prev) => ({
      ...prev,
      lastTransaction: range,
    }));
  };
  const updateSaleFilter = (values: string[]) => {
    const ivalues: number[] = values.map((value) => Number.parseInt(value));
    setMultiFilter((prev) => ({ ...prev, sale: ivalues }));
  };
  const updateDebtFilter = (values: string[]) => {
    const ivalues: number[] = values.map((value) => Number.parseInt(value));
    setMultiFilter((prev) => ({ ...prev, debt: ivalues }));
  };
  const updateCustomerTypeMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, customerType: values }));
  };
  const updateSexMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, sex: values }));
  };
  const updateStatusMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, status: values }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <SearchFilter
        key={1}
        title="Customer Group"
        placeholder="Select customer group"
        choices={Array.from(
          new Set(customerList.map((customer) => customer.customerGroup))
        )}
        chosenValues={multiFilter.customerGroup}
        onValuesChanged={updateCustomerGroupMultiFilter}
      />
      <TimeFilter
        key={2}
        title="Date Modified"
        singleTimeValue={singleFilter.createdDate}
        rangeTimeValue={rangeTimeFilter.createdDate}
        onRangeTimeFilterChanged={updateCreatedDateRangeTimeFilter}
        onSingleTimeFilterChanged={updateCreatedDateStaticRangeFilter}
      />
      <TimeFilter
        key={3}
        title="Birthday"
        singleTimeValue={singleFilter.birthday}
        rangeTimeValue={rangeTimeFilter.birthday}
        onRangeTimeFilterChanged={updateBirthdayRangeTimeFilter}
        onSingleTimeFilterChanged={updateBirthdayStaticRangeFilter}
      />
      <TimeFilter
        key={4}
        title="Last Transaction"
        singleTimeValue={singleFilter.lastTransaction}
        rangeTimeValue={rangeTimeFilter.lastTransaction}
        onRangeTimeFilterChanged={updateLastTransactionRangeTimeFilter}
        onSingleTimeFilterChanged={updateLastTransactionStaticRangeFilter}
      />
      <ChoicesFilter
        key={5}
        title="Customer Type"
        choices={Object.values(CustomerType)}
        isSingleChoice={false}
        defaultValues={multiFilter.customerType}
        onMultiChoicesChanged={updateCustomerTypeMultiFilter}
      />
      <ChoicesFilter
        key={6}
        title="Sex"
        choices={Object.values(Sex)}
        isSingleChoice={false}
        defaultValues={multiFilter.sex}
        onMultiChoicesChanged={updateSexMultiFilter}
      />
      <ChoicesFilter
        key={7}
        title="Status"
        choices={Object.values(Status)}
        isSingleChoice={false}
        defaultValues={multiFilter.status}
        onMultiChoicesChanged={updateStatusMultiFilter}
      />
    </div>,
  ];

  return (
    <PageWithFilters title="Customer" filters={filters} headerButtons={[]}>
      <DataTable data={filteredCustomerList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { ChoicesFilter, PageWithFilters } from "@/components/ui/filter";
import { Report } from "@/entities/Report";
import { FormType } from "@/entities/Transaction";
import { formatID } from "@/utils";
import { useEffect, useState } from "react";
import {
  fundReportColumnHeaders,
  goodsReportColumnHeaders,
  saleReportColumnHeaders,
} from "./pdf_columns";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDFDownloader, ReportPDFViewer } from "@/components/ui/pdf";

const originalSaleReportList: any[] = [];
const originalFundReportList: any[] = [];
const originalGoodsReportList: any[] = [];
//create copied data
for (let i = 0; i < 50; i++) {
  originalSaleReportList.push({
    transactionId: i,
    time: new Date(),
    quantity: 20 * i,
    revenue: 200000 * i,
    otherFees: 10000,
    totalSale: 200000 * i - 10000,
  });
}

for (let i = 0; i < 50; i++) {
  originalFundReportList.push({
    formId: i,
    formType: FormType.EXPENSE,
    targetName: "Nguyen Van A",
    time: new Date(),
  });
}
for (let i = 0; i < 50; i++) {
  originalGoodsReportList.push({
    goodsId: i,
    goodsName: "Banh gao AOne",
    sellQuantity: i * 20,
    revenue: i * 20 * 15000,
    returnQuantity: i * 2,
    returnValue: i * 2 * 15000,
    netRevenue: i * 18 * 15000,
  });
}

enum Concern {
  SALE = "Sale",
  FUND = "Fund",
  GOODS = "Goods",
}

export default function DailyReportLayout() {
  const [loading, setLoading] = useState(true);
  const [singleFilter, setSingleFilter] = useState({
    concern: Concern.SALE as string,
  });
  const [dailyReport, setDailyReport] = useState<Report>({
    headerData: {
      title: "Daily Report",
      createdDate: new Date(),
      branch: "Center",
      saleDate: new Date(),
    },
    columnHeaders: {},
    contentData: [],
  });

  useEffect(() => {
    const fetchSaleReportData = async () => {
      const res = originalSaleReportList;
      const formatedData = res.map((row) => {
        const newRow = { ...row };
        newRow.transactionId = formatID(newRow.transactionId, "MDD");
        return newRow;
      });
      setDailyReport((prev) => ({
        headerData: {
          ...prev.headerData,
          title: "Daily report about sale",
          createdDate: new Date(),
          saleDate: new Date(),
        },
        columnHeaders: saleReportColumnHeaders,
        contentData: formatedData,
      }));
    };
    const fetchFundReportData = async () => {
      const res = originalFundReportList;
      const formatedData = res.map((row) => {
        const newRow = { ...row };
        newRow.formId = formatID(newRow.formId, "MP");
        return newRow;
      });
      setDailyReport((prev) => ({
        headerData: {
          ...prev.headerData,
          title: "Daily report about fund",
          createdDate: new Date(),
          saleDate: new Date(),
        },
        columnHeaders: fundReportColumnHeaders,
        contentData: formatedData,
      }));
    };
    const fetchGoodsReportData = async () => {
      const res = originalGoodsReportList;
      const formatedData = res.map((row) => {
        const newRow = { ...row };
        newRow.goodsId = formatID(newRow.goodsId, "MHH");
        return newRow;
      });
      setDailyReport((prev) => ({
        headerData: {
          ...prev.headerData,
          title: "Daily report about goods",
          createdDate: new Date(),
          saleDate: new Date(),
        },
        columnHeaders: goodsReportColumnHeaders,
        contentData: formatedData,
      }));
    };
    setLoading(true);
    if (singleFilter.concern === Concern.SALE) fetchSaleReportData();
    else if (singleFilter.concern === Concern.FUND) fetchFundReportData();
    else if (singleFilter.concern === Concern.GOODS) fetchGoodsReportData();
    setLoading(false);
  }, [singleFilter]);

  const updateConcernSingleFilter = (value: string) => {
    setSingleFilter((prev) => ({ ...prev, concern: value }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <ChoicesFilter
        title="Concern"
        key={1}
        isSingleChoice={true}
        choices={Object.values(Concern)}
        defaultValue={singleFilter.concern}
        onSingleChoiceChanged={updateConcernSingleFilter}
      />
    </div>,
  ];

  return (
    <PageWithFilters
      filters={filters}
      title="Daily Report"
    >
      <div className="flex flex-col space-y-4">
        <ReportPDFDownloader data={dailyReport} classname="self-end" />
        <ReportPDFViewer
          data={dailyReport}
          classname="w-full h-[1000px] bg-black"
        />
      </div>
    </PageWithFilters>
  );
}

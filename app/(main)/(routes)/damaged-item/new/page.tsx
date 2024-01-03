"use client";
import CustomCombobox from "@/components/component/CustomCombobox";
import SearchView from "@/components/component/SearchView";
import { CustomDatatable } from "@/components/component/custom_datatable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/loading_circle";
import PropertiesString from "@/components/ui/properties_string_view";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/entities/Product";
import { Staff } from "@/entities/Staff";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setProducts } from "@/reducers/productsReducer";
import { setStaffs } from "@/reducers/staffReducer";
import { setSuppliers } from "@/reducers/suppliersReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import DamagedItemService from "@/services/damagedItemService";
import ProductService from "@/services/productService";
import StaffService from "@/services/staff_service";
import SupplierService from "@/services/supplierService";
import { format } from "date-fns";
import { Check, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  NewDamagedItemDetail,
  purchaseReturnDetailColumnTitles,
  purchaseReturnDetailTableColumns,
} from "./table_columns";

const ProductSearchItemView: (product: Product) => React.ReactNode = (
  product: Product,
) => {
  return (
    <div className="m-1 flex flex-row items-center gap-2 rounded-sm p-1 px-4 hover:cursor-pointer hover:bg-blue-200">
      <img
        className="h-10 w-10 border object-contain object-center"
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : "/default-product-img.jpg"
        }
      />
      <div className="flex flex-1 flex-col text-sm">
        <p className="font-semibold">
          {product.name}
          <PropertiesString
            propertiesString={product.propertiesString}
            className="ml-1"
          />
        </p>
        <p>ID: {product.id}</p>
        <p>In stock: {product.stock}</p>
      </div>
      <p className="text-base text-blue-400">
        {product.productPrice}/{product.salesUnits.name}
      </p>
    </div>
  );
};

export default function NewPurchaseOrderPage() {
  const products = useAppSelector((state) => state.products.value);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [details, setDetails] = useState<NewDamagedItemDetail[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [note, setNote] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  const staffs = useAppSelector((state) => state.staffs.value);
  const suppliers = useAppSelector((state) => state.suppliers.value);
  // TODO: staff not nullable
  const profile = useAppSelector((state) => state.profile.value);
  const [staff, setStaff] = useState<Staff | null>(profile);
  const [createdDate, setCreatedDate] = useState<Date>(new Date());
  const [staffSearch, setStaffSearch] = useState<string>("");

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));
      const suppliers = await SupplierService.getAllSuppliers();
      dispatch(setSuppliers(suppliers.data));
      const products = await ProductService.getAllProducts();
      dispatch(setProducts(products.data));
    };

    fetchData()
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const onSearchViewProductClicked = (product: Product) => {
    const foundProduct = details.find(
      (detail) => detail.productId === product.id,
    );
    if (!foundProduct)
      setDetails((prev) => [
        ...prev,
        {
          quantity: 1,
          productId: product.id,
          productName: product.name,
          unit: product.salesUnits.name,
          note: "",
          price: product.originalPrice,
        },
      ]);
    else onDetailQuantityChanged(product.id, foundProduct.quantity + 1);
  };

  const onDetailQuantityChanged = (productId: number, newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity < 0) newQuantity = 0;
    setDetails((prev) =>
      prev.map((detail) => {
        return detail.productId === productId
          ? {
              ...detail,
              quantity: newQuantity,
            }
          : detail;
      }),
    );
  };

  const onDetailNoteChanged = (productId: number, newNote: string) => {
    setDetails((prev) =>
      prev.map((detail) => {
        return detail.productId === productId
          ? {
              ...detail,
              note: newNote,
            }
          : detail;
      }),
    );
  };

  const onDetailReturnPriceChanged = (productId: number, newPrice: number) => {
    setDetails((prev) =>
      prev.map((detail) => {
        return detail.productId === productId
          ? {
              ...detail,
              returnPrice: newPrice,
            }
          : detail;
      }),
    );
  };

  const deleteRows = async (data: NewDamagedItemDetail[]) => {
    const productIds = data.map((d) => d.productId);
    setDetails((prev) =>
      prev.filter((detail) => productIds.includes(detail.productId)),
    );
    return Promise.resolve();
  };

  const onCompleteButtonClick = async () => {
    if (!staff)
      return toast({
        variant: "destructive",
        description: "Please choose a staff!",
      });

    if (details.filter((v) => v.quantity > 0).length === 0)
      return toast({
        variant: "destructive",
        description: "Document is empty!",
      });

    await DamagedItemService.uploadDamagedItemDocument({
      products: details.filter((v) => v.quantity > 0).map((v) => ({ ...v })),
      note: note,
      createdDate: format(createdDate, "yyyy-MM-dd HH:mm:ss"),
      creatorId: staff.id,
    })
      .then((result) => {
        router.push("/damaged-item");
      })
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => setIsCompleting(false));
  };

  const MSearchView = (
    <SearchView
      placeholder="Find products by id or name"
      className="max-w-[400px] flex-1"
      triggerClassname="border"
      choices={products}
      onSearchChange={(value) => setProductSearch(value)}
      itemView={ProductSearchItemView}
      onItemClick={onSearchViewProductClicked}
      filter={(product) =>
        product.id.toString().includes(productSearch) ||
        product.name.includes(productSearch)
      }
      zIndex={8}
    />
  );

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-1 flex-col gap-2 bg-white p-4">
        <h2 className="my-4 text-start text-2xl font-bold">
          New damaged item document
        </h2>
        <CustomDatatable
          data={details}
          columns={purchaseReturnDetailTableColumns(
            onDetailQuantityChanged,
            onDetailNoteChanged,
            onDetailReturnPriceChanged,
          )}
          columnTitles={purchaseReturnDetailColumnTitles}
          config={{
            alternativeSearchInput: MSearchView,
            onDeleteRowsBtnClick: deleteRows,
          }}
        />
      </div>
      <div className="flex h-[calc(100vh-1rem)] w-[300px] flex-col gap-4 bg-white p-2">
        <div className="flex">
          <CustomCombobox<Staff>
            searchPlaceholder={"Find staff..."}
            value={staff}
            choices={staffs}
            valueView={CreatorView}
            itemSearchView={(choice) => StaffSearchView(choice, staff)}
            onSearchChange={setStaffSearch}
            filter={(st) =>
              st.id.toString().includes(staffSearch) ||
              st.name.includes(staffSearch)
            }
            onItemClick={setStaff}
            startIcon={<UserCircle size={16} />}
            className="flex-1"
          />
          <input
            type="datetime-local"
            value={format(createdDate, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) =>
              setCreatedDate(e.currentTarget.valueAsDate ?? new Date())
            }
            className="ml-1 border px-1 text-[0.7rem]"
          ></input>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">Total quantity:</p>
          <p>{details.map((v) => v.quantity).reduce((a, b) => a + b, 0)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm">Total damaged value:</p>
          <p className="text-xl font-bold">
            {details
              .map((v) => v.price * v.quantity)
              .reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <Input
          placeholder="Note..."
          className="h-[50px] w-full"
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
        />
        <div className="flex-1"></div>
        <Button
          variant={"green"}
          className="h-16 tracking-wide"
          onClick={onCompleteButtonClick}
        >
          COMPLETE{isCompleting ? <LoadingCircle /> : null}
        </Button>
      </div>
    </div>
  );
}

const CreatorView = (staff: Staff | null): React.ReactNode => {
  return (
    <div className="flex-1">
      <p className=" whitespace-nowrap text-xs">{staff?.name ?? ""}</p>
    </div>
  );
};

const StaffSearchView = (
  staff: Staff,
  chosenStaff: Staff | null,
): React.ReactNode => {
  const chosen = chosenStaff && staff.id === chosenStaff.id;
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between px-1 hover:bg-green-100",
        chosen ? "bg-green-200" : "",
      )}
    >
      <div>
        <p className="text-sm">{staff.name}</p>
        <p className="text-xs">Id: {staff.id}</p>
      </div>
      {chosen ? <Check size={16} color="green" /> : null}
    </div>
  );
};

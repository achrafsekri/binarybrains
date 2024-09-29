import { useContext } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { invoiceFormContext } from "./CreateInvoiceForm";

export default function ProductsTable() {
  const form = useContext(invoiceFormContext);
  //@ts-expect-error
  const { register, watch, setValue, getValues } = form;

  const removeProduct = (index: number) => {
    const ProductsList = getValues("ProductsList");
    setValue(
      "ProductsList",
      ProductsList.filter((_, i) => i !== index),
    );
  };
  const addProduct = () => {
    const ProductsList = getValues("ProductsList");
    setValue("ProductsList", [
      ...ProductsList,
      {
        name: "", // Default product name
        quantity: 1, // Default quantity
        unitPrice: 0, // Default unit price
        totalPrice: 0, // Default total price
        vatRate: 0, // Optional VAT rate, default is null
      },
    ]);
  };
  // Watching form values
  watch("Settings");
  watch("ProductsList");
  const showQuantity = getValues("Settings.showQuantity");
  const ProductsDetails = getValues("ProductsList");
  const VatPerUnit = getValues("Settings.vatPerItem");
  const VatActivated = getValues("Settings.vatActivated");
  const vat = VatActivated && VatPerUnit;

  const handleProductChange = (index: number, field: string, value: any) => {
    const ProductsList = getValues("ProductsList");
    setValue(
      "ProductsList",
      ProductsList.map((product, i) => ({
        ...product,
        [field]: i === index ? value : product[field],
        totalPrice:
          i === index
            ? (showQuantity ? product.quantity : 1) * product.unitPrice
            : product.totalPrice,
      })),
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=""></TableHead>
            <TableHead className="w-4/12">Product Name</TableHead>
            {showQuantity && (
              <TableHead className="text-left">Quantity</TableHead>
            )}
            {vat && <TableHead className="text-left">VAT Rate</TableHead>}

            <TableHead className="text-left">Unit Price</TableHead>

            <TableHead className="text-left">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
          {ProductsDetails?.map((product, index) => (
            <TableRow key={index} className={cn("group")}>
              <TableCell>
                <Button
                  onClick={() => removeProduct(index)}
                  variant={"ghost"}
                  className="invisible size-fit justify-end border-none p-1 text-primary hover:bg-transparent hover:text-primary group-hover:visible"
                >
                  <Minus className="size-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Input
                  value={product.name}
                  className="no-spinner size-full border-none"
                  type="text"
                  {...register(`ProductsList.${index}.name`)}
                  onChange={(e) =>
                    handleProductChange(index, "name", e.target.value)
                  }
                />
              </TableCell>
              {showQuantity && (
                <TableCell className="text-left">
                  <Input
                    value={product.quantity}
                    className="no-spinner size-full border-none"
                    type="number"
                    min={0}
                    {...register(`ProductsList.${index}.quantity`)}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                  />
                </TableCell>
              )}
              {vat && (
                <TableCell className="flex text-left">
                  <Input
                    value={product.vatRate}
                    className="no-spinner size-full border-none"
                    type="number"
                    min={0}
                    max={100}
                    {...register(`ProductsList.${index}.vatRate`)}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "vatRate",
                        parseFloat(e.target.value),
                      )
                    }
                  />
                  %
                </TableCell>
              )}
              <TableCell className="text-left">
                <Input
                  value={product.unitPrice}
                  className="no-spinner size-full border-none"
                  type="number"
                  min={0}
                  {...register(`ProductsList.${index}.unitPrice`)}
                  onChange={(e) =>
                    handleProductChange(index, "unitPrice", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="text-left">
                <p>{product.unitPrice * product.quantity}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="group flex w-full justify-center">
        <Button
          variant={"ghost"}
          //@ts-ignore
          onClick={() => addProduct()}
          className={cn(
            "invisible size-fit rounded-full p-2 text-primary hover:text-primary",
            "group-hover:visible",
          )}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </>
  );
}

import { useContext } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
      ProductsList.filter((_: any, i: any) => i !== index),
    );
  };
  const addProduct = () => {
    const ProductsList = getValues("ProductsList");
    setValue("ProductsList", [
      ...ProductsList,
      {
        name: "", // Default product name
        quantity: "1", // Default quantity
        unitPrice: "0", // Default unit price
        totalPrice: 0, // Default total price
        vatRate: "0", // Optional VAT rate, default is null
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
      ProductsList.map((product: any, i: number) => ({
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
          <TableRow className="bg-gray-800 text-sm text-white hover:bg-gray-800 lg:text-base">
            <TableHead className="text-white"></TableHead>
            <TableHead className="w-4/12 text-left text-white">
              Description
            </TableHead>
            {showQuantity && (
              <TableHead className="text-left text-white">Quantité</TableHead>
            )}
            {vat && <TableHead className="text-left text-white">TVA</TableHead>}

            <TableHead className="text-left text-white">Prix</TableHead>

            <TableHead className="text-left text-white">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 text-2xs md:text-sm">
          {ProductsDetails?.map((product: any, index: number) => (
            <TableRow key={`${index}`} className={cn("group")}>
              <TableCell>
                <Button
                  onClick={() => removeProduct(index)}
                  variant={"ghost"}
                  className="size-fit justify-end border-none p-1 text-primary hover:bg-gray-50 hover:text-primary"
                >
                  <Minus className="size-4" />
                </Button>
              </TableCell>
              <TableCell>
                <input
                  value={product.name}
                  className="no-spinner size-full rounded-md border-none bg-gray-50 p-1 py-2 text-left"
                  type="text"
                  {...register(`ProductsList.${index}.name`)}
                  onChange={(e) =>
                    handleProductChange(index, "name", e.target.value)
                  }
                  placeholder="Nom du produit"
                />
              </TableCell>
              {showQuantity && (
                <TableCell className="text-left">
                  <input
                    value={product.quantity}
                    className="no-spinner size-full rounded-md border-none bg-gray-50 p-1 py-2"
                    type="number"
                    min={0}
                    {...register(`ProductsList.${index}.quantity`)}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                    placeholder="Quantité"
                  />
                </TableCell>
              )}
              {vat && (
                <TableCell className="flex items-center text-left">
                  <input
                    value={product.vatRate}
                    className="no-spinner size-full rounded-md border-none bg-gray-50 p-1 py-2"
                    type="number"
                    min={0}
                    max={100}
                    {...register(`ProductsList.${index}.vatRate`)}
                    onChange={(e) =>
                      handleProductChange(index, "vatRate", e.target.value)
                    }
                    placeholder="TVA"
                  />
                  %
                </TableCell>
              )}
              <TableCell className="text-left">
                <input
                  value={product.unitPrice}
                  className="no-spinner size-full rounded-md border-none bg-gray-50 p-1 py-2"
                  type="number"
                  min={0}
                  {...register(`ProductsList.${index}.unitPrice`)}
                  onChange={(e) =>
                    handleProductChange(index, "unitPrice", e.target.value)
                  }
                  placeholder="Prix unitaire"
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
          type="button"
          //@ts-ignore
          onClick={() => addProduct()}
          className={cn(
            "size-fit rounded-full p-2 text-primary hover:text-primary",
          )}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </>
  );
}

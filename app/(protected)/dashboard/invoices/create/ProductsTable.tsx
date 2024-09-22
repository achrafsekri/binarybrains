import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductsTable (){
    return(
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Description</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Website Design</TableCell>
            <TableCell className="text-right">1</TableCell>
            <TableCell className="text-right">$1,000.00</TableCell>
            <TableCell className="text-right">$1,000.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Logo Design</TableCell>
            <TableCell className="text-right">1</TableCell>
            <TableCell className="text-right">$500.00</TableCell>
            <TableCell className="text-right">$500.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Hosting (per year)</TableCell>
            <TableCell className="text-right">1</TableCell>
            <TableCell className="text-right">$200.00</TableCell>
            <TableCell className="text-right">$200.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
}
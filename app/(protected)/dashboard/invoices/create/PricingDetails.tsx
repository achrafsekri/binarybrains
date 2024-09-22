
export default function PricingDetails(){
    return(
        <div className="mt-8 flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Subtotal</span>
            <span className="text-gray-800">$1,700.00</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">VAT (20%)</span>
            <span className="text-gray-800">$340.00</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span className="text-gray-800">Total</span>
            <span className="text-gray-800">$2,040.00</span>
          </div>
        </div>
      </div>
    )
}
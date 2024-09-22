
export default function SellerForm() {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex size-16 items-center justify-center rounded-full bg-gray-200 text-gray-500">
        Logo
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Company Name</h1>
        <p className="text-sm text-gray-600">
          123 Company Street, City, Country
        </p>
        <p className="text-sm text-gray-600">SIRET: 123 456 789 00000</p>
        <p className="text-sm text-gray-600">VAT: FR12345678900</p>
        <p className="text-sm text-gray-600">Phone: +1 234 567 890</p>
      </div>
    </div>
  );
}

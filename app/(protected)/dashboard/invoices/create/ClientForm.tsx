
export default function ClientForm( ){
    return(
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Client Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-gray-700">Client Name:</p>
            <p className="text-gray-600">John Doe</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Company:</p>
            <p className="text-gray-600">Client Company Ltd.</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Address:</p>
            <p className="text-gray-600">456 Client Street, Client City, Client Country</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Contact:</p>
            <p className="text-gray-600">+1 987 654 321</p>
          </div>
        </div>
      </div>
    )
}
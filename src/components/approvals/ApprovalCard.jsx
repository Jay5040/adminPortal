import { useState } from 'react';

const ApprovalCard = ({ product, onApprove, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason);
      setRejectionReason('');
      setShowRejectForm(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <img 
              src={product.thumbnailUrl} 
              alt={product.title} 
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-500">
                By {product.seller?.name || 'Unknown Seller'} • {new Date(product.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Category:</span> {product.category}
                </p>
                <p className="text-sm">
                  <span className="font-medium">File Size:</span> {formatFileSize(product.fileSize)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">File Type:</span> {product.fileType}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Price:</span> ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Approval Needed
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm">Description:</h4>
          <p className="text-gray-700 text-sm mt-1">{product.description}</p>
        </div>
        
        <div className="mt-6 flex items-center space-x-4">
          <button
            onClick={onApprove}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Approve File
          </button>
          
          {!showRejectForm ? (
            <button
              onClick={() => setShowRejectForm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reject File
            </button>
          ) : (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide reason for rejection..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleReject}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
              >
                Reject
              </button>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-2 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;

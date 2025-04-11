import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import ApprovalCard from '../components/approvals/ApprovalCard';

const ApprovalQueue = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/pending-approvals');
      setPendingApprovals(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await axiosInstance.put(`/admin/approve-file/${productId}`);
      // Remove from pending list
      setPendingApprovals(pendingApprovals.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error approving file:', error);
    }
  };

  const handleReject = async (productId, reason) => {
    try {
      await axiosInstance.put(`/admin/reject-file/${productId}`, { reason });
      // Remove from pending list
      setPendingApprovals(pendingApprovals.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error rejecting file:', error);
    }
  };

  if (loading) {
    return <div>Loading approval queue...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">File Approval Queue</h1>
      
      {pendingApprovals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-gray-900">No files pending approval</h3>
          <p className="mt-1 text-sm text-gray-500">All files have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingApprovals.map(product => (
            <ApprovalCard 
              key={product._id}
              product={product}
              onApprove={() => handleApprove(product._id)}
              onReject={(reason) => handleReject(product._id, reason)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;

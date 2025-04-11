import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import StatCard from '../components/common/StatCard';
import RecentApprovalsList from '../components/approvals/RecentApprovalsList';
import RecentProductsList from '../components/products/RecentProductsList';

const Dashboard = () => {
  const { currentAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    totalSales: 0,
    revenue: 0
  });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, approvalsRes, productsRes] = await Promise.all([
          axiosInstance.get('/admin/dashboard/stats'),
          axiosInstance.get('/admin/pending-approvals'),
          axiosInstance.get('/admin/products/recent')
        ]);
        
        setStats(statsRes.data);
        setPendingApprovals(approvalsRes.data.products);
        setRecentProducts(productsRes.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon="box" 
          color="blue" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          icon="clock" 
          color="yellow" 
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon="users" 
          color="green" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toFixed(2)}`} 
          icon="dollar-sign" 
          color="purple" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
          <RecentApprovalsList approvals={pendingApprovals} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
          <RecentProductsList products={recentProducts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, FileTextIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { CreateRequestForm } from './CreateRequestForm';
interface RequestData {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState<RequestData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  useEffect(() => {
    // In a real app, this would fetch data from the API
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data
        const mockRequests: RequestData[] = [{
          id: 1,
          title: 'Office Supplies',
          description: 'Notebooks, pens, and staplers for the team',
          amount: 125.5,
          status: 'approved',
          createdAt: '2023-05-15T10:30:00Z',
          updatedAt: '2023-05-16T14:20:00Z'
        }, {
          id: 2,
          title: 'Software Subscription',
          description: 'Annual subscription for design software',
          amount: 599.99,
          status: 'pending',
          createdAt: '2023-05-18T09:15:00Z',
          updatedAt: '2023-05-18T09:15:00Z'
        }, {
          id: 3,
          title: 'Conference Tickets',
          description: 'Tickets for the annual industry conference',
          amount: 850.0,
          status: 'rejected',
          createdAt: '2023-05-10T16:45:00Z',
          updatedAt: '2023-05-12T11:30:00Z'
        }];
        setRecentRequests(mockRequests);
        setStats({
          total: 12,
          pending: 5,
          approved: 6,
          rejected: 1
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  const columns = [{
    header: 'Title',
    accessor: 'title'
  }, {
    header: 'Amount',
    accessor: (row: RequestData) => `$${row.amount.toFixed(2)}`,
    className: 'text-right'
  }, {
    header: 'Status',
    accessor: (row: RequestData) => <Badge status={row.status} />,
    className: 'text-center'
  }, {
    header: 'Date',
    accessor: (row: RequestData) => new Date(row.createdAt).toLocaleDateString()
  }];
  const handleRowClick = (row: RequestData) => {
    navigate(`/dashboard/staff/requests/${row.id}`);
  };
  const handleCreateRequest = () => {
    setIsCreateModalOpen(true);
  };
  return <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <Button onClick={handleCreateRequest} leftIcon={<PlusIcon className="h-4 w-4" />} className="mt-4 md:mt-0">
            Create New Request
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </Card>
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </Card>
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </Card>
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <XIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }}>
          <Card title="Recent Requests" className="p-0 overflow-hidden">
            <Table columns={columns} data={recentRequests} isLoading={isLoading} onRowClick={handleRowClick} keyExtractor={row => row.id.toString()} emptyMessage="No requests found" />
            <div className="p-4 border-t border-gray-100 text-center">
              <Button variant="secondary" onClick={() => navigate('/dashboard/staff/requests')}>
                View All Requests
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Purchase Request" size="lg">
        <CreateRequestForm onSuccess={() => {
        setIsCreateModalOpen(false);
        // In a real app, refresh the requests list
      }} />
      </Modal>
    </DashboardLayout>;
};
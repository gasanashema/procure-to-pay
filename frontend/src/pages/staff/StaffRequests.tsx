import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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
export const StaffRequests: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  useEffect(() => {
    // In a real app, this would fetch data from the API
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data
        const mockRequests: RequestData[] = Array.from({
          length: 10
        }, (_, i) => ({
          id: i + 1,
          title: `Request ${i + 1}`,
          description: `Description for request ${i + 1}`,
          amount: Math.round(Math.random() * 1000 * 100) / 100,
          status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString()
        }));
        setRequests(mockRequests);
        setFilteredRequests(mockRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);
  useEffect(() => {
    // Apply filters
    let result = requests;
    if (searchQuery) {
      result = result.filter(request => request.title.toLowerCase().includes(searchQuery.toLowerCase()) || request.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    setFilteredRequests(result);
  }, [requests, searchQuery, statusFilter]);
  const columns = [{
    header: 'Request ID',
    accessor: (row: RequestData) => `#${row.id}`,
    className: 'font-medium text-gray-900'
  }, {
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
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <Button onClick={handleCreateRequest} leftIcon={<PlusIcon className="h-4 w-4" />} className="mt-4 md:mt-0">
            Create New Request
          </Button>
        </div>
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search requests..." leftIcon={<SearchIcon className="h-5 w-5 text-gray-400" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <FilterIcon className="h-5 w-5 text-gray-500" />
              <select className="input max-w-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </Card>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <Table columns={columns} data={filteredRequests} isLoading={isLoading} onRowClick={handleRowClick} keyExtractor={row => row.id.toString()} emptyMessage="No requests found" />
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
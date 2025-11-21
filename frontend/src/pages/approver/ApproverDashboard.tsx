import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, CheckIcon, XIcon, SearchIcon, FilterIcon, AlertCircleIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
interface RequestData {
  id: number;
  title: string;
  requestor: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  urgency: 'low' | 'normal' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}
export const ApproverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    urgent: 0
  });
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockRequests: RequestData[] = Array.from({
          length: 12
        }, (_, i) => ({
          id: i + 1,
          title: `Purchase Request ${i + 1}`,
          requestor: `Employee ${i + 1}`,
          amount: Math.round(Math.random() * 5000 * 100) / 100,
          status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'rejected',
          urgency: ['low', 'normal', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'normal' | 'high' | 'critical',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString()
        }));
        setRequests(mockRequests);
        setFilteredRequests(mockRequests.filter(req => req.status === 'pending'));
        const pendingCount = mockRequests.filter(req => req.status === 'pending').length;
        const approvedCount = mockRequests.filter(req => req.status === 'approved').length;
        const rejectedCount = mockRequests.filter(req => req.status === 'rejected').length;
        const urgentCount = mockRequests.filter(req => req.status === 'pending' && (req.urgency === 'high' || req.urgency === 'critical')).length;
        setStats({
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
          urgent: urgentCount
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  useEffect(() => {
    let result = requests;
    if (searchQuery) {
      result = result.filter(request => request.title.toLowerCase().includes(searchQuery.toLowerCase()) || request.requestor.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    setFilteredRequests(result);
  }, [requests, searchQuery, statusFilter]);
  const urgencyColors = {
    low: 'bg-gray-100 text-gray-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  const columns = [{
    header: 'Request ID',
    accessor: (row: RequestData) => `#${row.id}`,
    className: 'font-medium text-gray-900'
  }, {
    header: 'Title',
    accessor: 'title'
  }, {
    header: 'Requestor',
    accessor: 'requestor'
  }, {
    header: 'Amount',
    accessor: (row: RequestData) => `$${row.amount.toFixed(2)}`,
    className: 'text-right'
  }, {
    header: 'Urgency',
    accessor: (row: RequestData) => <span className={`badge ${urgencyColors[row.urgency]}`}>
          {row.urgency.charAt(0).toUpperCase() + row.urgency.slice(1)}
        </span>,
    className: 'text-center'
  }, {
    header: 'Status',
    accessor: (row: RequestData) => <Badge status={row.status} />,
    className: 'text-center'
  }, {
    header: 'Date',
    accessor: (row: RequestData) => new Date(row.createdAt).toLocaleDateString()
  }];
  const handleRowClick = (row: RequestData) => {
    navigate(`/dashboard/approver/requests/${row.id}`);
  };
  return <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Approver Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </Card>
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <AlertCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.urgent}
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
        duration: 0.3
      }}>
          <Table columns={columns} data={filteredRequests} isLoading={isLoading} onRowClick={handleRowClick} keyExtractor={row => row.id.toString()} emptyMessage="No requests found" />
        </motion.div>
      </div>
    </DashboardLayout>;
};
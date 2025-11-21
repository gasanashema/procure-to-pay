import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon, FileTextIcon, DollarSignIcon, TrendingUpIcon, SearchIcon, FilterIcon } from 'lucide-react';
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
  status: 'approved' | 'processed';
  poNumber?: string;
  createdAt: string;
  updatedAt: string;
  hasReceipt: boolean;
}
export const FinanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [approvedRequests, setApprovedRequests] = useState<RequestData[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    approved: 0,
    processed: 0,
    totalAmount: 0,
    pendingReceipts: 0
  });
  useEffect(() => {
    // In a real app, this would fetch data from the API
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data
        const mockRequests: RequestData[] = Array.from({
          length: 8
        }, (_, i) => ({
          id: i + 1,
          title: `Purchase Request ${i + 1}`,
          requestor: `Employee ${i + 1}`,
          amount: Math.round(Math.random() * 5000 * 100) / 100,
          status: Math.random() > 0.5 ? 'approved' : 'processed',
          poNumber: Math.random() > 0.3 ? `PO-2023-${1000 + i}` : undefined,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
          hasReceipt: Math.random() > 0.5
        }));
        setApprovedRequests(mockRequests);
        setFilteredRequests(mockRequests);
        const totalAmount = mockRequests.reduce((sum, req) => sum + req.amount, 0);
        const approvedCount = mockRequests.filter(req => req.status === 'approved').length;
        const processedCount = mockRequests.filter(req => req.status === 'processed').length;
        const pendingReceiptsCount = mockRequests.filter(req => !req.hasReceipt).length;
        setStats({
          approved: approvedCount,
          processed: processedCount,
          totalAmount,
          pendingReceipts: pendingReceiptsCount
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
    // Apply filters
    let result = approvedRequests;
    if (searchQuery) {
      result = result.filter(request => request.title.toLowerCase().includes(searchQuery.toLowerCase()) || request.requestor.toLowerCase().includes(searchQuery.toLowerCase()) || request.poNumber && request.poNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    setFilteredRequests(result);
  }, [approvedRequests, searchQuery, statusFilter]);
  const columns = [{
    header: 'PO Number',
    accessor: (row: RequestData) => row.poNumber || '-',
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
    header: 'Status',
    accessor: (row: RequestData) => {
      const statusConfig = {
        approved: {
          text: 'Approved',
          className: 'badge-success'
        },
        processed: {
          text: 'Processed',
          className: 'bg-blue-100 text-blue-800'
        }
      };
      return <span className={`badge ${statusConfig[row.status].className}`}>
            {statusConfig[row.status].text}
          </span>;
    },
    className: 'text-center'
  }, {
    header: 'Receipt',
    accessor: (row: RequestData) => <span className={`badge ${row.hasReceipt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {row.hasReceipt ? 'Uploaded' : 'Pending'}
        </span>,
    className: 'text-center'
  }, {
    header: 'Actions',
    accessor: (row: RequestData) => <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50" onClick={e => {
        e.stopPropagation();
        navigate(`/dashboard/finance/requests/${row.id}`);
      }}>
            View
          </Button>
          {row.poNumber && <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={e => {
        e.stopPropagation();
        navigate(`/dashboard/finance/po/${row.id}`);
      }}>
              PO
            </Button>}
        </div>
  }];
  const handleRowClick = (row: RequestData) => {
    navigate(`/dashboard/finance/requests/${row.id}`);
  };
  return <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Finance Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Approved Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </Card>
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FileTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Processed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.processed}
                </p>
              </div>
            </div>
          </Card>
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <DollarSignIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
          <Card animated className="bg-white p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <TrendingUpIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Receipts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingReceipts}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search by title, requestor, or PO number..." leftIcon={<SearchIcon className="h-5 w-5 text-gray-400" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <FilterIcon className="h-5 w-5 text-gray-500" />
              <select className="input max-w-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="processed">Processed</option>
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
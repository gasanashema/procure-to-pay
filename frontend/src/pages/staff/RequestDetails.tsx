import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, EditIcon, TrashIcon, FileTextIcon, DownloadIcon, UploadIcon, ClockIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { ApprovalTimeline } from '../../components/ui/ApprovalTimeline';
import { UploadBox } from '../../components/ui/UploadBox';
import { Modal } from '../../components/ui/Modal';
import { showToast } from '../../components/ui/Toast';
interface RequestDetail {
  id: number;
  title: string;
  description: string;
  amount: number;
  vendorName: string;
  category: string;
  urgency: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  proformaUrl?: string;
  receiptUrl?: string;
  approvalHistory: {
    id: string;
    status: 'approved' | 'rejected' | 'pending';
    approver: string;
    role: string;
    date?: string;
    comments?: string;
  }[];
}
export const RequestDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  useEffect(() => {
    // In a real app, this would fetch data from the API
    const fetchRequestDetails = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data
        const mockRequest: RequestDetail = {
          id: Number(id),
          title: 'Office Equipment Purchase',
          description: 'Purchase of new monitors and keyboards for the development team to improve productivity.',
          amount: 1250.75,
          vendorName: 'TechSupplies Inc.',
          category: 'Hardware',
          urgency: 'Normal',
          status: 'pending',
          createdAt: '2023-05-10T14:30:00Z',
          updatedAt: '2023-05-10T14:30:00Z',
          proformaUrl: 'https://example.com/proforma.pdf',
          approvalHistory: [{
            id: '1',
            status: 'pending',
            approver: 'Jane Smith',
            role: 'Level 1 Approver',
            date: '2023-05-11',
            comments: 'Under review'
          }, {
            id: '2',
            status: 'pending',
            approver: 'Mike Johnson',
            role: 'Level 2 Approver'
          }]
        };
        setRequest(mockRequest);
      } catch (error) {
        console.error('Error fetching request details:', error);
        showToast('Failed to load request details', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchRequestDetails();
    }
  }, [id]);
  const handleEdit = () => {
    // In a real app, navigate to edit page or open edit modal
    showToast('Edit functionality would be implemented here', 'info');
  };
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Request deleted successfully', 'success');
      navigate('/dashboard/staff/requests');
    } catch (error) {
      console.error('Error deleting request:', error);
      showToast('Failed to delete request', 'error');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };
  const handleFileSelect = (file: File) => {
    setReceiptFile(file);
  };
  const handleRemoveFile = () => {
    setReceiptFile(null);
  };
  const handleUploadReceipt = async () => {
    if (!receiptFile) {
      showToast('Please select a receipt file to upload', 'error');
      return;
    }
    try {
      setIsUploading(true);
      // Simulate file upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 300);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      // In a real app, this would call an API endpoint
      console.log('Uploading receipt:', receiptFile);
      // Update the request object with the receipt URL
      if (request) {
        setRequest({
          ...request,
          receiptUrl: URL.createObjectURL(receiptFile)
        });
      }
      showToast('Receipt uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading receipt:', error);
      showToast('Failed to upload receipt', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  if (isLoading) {
    return <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeftIcon className="h-4 w-4" />} onClick={() => navigate('/dashboard/staff/requests')}>
              Back
            </Button>
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="animate-pulse p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </Card>
            </div>
            <div>
              <Card className="animate-pulse p-6">
                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>;
  }
  if (!request) {
    return <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">
            Request not found
          </h2>
          <p className="mt-2 text-gray-500">
            The request you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button variant="primary" className="mt-4" onClick={() => navigate('/dashboard/staff/requests')}>
            Back to Requests
          </Button>
        </div>
      </DashboardLayout>;
  }
  return <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeftIcon className="h-4 w-4" />} onClick={() => navigate('/dashboard/staff/requests')}>
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Request #{request.id}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {request.status === 'pending' && <>
                <Button variant="outline" size="sm" leftIcon={<EditIcon className="h-4 w-4" />} onClick={handleEdit}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" leftIcon={<TrashIcon className="h-4 w-4" />} className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
                  Delete
                </Button>
              </>}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3
        }} className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {request.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Created on{' '}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusIndicator status={request.status} size="lg" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="mt-1 text-gray-700">{request.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Amount
                    </h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      ${request.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Vendor
                    </h3>
                    <p className="mt-1 text-gray-700">{request.vendorName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Category
                    </h3>
                    <p className="mt-1 text-gray-700">{request.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Urgency
                    </h3>
                    <p className="mt-1 text-gray-700">{request.urgency}</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Attached Documents">
              <div className="space-y-4">
                {request.proformaUrl && <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileTextIcon className="h-6 w-6 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Proforma Invoice
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded on{' '}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<DownloadIcon className="h-4 w-4" />} onClick={() => window.open(request.proformaUrl, '_blank')}>
                      View
                    </Button>
                  </div>}
                {request.receiptUrl ? <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileTextIcon className="h-6 w-6 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Receipt</p>
                        <p className="text-xs text-gray-500">
                          Uploaded recently
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<DownloadIcon className="h-4 w-4" />} onClick={() => window.open(request.receiptUrl, '_blank')}>
                      View
                    </Button>
                  </div> : <div className="space-y-3">
                    <div className="flex items-center">
                      <UploadIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="font-medium text-gray-700">
                        Upload Receipt
                      </h3>
                    </div>
                    <UploadBox onFileSelect={handleFileSelect} acceptedFileTypes="application/pdf,image/*,.doc,.docx,.xls,.xlsx" label="Upload Receipt" selectedFile={receiptFile} onRemoveFile={handleRemoveFile} isUploading={isUploading} uploadProgress={uploadProgress} disabled={request.status !== 'approved'} />
                    {request.status !== 'approved' && <p className="text-sm text-yellow-600 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Receipt can only be uploaded after request is approved
                      </p>}
                    {receiptFile && request.status === 'approved' && <Button onClick={handleUploadReceipt} isLoading={isUploading} className="mt-2">
                        Upload Receipt
                      </Button>}
                  </div>}
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: 0.2
        }}>
            <Card title="Approval Status">
              <ApprovalTimeline items={request.approvalHistory} />
            </Card>
          </motion.div>
        </div>
      </div>
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Request" size="sm" footer={<>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>}>
        <p className="text-gray-700">
          Are you sure you want to delete this request? This action cannot be
          undone.
        </p>
      </Modal>
    </DashboardLayout>;
};
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { UploadBox } from '../../components/ui/UploadBox';
import { showToast } from '../../components/ui/Toast';
const requestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be a positive number'
  }),
  vendorName: z.string().min(2, 'Vendor name is required'),
  category: z.string().min(1, 'Category is required'),
  urgency: z.string().min(1, 'Urgency is required')
});
type RequestFormValues = z.infer<typeof requestSchema>;
interface CreateRequestFormProps {
  onSuccess: () => void;
}
export const CreateRequestForm: React.FC<CreateRequestFormProps> = ({
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proformaFile, setProformaFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      vendorName: '',
      category: '',
      urgency: 'normal'
    }
  });
  const onSubmit = async (data: RequestFormValues) => {
    if (!proformaFile) {
      showToast('Please upload a proforma invoice', 'error');
      return;
    }
    try {
      setIsSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('amount', data.amount);
      formData.append('proforma_file', proformaFile);

      // Add items if needed (for now, basic request)
      // TODO: Add items support

      await axios.post('http://localhost:8000/api/requests/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Purchase request created successfully!', 'success');
      onSuccess();
    } catch (error) {
      console.error('Error creating request:', error);
      showToast('Failed to create request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  const handleFileSelect = (file: File) => {
    setProformaFile(file);
  };
  const handleRemoveFile = () => {
    setProformaFile(null);
  };
  return <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Input label="Request Title" error={errors.title?.message} {...register('title')} placeholder="e.g., Office Supplies, Software License" />
        <Textarea label="Description" error={errors.description?.message} {...register('description')} placeholder="Provide details about the purchase request..." rows={4} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Amount ($)" type="number" step="0.01" error={errors.amount?.message} {...register('amount')} placeholder="0.00" />
          <Input label="Vendor Name" error={errors.vendorName?.message} {...register('vendorName')} placeholder="Supplier or vendor name" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select className="input" {...register('category')}>
              <option value="">Select a category</option>
              <option value="office_supplies">Office Supplies</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
              <option value="services">Services</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </select>
            {errors.category?.message && <p className="mt-1 text-sm text-red-600">
                {errors.category?.message}
              </p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency
            </label>
            <select className="input" {...register('urgency')}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {errors.urgency?.message && <p className="mt-1 text-sm text-red-600">
                {errors.urgency?.message}
              </p>}
          </div>
        </div>
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proforma Invoice / Quote
          </label>
          <UploadBox onFileSelect={handleFileSelect} acceptedFileTypes="application/pdf,image/*,.doc,.docx,.xls,.xlsx" label="Upload Proforma Invoice or Quote" selectedFile={proformaFile} onRemoveFile={handleRemoveFile} isUploading={isSubmitting && proformaFile !== null} uploadProgress={uploadProgress} />
          <p className="mt-1 text-xs text-gray-500">
            Upload a PDF, image, or document with vendor quote details
          </p>
        </motion.div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onSuccess} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Submit Request
        </Button>
      </div>
    </form>;
};
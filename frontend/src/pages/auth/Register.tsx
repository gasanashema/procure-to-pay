import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MailIcon, LockIcon, UserIcon } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { showToast } from '../../components/ui/Toast';
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});
type RegisterFormValues = z.infer<typeof registerSchema>;
export const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const onSubmit = async (data: RegisterFormValues) => {
    // In a real app, this would call an API endpoint
    console.log('Registration data:', data);
    // Show success toast
    showToast('Registration successful!', 'success');
    // Redirect to login
    navigate('/login');
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ProcurePay</h1>
          <p className="mt-2 text-gray-600">Create a new account</p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />} error={errors.name?.message} {...register('name')} placeholder="John Doe" />
            <Input label="Email Address" type="email" leftIcon={<MailIcon className="h-5 w-5 text-gray-400" />} error={errors.email?.message} {...register('email')} placeholder="you@example.com" />
            <Input label="Password" type="password" leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />} error={errors.password?.message} {...register('password')} placeholder="••••••••" />
            <Input label="Confirm Password" type="password" leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />} error={errors.confirmPassword?.message} {...register('confirmPassword')} placeholder="••••••••" />
            <Button type="submit" fullWidth className="mt-6">
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Note: Registration is controlled by your organization. This is a
            placeholder for UI demonstration.
          </p>
        </div>
      </motion.div>
    </div>;
};
# Procure-to-Pay Full-Stack Application

A complete Procure-to-Pay system with Django REST Framework backend and React frontend, featuring multi-level approval workflows, document processing, and role-based access control.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Installation & Setup

1. **One-command complete setup (recommended):**
   ```bash
   npm run setup
   ```

   This automatically:
   - Installs all dependencies
   - Runs database migrations
   - Creates test users
   - Populates database with demo data

2. **Or step-by-step setup:**
   ```bash
   # Install dependencies
   npm run install:all

   # Set up database
   npm run migrate

   # Create test users
   npm run createusers

   # Add demo data (optional)
   npm run createdemo
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```

This will start both the Django backend (http://localhost:8000) and React frontend (http://localhost:5173) simultaneously.

## 📁 Project Structure

```
procure-to-pay/
├── backend/                 # Django REST API
│   ├── accounts/           # User management & authentication
│   ├── requests/           # Purchase requests & approvals
│   ├── finance/            # Finance operations & receipts
│   ├── documents/          # Document processing services
│   ├── backend/            # Django settings & configuration
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/               # React application
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── package.json            # Root scripts for running both services
└── README.md
```

## 🔐 User Roles

- **Staff**: Create and manage purchase requests
- **Approver Level 1**: First-level approval
- **Approver Level 2**: Second-level approval
- **Finance**: Final validation and receipt processing

## 🔑 Login Credentials

After running `npm run setup`, you can login with these test accounts:

**Note:** Approvers now correctly redirect to their dashboard after login! 🎉

| Role | Username/Email | Password | Permissions |
|------|----------------|----------|-------------|
| **Staff** | `staff@example.com` | `staff123` | Create purchase requests |
| **Approver 1** | `approver1@example.com` | `approver123` | Approve level 1 requests |
| **Approver 2** | `approver2@example.com` | `approver123` | Approve level 2 requests |
| **Finance** | `finance@example.com` | `finance123` | Validate receipts |
| **Admin** | `admin@example.com` | `admin123` | Full access (Django admin) |

## 📊 Demo Data

After running `npm run setup`, your database will contain:

- **13+ Sample Purchase Requests** with different statuses:
  - Office Equipment Purchase (Approved) - $2,900
  - Software Licenses (Approved) - $899.97
  - Conference Room Setup (Pending) - $2,420
  - IT Infrastructure (Approved) - $164.99
  - Office Supplies (Rejected) - $395
  - Consulting Services (Pending) - $2,500
  - And more demo requests...

- **Purchase Items** for each request with pricing
- **Multi-level Approval Workflows** with proper timestamps
- **Complete Audit Trail** for testing all user roles
- **Real-time Data Updates** - No more page refreshes needed!
- **Sequential Indexing** - Clean numbered lists instead of database IDs

## 🛠️ Available Scripts

- `npm run dev` - Run both frontend and backend
- `npm run dev:backend` - Run only Django backend
- `npm run dev:frontend` - Run only React frontend
- `npm run install:all` - Install all dependencies
- `npm run migrate` - Run Django migrations
- `npm run createusers` - Create test users
- `npm run createdemo` - Create demo data
- `npm run setup` - Complete setup (install + migrate + users + demo data)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Refresh JWT token

### Purchase Requests
- `GET /api/requests/` - List user's requests
- `POST /api/requests/` - Create new request
- `GET /api/requests/{id}/` - Get request details
- `PUT /api/requests/{id}/` - Update pending request

### Approvals
- `GET /api/approvals/pending/` - List pending approvals
- `POST /api/requests/{id}/approve/` - Approve request
- `POST /api/requests/{id}/reject/` - Reject request

## 🐳 Docker Deployment

For production deployment with Docker:

```bash
cd backend
docker-compose up --build
```

## 📄 Features

- ✅ JWT Authentication with role-based permissions
- ✅ Multi-level approval workflow
- ✅ Document upload and processing (PDF, images)
- ✅ OCR text extraction from documents
- ✅ Automatic Purchase Order generation
- ✅ Receipt validation against POs
- ✅ File upload handling
- ✅ Responsive React frontend
- ✅ RESTful API design
- ✅ PostgreSQL database support

## 🔧 Development

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy coding! 🎉**
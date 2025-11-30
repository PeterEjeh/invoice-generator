# Pete's Technologies - Invoice Manager

A modern, professional invoice management system built with React and Supabase. Create, manage, and print beautiful invoices with cloud backup and multi-device access.

![Invoice Manager](https://img.shields.io/badge/React-18.2.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### Core Functionality
- 📝 **Create & Edit Invoices** - Professional invoice templates with customizable fields
- 👥 **Client Management** - Store client information for quick invoice generation
- 💰 **Automatic Calculations** - Auto-calculate totals, taxes, and due dates
- 🎨 **Multiple Templates** - Choose from Modern, Classic, or Minimal designs
- 📄 **PDF Export** - Download invoices as PDF with one click
- 🖨️ **Print Optimization** - Single-page print layout with clean formatting

### Cloud Features
- ☁️ **Cloud Backup** - All data securely stored in Supabase
- 🔐 **User Authentication** - Secure email/password authentication
- 🌐 **Multi-Device Access** - Access your invoices from anywhere
- 🔒 **Data Privacy** - Row-level security ensures your data stays private

### Security
- 🛡️ **Email Whitelist** - Restrict account creation to authorized emails only
- 🔑 **Secure Authentication** - Powered by Supabase Auth
- 🚫 **RLS Policies** - Database-level security for data isolation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd invoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL scripts from `supabase_setup.md` in your Supabase SQL editor
   - Copy your project URL and anon key

4. **Configure environment variables**
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_ALLOWED_EMAILS=your-email@example.com,another@example.com
   ```
   - **Important:** Never commit the `.env` file to Git (it's already in `.gitignore`)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Sign up with one of the whitelisted emails
   - Start creating invoices!


## 📖 Usage

### Creating Your First Invoice

1. **Sign Up / Login**
   - Use one of the whitelisted email addresses
   - Verify your email (check spam folder)

2. **Configure Settings**
   - Click "Settings" in the sidebar
   - Add your company information
   - Set up bank details for payment instructions

3. **Create an Invoice**
   - Click "Create Invoice"
   - Fill in client details
   - Add line items (description, quantity, rate)
   - Choose a template
   - Add payment terms and notes
   - Click "Create Invoice"

4. **Manage Invoices**
   - View all invoices on the dashboard
   - Filter by status (Pending, Paid, Overdue)
   - Edit, view, or delete invoices
   - Download as PDF or print

### Printing Invoices

For best results when printing:
1. Open the invoice you want to print
2. Click the "Print" button
3. In the print dialog:
   - Uncheck "Headers and footers"
   - Set margins to "None" or "Minimum"
4. Print or save as PDF

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.2 with Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **PDF Generation:** jsPDF
- **Form Handling:** React Hook Form
- **Date Utilities:** date-fns
- **Icons:** Lucide React
- **Routing:** React Router DOM

## 📁 Project Structure

```
invoice/
├── src/
│   ├── components/
│   │   ├── templates/        # Invoice templates
│   │   ├── InvoiceForm.jsx   # Invoice creation form
│   │   ├── Layout.jsx        # App layout with sidebar
│   │   └── ProtectedRoute.jsx # Auth guard
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication state
│   │   └── InvoiceContext.jsx # Invoice & settings state
│   ├── lib/
│   │   └── supabase.js       # Supabase client config
│   ├── pages/
│   │   ├── Dashboard.jsx     # Invoice list
│   │   ├── CreateInvoice.jsx # New invoice
│   │   ├── EditInvoice.jsx   # Edit existing
│   │   ├── ViewInvoice.jsx   # View & print
│   │   ├── Settings.jsx      # Company settings
│   │   ├── Login.jsx         # Login page
│   │   └── Signup.jsx        # Registration
│   ├── utils/
│   │   ├── invoiceCalculations.js # Business logic
│   │   └── pdfExport.js      # PDF generation
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── public/                   # Static assets
└── package.json              # Dependencies
```

## 🔧 Configuration

### Email Whitelist
Edit your `.env` file to add or remove authorized emails:
```env
VITE_ALLOWED_EMAILS=email1@example.com,email2@example.com,email3@example.com
```
**Note:** Restart the dev server after changing the `.env` file.

### Supabase Credentials
Update your `.env` file with your Supabase project details:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Company Settings
Update default settings in `src/context/InvoiceContext.jsx`:
```javascript
const defaultSettings = {
  company_name: "Your Company Name",
  address: "Your Address",
  // ... other fields
};
```

### Invoice Prefix
Change the default invoice number prefix in settings or in the code:
```javascript
invoice_prefix: "INV" // Default is "PT"
```

## 📊 Database Schema

### Tables

**invoices**
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to auth.users)
- `invoice_number` - Text
- `client_name` - Text
- `client_email` - Text
- `client_phone` - Text
- `client_address` - Text
- `items` - JSONB (array of line items)
- `total` - Numeric
- `status` - Text (pending, paid, overdue)
- `created_at` - Timestamp
- `due_date` - Timestamp
- `payment_terms` - Integer (days)
- `notes` - Text
- `template` - Text

**settings**
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to auth.users)
- `company_name` - Text
- `address` - Text
- `city` - Text
- `state` - Text
- `postal_code` - Text
- `country` - Text
- `email` - Text
- `phone` - Text
- `bank_name` - Text
- `account_name` - Text
- `account_number` - Text
- `sort_code` - Text
- `invoice_prefix` - Text

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Email whitelist prevents unauthorized signups
- Supabase handles authentication securely
- Environment variables for sensitive data (recommended for production)

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy Options

- **Vercel** - Automatic deployments from Git
- **Netlify** - Easy static site hosting
- **GitHub Pages** - Free hosting for static sites
- **Your own server** - Serve the `dist/` folder

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Pete's Technologies**
- Email: petes-tech@proton.me

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Need help?** Open an issue or contact petes-tech@proton.me

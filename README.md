🏭 Indotech Electronic Weighing Systems
India's trusted manufacturer of electronic weighbridges, platform scales, and industrial weighing systems — serving the Delhi NCR region for 25+ years.

🌐 Live Website: indotechweigh.com

📋 About
Indotech Electronic Weighing Systems is a full-stack e-commerce website for an electronic weighing equipment manufacturer. The platform allows customers to browse products, add items to cart, place orders with UPI or Cash on Delivery, and track their orders. An admin panel enables catalog management and order processing.

✨ Features
🛒 Customer Features
Product Catalog — Browse weighbridges, platform scales, industrial scales, crane scales, jewellery scales & more
Parts & Components — Load cells, indicators, batteries, cables
Shopping Cart — Add/remove items, quantity management, variant selection
Checkout Flow — 3-step checkout with phone & email verification
Payment Options — UPI payment with proof upload, Cash on Delivery
Order Tracking — Track orders by phone number
Contact Form — Direct enquiry submission
🔐 Admin Panel (/admin)
Dashboard — Overview of all orders
Order Management — View, update status, add notes
Product Management — Add, edit, delete products & parts
Image Upload — Upload product images directly from admin
🛠️ Tech Stack
Technology	Purpose
React 18	Frontend UI framework
TypeScript	Type-safe development
Vite	Build tool & dev server
Tailwind CSS	Utility-first styling
shadcn/ui	UI component library
Supabase	Backend (Database + Storage + Auth)
React Router	Client-side routing
Lucide React	Icon library
Sonner	Toast notifications
📁 Project Structure


src/
├── assets/            # Product images & static assets
├── components/
│   ├── admin/         # AdminLayout, ProductFormModal
│   ├── cart/          # CartDrawer, CartContext
│   ├── layout/        # Header, Footer, Layout
│   └── ui/            # shadcn/ui components
├── context/
│   ├── CartContext.tsx # Shopping cart state
│   └── OrderContext.tsx# Order management (Supabase)
├── data/
│   ├── products.ts    # Product fetching from Supabase
│   └── parts.ts       # Parts fetching from Supabase
├── lib/
│   └── supabase.ts    # Supabase client config
├── pages/
│   ├── admin/         # AdminLogin, AdminDashboard, AdminOrders, AdminProducts
│   ├── Index.tsx      # Home page
│   ├── Products.tsx   # Products listing
│   ├── ProductDetail.tsx
│   ├── Parts.tsx      # Parts & components
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Checkout.tsx
│   ├── MyOrders.tsx
│   └── OrderConfirmation.tsx
└── App.tsx            # Routes & providers
🚀 Getting Started
Prerequisites
Node.js 18+
npm or yarn
Supabase account
Installation
bash


# Clone the repository
git clone https://github.com/hsharsh10/indotechweigh-com.git
cd indotechweigh-com
# Install dependencies
npm install
# Set up environment variables
cp .env.example .env.local
Environment Variables
Create a .env.local file with:

env


VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Supabase Setup
Run these SQL queries in your Supabase SQL Editor:

📦 Products Table
🔧 Parts Table
📋 Orders Table
✉️ Contact Messages Table
Storage Buckets (create in Supabase Storage):

payment_proofs — Public bucket for payment screenshots
product_images — Public bucket for product images
Run Locally
bash


npm run dev
Open http://localhost:8080

🌐 Deployment (Vercel)
Push code to GitHub
Import project on vercel.com
Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) under Settings → Environment Variables
Deploy!
👤 Admin Access
Navigate to /admin and enter the admin password to access:

Order management
Product catalog CRUD
Contact message viewing
📞 Contact
Indotech Electronic Weighing Systems 📍 Delhi NCR, India 📧 Contact via website form

Made with ❤️ by Indotech Electronic Weighing Systems

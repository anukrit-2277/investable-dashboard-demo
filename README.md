# Investable Dashboard Demo

A professional investment analysis platform with comprehensive company scoring, access management, and advanced analytics capabilities.

## 🚀 Features

### Core Functionality
- **Company Analysis Dashboard**: Comprehensive scoring across People, Process, and Technology pillars
- **Multi-Dimensional Scoring**: 24 evaluation metrics across 8 categories (Finance, Legal, Tax, HR, Assets, IT, Product, Marketing)
- **Advanced Analytics**: Radar charts, heatmaps, score timelines, and pillar breakdowns
- **Access Management**: Role-based access control for investors, companies, and super admins
- **Real-time Updates**: Live status tracking for access requests with approval/denial workflow

### User Experience
- **Dark Theme**: Professional dark UI with sophisticated color schemes and glass morphism effects
- **Responsive Design**: Optimized for all device sizes with mobile-first approach
- **Smooth Animations**: Fade-in, slide-in, and scale animations with staggered loading
- **Interactive Components**: Hover effects, tooltips, and dynamic content loading

### Data Management
- **Company Directory**: Browse, search, and filter companies with real-time search
- **Score History**: Track company performance over time with timeline visualizations
- **Export Capabilities**: Generate comprehensive PDF reports for companies and filtered results
- **Data Caching**: Intelligent caching for access status and performance optimization

### Admin Features
- **Super Admin Dashboard**: Manage access requests, view statistics, and system overview
- **Access Request Management**: Approve/deny investor access to company data
- **Request History**: Track all access requests with status filtering
- **Data Migration Tools**: Built-in utilities for data management and updates

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: React Context + TanStack Query
- **Routing**: React Router DOM v6
- **Charts**: Recharts for data visualization
- **PDF Generation**: jsPDF + html2canvas

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcryptjs for password hashing
- **CORS**: Cross-origin resource sharing enabled
- **Hosting**: Render.com

### Development & Deployment
- **Package Manager**: npm/bun
- **Linting**: ESLint with TypeScript support
- **Build Tool**: Vite with SWC
- **Deployment**: Vercel (Frontend) + Render (Backend)
- **Environment**: dotenv for configuration

## 📱 Usage

### User Types & Permissions

1. **Investor**
   - Browse company directory
   - Request access to detailed company analysis
   - View approved company dashboards
   - Export reports for approved companies
   - Access limited to approved companies only

2. **Company**
   - View own company dashboard
   - Access detailed scoring and analytics
   - View performance history and trends
   - Export company-specific reports

3. **Super Admin**
   - Full system access
   - Manage all access requests
   - Approve/deny investor access
   - View system statistics and overview
   - Data migration and management tools

### Key Features

- **Company Directory**: Browse, search, and filter companies with comprehensive scoring
- **Score Analysis**: View detailed scoring across People, Process, and Technology pillars
- **Access Requests**: Request and manage access to company data with approval workflow
- **Admin Dashboard**: Comprehensive admin interface for system management
- **PDF Export**: Generate detailed reports for companies and filtered results
- **Real-time Updates**: Live status tracking and dynamic content loading
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Analytics & Visualization

- **Radar Charts**: Compare company performance across pillars and categories
- **Score Timelines**: Track performance changes over time
- **Heatmaps**: Visual representation of category scores
- **Pillar Breakdowns**: Detailed analysis of People, Process, and Technology
- **Score Rings**: Animated circular progress indicators
- **Category Cards**: Individual metric scoring with descriptions

## 🎨 Theme & Design

The application features a professional dark theme with:
- Sophisticated color palette with proper contrast ratios
- Glass morphism effects and backdrop blur
- Smooth animations and transitions
- Responsive grid layouts
- Professional typography and spacing
- Interactive hover states and focus indicators

## 🔒 Security & Access Control

- **Role-based Access Control**: Secure user type validation
- **Protected Routes**: Authentication-required pages
- **API Security**: Secure endpoints with proper validation
- **Input Validation**: Client and server-side validation
- **CORS Configuration**: Proper cross-origin handling
- **Environment Protection**: Secure configuration management

## 📊 Data Structure

### Company Scoring System
- **Macro Score**: Overall company performance rating
- **Pillar Scores**: People, Process, and Technology ratings
- **Category Scores**: 8 detailed categories per pillar
- **Attribute Scores**: Individual metric scoring
- **Score History**: Performance tracking over time

### Access Management
- **Request Workflow**: Pending → Approved/Denied
- **User Permissions**: Role-based access control
- **Company Access**: Investor access management
- **Audit Trail**: Request history and status tracking

## 🚀 Performance Features

- **Lazy Loading**: Component-level code splitting
- **Data Caching**: Intelligent caching for access status
- **Optimized Builds**: Vite with SWC compilation
- **Responsive Images**: Optimized asset loading
- **Memory Management**: Efficient state management

## 📄 License

This is a private licensed application. All rights reserved.

## 📞 Support

For support or questions, please contact the development team directly.

## 🔄 Recent Updates

- Enhanced admin dashboard with comprehensive access management
- Advanced analytics and visualization components
- Improved PDF export functionality
- Enhanced user experience with animations and responsive design
- Comprehensive access control and security features
- Real-time status tracking and notifications

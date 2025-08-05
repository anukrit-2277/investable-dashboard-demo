# Investable Dashboard Demo

A professional investment analysis platform with comprehensive company scoring and access management system.

## 🚀 Features

- **Dark Theme**: Professional dark UI with sophisticated color schemes
- **Company Analysis**: Comprehensive scoring across People, Process, and Technology pillars
- **Access Management**: Role-based access control for investors, companies, and admins
- **Real-time Updates**: Live status tracking for access requests
- **Responsive Design**: Optimized for all device sizes
- **Professional UI**: Modern, clean interface with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: React Context + TanStack Query
- **Backend**: Node.js + Express (hosted on Render)
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd investable-dashboard-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Frontend (Vercel)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect the React app

2. **Environment Variables**
   - The app is configured to use the hosted backend by default
   - No additional environment variables needed for production

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Custom domain can be configured in Vercel dashboard

### Backend (Render)

The backend is already hosted at: `https://investable-dashboard-demo.onrender.com`

## 🔧 Configuration

### API Configuration

The app uses a centralized API configuration in `src/config/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://investable-dashboard-demo.onrender.com';
```

### Environment Variables

For local development, you can create a `.env` file:

```env
VITE_API_URL=https://investable-dashboard-demo.onrender.com
```

## 📱 Usage

### User Types

1. **Investor**: Can browse companies and request access to detailed analysis
2. **Company**: Can view their own company dashboard
3. **Super Admin**: Can manage access requests and system overview

### Features

- **Company Directory**: Browse and search companies
- **Score Analysis**: View detailed scoring across multiple pillars
- **Access Requests**: Request and manage access to company data
- **Admin Dashboard**: Manage user access and system overview

## 🎨 Theme

The application features a professional dark theme with:
- Sophisticated color palette
- Proper contrast ratios
- Smooth animations
- Glass morphism effects
- Responsive design

## 🔒 Security

- Role-based access control
- Secure API endpoints
- Input validation
- CORS configuration
- Environment variable protection

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository.

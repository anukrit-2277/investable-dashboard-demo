# Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account
- Your code pushed to GitHub

### Step 1: Prepare Your Repository

1. **Ensure all changes are committed and pushed to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Verify your repository structure**
   ```
   investable-dashboard-demo/
   ├── src/
   ├── public/
   ├── package.json
   ├── vite.config.ts
   ├── vercel.json
   └── README.md
   ```

### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "New Project"**

3. **Import your GitHub repository**
   - Select your `investable-dashboard-demo` repository
   - Vercel will automatically detect it as a Vite project

4. **Configure project settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)

5. **Environment Variables** (Optional)
   - The app is configured to use the hosted backend by default
   - If you need to override the API URL, add:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://investable-dashboard-demo.onrender.com`

6. **Click "Deploy"**

### Step 3: Verify Deployment

1. **Check build logs**
   - Vercel will show real-time build progress
   - Ensure no errors occur during build

2. **Test the deployed application**
   - Visit the provided Vercel URL
   - Test all major functionality:
     - User authentication
     - Company browsing
     - Access requests
     - Admin features

3. **Check API connectivity**
   - Verify that the frontend can connect to your hosted backend
   - Test login/signup functionality

### Step 4: Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Follow Vercel's DNS configuration instructions
   - Wait for DNS propagation (can take up to 24 hours)

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes locally
   - Review build logs for specific errors

2. **API Connection Issues**
   - Verify your backend is running on Render
   - Check CORS configuration on your backend
   - Ensure API endpoints are accessible

3. **Environment Variables**
   - Double-check environment variable names
   - Ensure they start with `VITE_` for client-side access
   - Redeploy after adding environment variables

### Performance Optimization

1. **Enable Vercel Analytics** (Optional)
   - Go to project settings
   - Enable Vercel Analytics for performance monitoring

2. **Configure Caching**
   - The `vercel.json` file includes basic caching headers
   - Adjust based on your needs

## 📊 Monitoring

1. **Vercel Dashboard**
   - Monitor deployment status
   - Check function execution logs
   - View performance metrics

2. **Backend Monitoring**
   - Monitor your Render backend
   - Check API response times
   - Monitor error rates

## 🔄 Continuous Deployment

Once deployed, Vercel will automatically:
- Deploy on every push to the main branch
- Create preview deployments for pull requests
- Rollback to previous versions if needed

## 📞 Support

If you encounter issues:
1. Check Vercel's documentation
2. Review build logs for specific errors
3. Test locally to isolate issues
4. Contact support if needed 
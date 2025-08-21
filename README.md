# 🤖 AI Resume Builder - Full Stack Application

A modern, AI-powered resume builder featuring intelligent content generation, real-time preview, and professional templates. Built with React, Node.js, MongoDB, and Google Gemini AI.

## 🌟 **Live Demo**
- **Frontend**: [Deployed on Render](https://ai-resume-builder-frontend.onrender.com)
- **Backend API**: [API Endpoint](https://ai-resume-builder-backend.onrender.com)

## 🛠️ **Tech Stack**
- **Frontend**: React 19, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, JWT, Google Gemini AI
- **Deployment**: Render (Full-stack deployment)

## ✨ Features

### 🎨 **Advanced Theme System**
- **Multiple Color Palettes**: 6 pre-designed professional themes
- **Custom Theme Creator**: Build your own color schemes
- **Live Preview**: Real-time theme updates as you customize
- **Theme Persistence**: Your themes are saved automatically

### 📝 **Comprehensive Resume Builder**
- **Multiple Templates**: 3 professional resume templates
- **Complete Sections**: Profile, Experience, Education, Skills, Projects, Certifications, Languages, Interests
- **Smart Progress Tracking**: Visual completion percentage
- **Auto-save**: Never lose your work

### 🎯 **Enhanced User Experience**
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Modern Animations**: Smooth transitions and micro-interactions
- **Intuitive Interface**: Clean, professional design
- **Accessibility**: WCAG compliant with keyboard navigation

### 📤 **Advanced Export Options**
- **High-Quality PDF**: Multiple quality presets (Draft, Standard, High, Print-ready)
- **Image Export**: PNG and JPEG formats
- **Theme Preservation**: Colors and styling maintained in exports
- **Batch Export**: Export multiple resumes at once

### 🔧 **Professional Features**
- **Template Customization**: Adjust fonts, spacing, colors, and layout
- **Live Preview**: See changes instantly
- **Share & Collaborate**: Share resume links or email directly
- **Print Optimization**: Perfect for physical copies

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Modern utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **React Router** - Client-side routing
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Export & Performance
- **html2pdf.js** - High-quality PDF generation
- **html2canvas** - Canvas-based screenshots
- **Performance Monitoring** - Built-in performance tracking
- **Lazy Loading** - Optimized resource loading

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-builder
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   
   # Add your configuration
   MONGODB_URI=mongodb://localhost:27017/resume-builder
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from frontend directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
resume-builder/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── Pages/          # Main application pages
│   │   ├── context/        # React context providers
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── config/           # Configuration files
└── README.md
```

## 🎨 Theme System

### Pre-built Themes
- **Professional Blue** - Corporate and trustworthy
- **Modern Purple** - Creative and contemporary
- **Creative Orange** - Bold and energetic
- **Elegant Green** - Natural and calming
- **Corporate Gray** - Classic and professional
- **Vibrant Pink** - Dynamic and memorable

### Custom Theme Creation
1. Navigate to Theme Selector
2. Click on "Custom" tab
3. Adjust colors using color pickers
4. Preview changes in real-time
5. Save your custom theme

## 📤 Export Options

### PDF Export
- **Draft**: Fast export, lower quality (Scale: 1x)
- **Standard**: Balanced quality and size (Scale: 2x)
- **High**: Best quality for digital use (Scale: 3x)
- **Print**: Optimized for printing (Scale: 4x, uncompressed)

### Advanced Options
- Include/exclude colors and themes
- Include/exclude profile images
- Optimize for printing
- Add watermark

## 🔧 Customization

### Template Customization
- **Typography**: Font family, size, weight, line height
- **Layout**: Spacing, margins, section gaps
- **Colors**: Primary, secondary, accent, text, background
- **Sections**: Show/hide sections, reorder content

### Performance Optimizations
- Lazy loading for images and components
- Debounced input handling
- Throttled scroll/resize events
- Memoized expensive calculations
- Virtual scrolling for large lists

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- UI inspiration from modern design systems
- Community feedback and contributions

## 📞 Support

- 📧 Email: support@resumebuilder.com
- 💬 Discord: [Join our community](https://discord.gg/resumebuilder)
- 📖 Documentation: [Full documentation](https://docs.resumebuilder.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Built with ❤️ for job seekers worldwide**

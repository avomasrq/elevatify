# Elevatify - Project Collaboration Platform

<div align="center">
  <img src="front/src/assets/elevatify-logo.svg" alt="Elevatify Logo" width="120" />
</div>

## Overview

Elevatify is a modern project collaboration platform that connects professionals and facilitates project management. The platform enables users to create, manage, and collaborate on projects while providing a seamless experience for team communication and project tracking.

## Features

### User Management
- Secure authentication with Clerk
- Google OAuth integration
- Profile management with customizable avatars
- Username and personal information updates

### Project Management
- Create and manage projects
- Project categorization
- Status tracking (Open, In-Progress, Completed)
- Team size and timeframe specification

### Collaboration
- Project requests system
- Team invitations
- Real-time messaging
- Category-based project organization

### User Interface
- Responsive design for all devices
- Modern and clean UI with Tailwind CSS
- Dark mode support
- Toast notifications for user feedback

## Technology Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - UI component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Socket.io** - Real-time communication
- **Cloudinary** - Media storage
- **Redis** - Caching layer

### Authentication & User Management
- **Clerk** - Authentication and user management
- **OAuth** - Social login integration

### DevOps & Deployment
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **PM2** - Process manager
- **GitHub Actions** - CI/CD
- **MongoDB Atlas** - Database hosting

### Development Tools
- **Vite** - Build tool and development server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Swagger** - API documentation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd elevatify
```

2. Install dependencies
```bash
cd front
npm install
```

3. Set up environment variables
Create a `.env` file in the front directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
front/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── App.tsx         # Root component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or support, please reach out through:
- GitHub Issues
- Project Discussion Board

---

<div align="center">
  Made with ❤️ by the Elevatify Team
</div> 
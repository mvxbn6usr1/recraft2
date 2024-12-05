# Recraft Dashboard

A modern web application for interacting with the Recraft AI API, featuring image generation, vectorization, and processing capabilities.

## Features

- 🎨 Image Generation with customizable parameters
- 🔄 Image Processing Tools:
  - Vectorization
  - Background Removal
  - Clarity Upscaling
  - Generative Upscaling
- 💾 Local Image Storage
- 🎯 Custom Style Creation
- 🌓 Dark/Light Mode Support

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript
- Jest for testing
- PM2 for process management

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Recraft API token

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mvxbn6usr1/recraft2.git
cd recraft2
```

2. Install dependencies for both frontend and backend:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd recraft-dashboard
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:

Frontend (.env):
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Backend (.env):
```env
PORT=3000
RECRAFT_API_TOKEN=your_api_token_here
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

## Development

1. Start the backend server:
```bash
cd recraft-dashboard/backend
npm run dev
```

2. Start the frontend development server:
```bash
cd recraft-dashboard
npm run dev
```

The application will be available at http://localhost:5173 or http://localhost:5174

## Production Deployment

### Backend Deployment

1. Build the backend:
```bash
cd recraft-dashboard/backend
npm run build
```

2. Set up environment variables in `.env.production`
3. Run the deployment script:
```bash
./deploy.sh
```

### Frontend Deployment

1. Build the frontend:
```bash
cd recraft-dashboard
npm run build
```

2. Set up environment variables in `.env.production`
3. Run the deployment script:
```bash
./deploy.sh
```

### Server Configuration

1. Install required dependencies:
- Node.js
- PM2
- Nginx

2. Set up SSL certificates using Let's Encrypt
3. Configure Nginx using the provided `nginx.conf`

## Testing

Run backend tests:
```bash
cd recraft-dashboard/backend
npm test
```

Run frontend tests:
```bash
cd recraft-dashboard
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Recraft AI](https://recraft.ai) for providing the image processing API
- [Shadcn UI](https://ui.shadcn.com) for the beautiful UI components
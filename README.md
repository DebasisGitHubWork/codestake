# CodeStake

A platform for developers to stake crypto on their coding goals and earn rewards for consistent progress.

## Project Structure

```
./
├── client/             # Frontend React application
├── server/             # Backend Node.js server
├── package.json        # Root package.json for project management
├── vercel.json         # Vercel deployment configuration
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aadigarg111/hackathon.git
cd hackathon
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your environment variables

4. Start development servers:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run build` - Build both frontend and backend
- `npm run install:all` - Install dependencies for all packages

## Deployment

The project is configured for deployment on Vercel. See [deployment documentation](docs/deployment.md) for details.

## Features

- GitHub OAuth Authentication
- Goal Setting and Tracking
- Peer Groups
- Progress Monitoring
- Crypto Staking (coming soon)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


# new

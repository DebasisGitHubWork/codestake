import express, { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { register, login, logout, getCurrentUser, githubAuthSuccess } from '../controllers/auth';
import { authenticateJWT, isAuthenticated } from '../middleware/auth';

const router: Router = express.Router();

// Define a type-safe wrapper to handle controllers that may or may not return promises
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = fn(req, res, next);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (error) {
      next(error);
    }
  };
};

// Register a new user
router.post('/register', asyncHandler(register));

// Login user
router.post('/login', asyncHandler(login));

// Logout user
router.post('/logout', asyncHandler(logout));

// Get current user
router.get('/me', authenticateJWT, asyncHandler(getCurrentUser));

// Check if GitHub OAuth is configured
const isGithubConfigured = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET;

// GitHub OAuth Routes - Only set up if configured
if (isGithubConfigured) {
  router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );

  router.get('/github/callback',
    passport.authenticate('github', { 
      failureRedirect: `${process.env.CLIENT_URL}/login?error=github_auth_failed`,
      session: true 
    }),
    githubAuthSuccess
  );
} else {
  // Fallback routes that inform the user that GitHub OAuth is not configured
  router.get('/github', (req: Request, res: Response) => {
    res.status(503).json({ 
      message: 'GitHub authentication is not configured on the server',
      error: 'Missing GitHub OAuth credentials'
    });
  });
  
  router.get('/github/callback', (req: Request, res: Response) => {
    res.redirect(`${process.env.CLIENT_URL}/login?error=github_not_configured`);
  });
}

// Debug endpoint to check authentication cookies and headers
router.get('/debug', (req: Request, res: Response) => {
  try {
    const debugInfo = {
      cookies: req.cookies,
      authHeader: req.header('Authorization'),
      isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      user: req.user ? 'exists' : 'missing',
      sessionID: req.sessionID,
      githubConfigured: isGithubConfigured
    };
    
    console.log('Auth debug info:', debugInfo);
    res.json(debugInfo);
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

export default router; 
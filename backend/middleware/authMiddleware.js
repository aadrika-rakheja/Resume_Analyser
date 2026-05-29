import jwt from 'jsonwebtoken';

/**
 * Standard JWT verification middleware to secure backend endpoints
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_resume_analyzer_super_secret_key');

      // Attach decoded payload (contains user _id) to request object
      req.user = {
        id: decoded.id,
        email: decoded.email
      };

      next();
    } catch (error) {
      console.error('⚠️ Token Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

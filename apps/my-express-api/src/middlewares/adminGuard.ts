import jwt from 'jsonwebtoken';

export const adminGuard = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized' 
    });
  }

  try {
    console.log('Decoding token:', token);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    
    // Attach user to request (just like in identifier.ts)
    req.user = decoded;
    console.log('aa token:', req.user);
    // Check for admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Admin access required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin guard error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Invalid or expired token' 
    });
  }
};
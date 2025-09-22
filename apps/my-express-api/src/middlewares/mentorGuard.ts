import jwt from 'jsonwebtoken';

export const mentorGuard = (req, res, next) => {
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
    // Check for mentor role
    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: mentor access required' 
      });
    }

    next();
  } catch (error) {
    console.error('mentor guard error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Invalid or expired token' 
    });
  }
};
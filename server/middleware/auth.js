const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: Missing or invalid Authorization header', 
        code: 'UNAUTHORIZED' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    
    // Supabase sets the 'sub' claim to the user's UUID
    req.user = { id: decoded.sub, ...decoded };
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token', 
      code: 'INVALID_TOKEN' 
    });
  }
};

module.exports = requireAuth;

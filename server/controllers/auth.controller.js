const supabase = require('../lib/supabase');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // We use the regular auth endpoint but forward the backend service
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(401).json({ 
        success: false, 
        error: error.message, 
        code: 'AUTH_FAILED' 
      });
    }
    
    return res.json({
      success: true,
      data: {
        access_token: data.session.access_token,
        user: data.user
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

exports.logout = async (req, res) => {
  return res.json({ 
    success: true, 
    data: { message: 'Logged out successfully' } 
  });
};

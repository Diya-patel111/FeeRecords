const supabase = require('../lib/supabase');

exports.getStandards = async (req, res) => {
  try {
    const { data: standards, error } = await supabase
      .from('standards')
      .select('*')
      .eq('teacher_id', req.user.id)
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: standards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

exports.createStandard = async (req, res) => {
  try {
    const { name, display_order } = req.body;

    const { data, error } = await supabase
      .from('standards')
      .insert([{ name, display_order, teacher_id: req.user.id }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

exports.deleteStandard = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if standard has students
    const { data: students, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('standard_id', id)
      .eq('teacher_id', req.user.id)
      .limit(1);

    if (studentError) throw studentError;

    if (students && students.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete standard with existing students attached', 
        code: 'CONSTRAINT_VIOLATION' 
      });
    }

    const { error } = await supabase
      .from('standards')
      .delete()
      .eq('id', id)
      .eq('teacher_id', req.user.id);

    if (error) throw error;

    res.json({ success: true, data: { message: 'Standard deleted successfully' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

const supabase = require('../lib/supabase');

exports.getStudents = async (req, res) => {
  try {
    const { standard_id } = req.query;

    let query = supabase
      .from('student_fee_summary')
      .select('*')
      .eq('teacher_id', req.user.id);
      
    if (standard_id) {
      query = query.eq('standard_id', standard_id);
    }
    
    const { data: students, error } = await query.order('full_name', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { full_name, standard_id, total_fees } = req.body;

    // Verify standard belongs to teacher
    const { data: standard, error: stdError } = await supabase
      .from('standards')
      .select('id')
      .eq('id', standard_id)
      .eq('teacher_id', req.user.id)
      .single();

    if (stdError || !standard) {
      return res.status(403).json({ success: false, error: 'Standard not found or unauthorized', code: 'FORBIDDEN' });
    }

    const { data, error } = await supabase
      .from('students')
      .insert([{
        full_name: full_name,
        standard_id,
        total_fees,
        teacher_id: req.user.id
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, standard_id, total_fees } = req.body;

    // Check ownership
    const { data: studentCheck, error: chkError } = await supabase
      .from('students')
      .select('id')
      .eq('id', id)
      .eq('teacher_id', req.user.id)
      .single();

    if (chkError || !studentCheck) {
      return res.status(404).json({ success: false, error: 'Student not found', code: 'NOT_FOUND' });
    }

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (standard_id !== undefined) updates.standard_id = standard_id;
    if (total_fees !== undefined) updates.total_fees = total_fees;

    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .eq('teacher_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('students')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('teacher_id', req.user.id);

    if (error) throw error;

    res.json({ success: true, data: { message: 'Student deleted successfully' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

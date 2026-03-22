const supabase = require('../lib/supabase');

exports.getPayments = async (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
       return res.status(400).json({ success: false, error: 'student_id is required', code: 'BAD_REQUEST' });
    }

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', student_id)
      .eq('teacher_id', req.user.id)
      .order('payment_date', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { student_id, amount, payment_date, note } = req.body;

    // Verify student belongs to teacher
    const { data: student, error: stuError } = await supabase
      .from('students')
      .select('id')
      .eq('id', student_id)
      .eq('teacher_id', req.user.id)
      .single();

    if (stuError || !student) {
      return res.status(403).json({ success: false, error: 'Student not found or unauthorized', code: 'FORBIDDEN' });
    }

    const { data, error } = await supabase
      .from('payments')
      .insert([{
        student_id,
        amount,
        payment_date,
        notes: note,
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

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)
      .eq('teacher_id', req.user.id);

    if (error) throw error;

    res.json({ success: true, data: { message: 'Payment deleted successfully' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

const supabase = require('../lib/supabase');

exports.getSummary = async (req, res) => {
  try {
    // Get all standards for this teacher
    const { data: standards, error: stError } = await supabase
      .from('standards')
      .select('*')
      .eq('teacher_id', req.user.id);
      
    if (stError) throw stError;

    // Get all students fee summary for this teacher
    const { data: students, error: studError } = await supabase
      .from('student_fee_summary')
      .select('*')
      .eq('teacher_id', req.user.id);

    if (studError) throw studError;

    let total_fees_set = 0;
    let total_collected = 0;
    let total_pending = 0;
    let total_students = students ? students.length : 0;

    const stdMap = {};
    standards.forEach(s => {
      stdMap[s.id] = {
        id: s.id,
        name: s.name,
        student_count: 0,
        collected: 0,
        pending: 0,
        target: 0,
        percent: 0
      };
    });

    if (students) {
      students.forEach(st => {
        const tFees = Number(st.total_fees) || 0;
        const pFees = Number(st.paid_amount) || 0;
        const remFees = Number(st.remaining_amount) || 0;

        total_fees_set += tFees;
        total_collected += pFees;
        total_pending += remFees;

        if (stdMap[st.standard_id]) {
          stdMap[st.standard_id].student_count += 1;
          stdMap[st.standard_id].target += tFees;
          stdMap[st.standard_id].collected += pFees;
          stdMap[st.standard_id].pending += remFees;
        }
      });
    }

    const standardsArray = Object.values(stdMap).map(s => {
      s.percent = s.target > 0 ? Math.round((s.collected / s.target) * 100) : 0;
      return s;
    });

    res.json({
      success: true,
      data: {
        total_students,
        total_fees_set,
        total_collected,
        total_pending,
        standards: standardsArray
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: 'SERVER_ERROR' });
  }
};

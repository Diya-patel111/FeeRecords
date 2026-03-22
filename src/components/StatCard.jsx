export default function StatCard({ label, value, type = 'default', subtitle }) {
  const getStyles = () => {
    switch (type) {
      case 'primary': return 'border-l-4 border-l-primary bg-surface-container-lowest outline outline-1 outline-outline-variant';
      case 'danger': return 'bg-error-container border border-error/20';
      case 'success': return 'border-l-4 border-l-primary bg-surface-container-lowest outline outline-1 outline-outline-variant';
      default: return 'bg-surface-container-lowest outline outline-1 outline-outline-variant';
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'danger': return 'text-error';
      case 'success': return 'text-primary';
      default: return 'text-on-surface';
    }
  };

  return (
    <div className={`p-6 md:p-8 rounded-xl shadow-sm font-body ${getStyles()}`}>
      <p className={`font-bold text-xs uppercase tracking-widest mb-2 ${type === 'danger' ? 'text-error' : 'text-on-surface-variant'}`}>
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-headline ${getValueColor()}`}>
          {value}
        </span>
      </div>
      {subtitle && (
        <div className={`mt-3 text-sm font-medium ${type === 'danger' ? 'text-error/80' : 'text-on-surface-variant'}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
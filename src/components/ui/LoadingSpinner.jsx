import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  return (
    <div className={`spinner-wrapper spinner-${size}`} role="status" aria-label={label}>
      <div className="spinner-ring">
        <div className="spinner-arc" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

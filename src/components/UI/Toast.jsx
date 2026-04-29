'use client';

export default function Toast({ mensaje, tipo }) {
  const color = tipo === 'success' ? '#4ADE80' : tipo === 'error' ? '#FF6B8A' : 'var(--color-primary)';
  return (
    <div className="toast" style={{ borderColor: color }}>
      <span style={{ color }}>{mensaje}</span>
    </div>
  );
}

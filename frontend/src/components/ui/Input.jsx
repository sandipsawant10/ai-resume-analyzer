export default function Input({ className = "", label, hint, ...props }) {
  return (
    <label className="block space-y-2 text-sm">
      {label ? <span className="text-slate-200">{label}</span> : null}
      <input
        className={`w-full rounded-2xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

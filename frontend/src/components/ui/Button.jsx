const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-purple-500",
  secondary:
    "border border-slate-700/70 bg-slate-900/60 text-slate-200 hover:bg-slate-800",
  ghost: "text-slate-300 hover:bg-slate-800/60",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  const classes = `${base} ${variants[variant] || variants.primary} ${
    sizes[size] || sizes.md
  } ${className}`;

  return <button type={type} className={classes} {...props} />;
}

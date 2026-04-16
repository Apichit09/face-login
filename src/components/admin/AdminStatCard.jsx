export default function AdminStatCard({
  title,
  value,
  icon,
  alt,
  color = "blue",
  subtitle,
}) {
  const colorMap = {
    blue: {
      ring: "ring-blue-100",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    green: {
      ring: "ring-green-100",
      bg: "bg-green-50",
      text: "text-green-700",
    },
    red: {
      ring: "ring-red-100",
      bg: "bg-red-50",
      text: "text-red-700",
    },
    amber: {
      ring: "ring-amber-100",
      bg: "bg-amber-50",
      text: "text-amber-700",
    },
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-neutral-900">{value}</h3>
          {subtitle ? (
            <p className="mt-2 text-xs text-neutral-500">{subtitle}</p>
          ) : null}
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.bg} ring-1 ${theme.ring}`}
        >
          <img src={icon} alt={alt} className="h-8 w-8 object-contain" />
        </div>
      </div>
    </div>
  );
}
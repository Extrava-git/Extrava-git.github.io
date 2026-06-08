const stats = [
  { value: "<60s", label: "from leak onset to bedside alert in bench testing" },
  { value: "0.1°C", label: "thermal resolution across the contact array" },
  { value: "8 hr", label: "continuous wear on a single rechargeable cell" },
  { value: "BLE 5.0", label: "low-energy wireless to any nurse station device" },
];

export default function Stats() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="card p-8">
              <div className="font-display text-5xl md:text-6xl font-semibold text-white tracking-tight">
                {s.value}
              </div>
              <p className="mt-4 text-sm text-ink-300 leading-relaxed">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

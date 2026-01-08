'use client';

export default function ServicesSection() {
  const services = [
    { 
      title: 'Mantenimiento preventivo', 
      desc: 'Inspecciones programadas y recambio de componentes para maximizar disponibilidad.',
      icon: '🔧'
    },
    { 
      title: 'Cumplimiento de seguridad', 
      desc: 'Auditorías y documentación conforme a estándares internacionales.',
      icon: '🛡️'
    },
    { 
      title: 'Optimización de procesos', 
      desc: 'Mejoras de eficiencia energética y de throughput con KPIs medibles.',
      icon: '⚡'
    },
  ];

  return (
    <section id="servicios" className="py-12" aria-labelledby="servicios-heading">
      <div className="mx-auto max-w-7xl px-4">
        <h2 id="servicios-heading" className="text-2xl font-bold text-gray-900 mb-6">Servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
          {services.map((s) => (
            <div key={s.title} className="rounded-xl border bg-white p-5 hover:shadow-lg transition-shadow duration-300" role="listitem">
              <div className="text-3xl mb-3" aria-hidden="true">{s.icon}</div>
              <div className="font-semibold text-lg text-gray-900 mb-2">{s.title}</div>
              <div className="text-sm text-gray-600">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


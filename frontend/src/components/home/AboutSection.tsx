'use client';

import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="nosotros" className="py-12 bg-gray-50" aria-labelledby="nosotros-heading">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 id="nosotros-heading" className="text-2xl font-bold text-gray-900 mb-4">Nosotros</h2>
            <p className="text-gray-700 mb-4">Nacimos para brindar soluciones industriales confiables. Nuestra trayectoria se sustenta en valores de integridad, innovación y compromiso con la seguridad.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6" role="list">
              <div className="rounded-xl border bg-white p-4 hover:shadow-md transition-shadow" role="listitem">
                <div className="font-semibold text-gray-900 mb-2">Orígenes</div>
                <div className="text-sm text-gray-600">Equipo con décadas de experiencia en campo.</div>
              </div>
              <div className="rounded-xl border bg-white p-4 hover:shadow-md transition-shadow" role="listitem">
                <div className="font-semibold text-gray-900 mb-2">Certificaciones</div>
                <div className="text-sm text-gray-600">ISO 9001, ISO 14001 y cumplimiento de seguridad.</div>
              </div>
              <div className="rounded-xl border bg-white p-4 hover:shadow-md transition-shadow" role="listitem">
                <div className="font-semibold text-gray-900 mb-2">Cultura</div>
                <div className="text-sm text-gray-600">Trabajo colaborativo y mejora continua.</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4" id="equipo-heading">Equipo directivo</h3>
            <div className="space-y-4" role="list" aria-labelledby="equipo-heading">
              {["Laura", "Carlos", "Anita"].map((name) => (
                <div key={name} className="flex items-center gap-4" role="listitem">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image 
                      src="/home2/img/team-2-1.jpg" 
                      alt={`${name}, Director(a) de Industrias SP`} 
                      fill 
                      className="object-cover rounded-full"
                      sizes="56px"
                      quality={85}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{name}</div>
                    <div className="text-sm text-gray-600">Director(a)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


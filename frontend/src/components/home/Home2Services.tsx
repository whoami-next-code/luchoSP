'use client';

import Image from 'next/image';

const services = [
  { title: 'Fuel & Gas', description: 'Sed quia non numquam eius modi tempora incidunt ut labore..', image: '/home2/img/service-2-1.jpg' },
  { title: 'Chemical Research', description: 'Sed quia non numquam eius modi tempora incidunt ut labore..', image: '/home2/img/service-2-2.jpg' },
  { title: 'Echo & Bio Power', description: 'Sed quia non numquam eius modi tempora incidunt ut labore..', image: '/home2/img/service-2-3.jpg' },
];

export default function Home2Services() {
  return (
    <section className="service-style-three sec-pad py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-orange-500 italic">Services</span> we provide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">You will find yourself working in a true partnership that results in an incredible experience, and an end product that is the best.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-64">
                <Image src={s.image} alt={s.title} fill className="object-cover" />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-11/12 bg-orange-500 text-white text-center rounded-xl p-6">
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm">{s.description}</p>
              </div>
              <div className="h-12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


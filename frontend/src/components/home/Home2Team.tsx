'use client';

import Image from 'next/image';

const team = [
  { name: 'Margorie Hych', role: 'Plumber', image: '/home2/img/team-2-1.jpg' },
  { name: 'Latanya Julca', role: 'Constructor', image: '/home2/img/team-2-2.jpg' },
  { name: 'Aileen Metchikoff', role: 'Founder & CEO', image: '/home2/img/team-2-3.jpg' },
  { name: 'Jordan Sisomphou', role: 'Constructor', image: '/home2/img/team-2-3.jpg' },
];

export default function Home2Team() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Team <span className="text-orange-500 italic">& Advisory</span> board</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">You will find yourself working in a true partnership that results in an incredible experience, and an end product that is the best.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((m, i) => (
            <div key={i} className="text-center">
              <div className="relative h-72">
                <Image src={m.image} alt={m.name} fill className="object-cover rounded-xl" />
              </div>
              <div className="mt-4">
                <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded">{m.name}</div>
                <div className="text-gray-600 mt-2 text-sm">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

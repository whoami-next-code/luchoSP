'use client';

import Image from 'next/image';

const projects = [
  '/home2/img/project-2-1.jpg',
  '/home2/img/project-2-2.jpg',
  '/home2/img/project-2-3.jpg',
  '/home2/img/project-2-4.jpg',
  '/home2/img/project-2-5.jpg',
  '/home2/img/project-2-6.jpg',
  '/home2/img/project-2-7.jpg',
  '/home2/img/project-2-8.jpg',
];

export default function Home2Projects() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Projects for <span className="text-orange-500 italic">inspirations</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">You will find yourself working in a true partnership that results in an incredible experience, and an end product that is the best.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image src={src} alt="Project" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


'use client';

export default function Home2WhyChoose() {
  return (
    <section className="py-16 bg-[#121212] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Why choose <span className="text-orange-500 italic">us</span><span className="text-white">?</span></h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <p className="text-gray-300">Manufacturing industry became a key sector of production and labour in European and North American countries during the Industrial Revolution, upsetting previous mercantile and feudal economies.</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Working ability</span><span className="text-gray-300">70%</span></div>
                <div className="h-2 bg-white/20 rounded"><div className="h-2 bg-orange-500 rounded w-[70%]" /></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Machine Power</span><span className="text-gray-300">90%</span></div>
                <div className="h-2 bg-white/20 rounded"><div className="h-2 bg-orange-500 rounded w-[90%]" /></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Time management</span><span className="text-gray-300">60%</span></div>
                <div className="h-2 bg-white/20 rounded"><div className="h-2 bg-orange-500 rounded w-[60%]" /></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl text-orange-500 font-bold">101</div>
              <div className="text-sm">5 Star Rating</div>
            </div>
            <div className="border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl text-orange-500 font-bold">32</div>
              <div className="text-sm">Team Members</div>
            </div>
            <div className="border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl text-orange-500 font-bold">90</div>
              <div className="text-sm">Happy Clients</div>
            </div>
            <div className="border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl text-orange-500 font-bold">204</div>
              <div className="text-sm">Completed Job</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="rounded-xl p-6 bg-white text-gray-900">
            <div className="font-bold mb-2">Creative Ideas</div>
            <div className="text-sm">Sed quia non numquam eius modi tempora incidunt ut labore.</div>
          </div>
          <div className="rounded-xl p-6 bg-orange-500 text-white">
            <div className="font-bold mb-2">Super Safety</div>
            <div className="text-sm">Sed quia non numquam eius modi tempora incidunt ut labore.</div>
          </div>
          <div className="rounded-xl p-6 bg-[#1f1f1f]">
            <div className="font-bold mb-2">24/7 Support</div>
            <div className="text-sm text-gray-200">Sed quia non numquam eius modi tempora incidunt ut labore.</div>
          </div>
        </div>
      </div>
    </section>
  );
}


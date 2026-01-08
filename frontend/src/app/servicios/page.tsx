import React from 'react';
import { Wrench, Zap, Shield, Users, Star, ChevronRight } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  image: string;
}

interface Testimonial {
  id: string;
  clientName: string;
  clientCompany: string;
  testimonial: string;
  rating: number;
  clientPhoto: string;
}

const services: Service[] = [
  {
    id: '1',
    name: 'Mantenimiento Industrial',
    description: 'Servicios completos de mantenimiento preventivo y correctivo para equipos industriales.',
    icon: <Wrench className="h-12 w-12 text-blue-600" />,
    features: [
      'Mantenimiento preventivo programado',
      'Diagnóstico de fallas avanzado',
      'Reparación de equipos industriales',
      'Suministro de repuestos originales'
    ],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20maintenance%20equipment%20in%20factory%20setting%20professional%20clean%20modern&image_size=landscape_16_9'
  },
  {
    id: '2',
    name: 'Instalaciones Eléctricas',
    description: 'Diseño e instalación de sistemas eléctricos industriales y comerciales.',
    icon: <Zap className="h-12 w-12 text-blue-600" />,
    features: [
      'Diseño de sistemas eléctricos',
      'Instalación de tableros eléctricos',
      'Cableado industrial',
      'Certificaciones eléctricas'
    ],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20electrical%20installation%20professional%20clean%20modern%20factory&image_size=landscape_16_9'
  },
  {
    id: '3',
    name: 'Seguridad Industrial',
    description: 'Implementación de sistemas de seguridad y cumplimiento normativo.',
    icon: <Shield className="h-12 w-12 text-blue-600" />,
    features: [
      'Auditorías de seguridad',
      'Implementación de normativas',
      'Capacitación de personal',
      'Sistemas de protección personal'
    ],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20safety%20equipment%20professional%20clean%20modern%20factory%20setting&image_size=landscape_16_9'
  },
  {
    id: '4',
    name: 'Consultoría Técnica',
    description: 'Asesoramiento especializado en proyectos industriales y optimización de procesos.',
    icon: <Users className="h-12 w-12 text-blue-600" />,
    features: [
      'Análisis de procesos industriales',
      'Optimización de operaciones',
      'Implementación de mejoras',
      'Capacitación técnica especializada'
    ],
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20consulting%20team%20professional%20clean%20modern%20office&image_size=landscape_16_9'
  }
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Carlos Rodríguez',
    clientCompany: 'Minera Andina S.A.',
    testimonial: 'Excelente servicio de mantenimiento industrial. Su equipo técnico es altamente profesional y cumplió con todos los plazos establecidos.',
    rating: 5,
    clientPhoto: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20man%20headshot%20clean%20modern%20corporate&image_size=square'
  },
  {
    id: '2',
    clientName: 'María González',
    clientCompany: 'Industrias Textiles del Perú',
    testimonial: 'La instalación eléctrica que realizaron superó nuestras expectativas. Cumplen con todas las normativas de seguridad.',
    rating: 5,
    clientPhoto: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20woman%20headshot%20clean%20modern%20corporate&image_size=square'
  },
  {
    id: '3',
    clientName: 'Roberto Mendoza',
    clientCompany: 'Constructora Progreso',
    testimonial: 'Su consultoría técnica nos ayudó a optimizar nuestros procesos y reducir costos operativos significativamente.',
    rating: 5,
    clientPhoto: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20man%20headshot%20clean%20modern%20corporate&image_size=square'
  }
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-800 to-blue-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Soluciones industriales integrales con más de 15 años de experiencia. 
            Especialistas en mantenimiento, instalaciones y consultoría técnica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Solicitar Cotización
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-800 transition-colors">
              Ver Catálogo
            </button>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Servicios Especializados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos soluciones integrales para la industria peruana, 
              garantizando calidad, seguridad y eficiencia en cada proyecto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {service.icon}
                    <h3 className="text-xl font-bold text-gray-900 ml-3">{service.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Más Información
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La satisfacción de nuestros clientes es nuestra mejor garantía de calidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.clientPhoto} 
                    alt={testimonial.clientName}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.clientName}</h4>
                    <p className="text-sm text-gray-600">{testimonial.clientCompany}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para mejorar tu operación industrial?
          </h2>
          <p className="text-xl mb-8">
            Contáctanos hoy mismo y descubre cómo podemos ayudarte a optimizar tus procesos industriales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Solicitar Consultoría Gratis
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-800 transition-colors">
              Ver Casos de Éxito
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
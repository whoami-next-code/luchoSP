import React from 'react';
import { Users, Award, Calendar, MapPin, Mail, Phone, ChevronRight, Star, Shield, Wrench, Zap } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
}

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  logo: string;
  validity: string;
}

export default function NosotrosPage() {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Carlos Rodríguez',
      position: 'Director General',
      bio: 'Ingeniero Industrial con más de 20 años de experiencia en el sector industrial. Especializado en optimización de procesos y gestión de equipos técnicos.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20engineer%20corporate%20headshot%20confident%20industrial%20setting&image_size=square_hd',
      linkedin: '#',
      email: 'carlos.rodriguez@industriasp.com'
    },
    {
      id: '2',
      name: 'María González',
      position: 'Gerente de Operaciones',
      bio: 'Ingeniera Eléctrica con especialización en sistemas de automatización industrial. Líder en proyectos de modernización de plantas.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20engineer%20corporate%20headshot%20confident%20industrial%20setting&image_size=square_hd',
      linkedin: '#',
      email: 'maria.gonzalez@industriasp.com'
    },
    {
      id: '3',
      name: 'Roberto Méndez',
      position: 'Jefe de Mantenimiento',
      bio: 'Técnico en Mantenimiento Industrial con certificaciones internacionales. Experto en diagnóstico predictivo y mantenimiento preventivo.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20technician%20corporate%20headshot%20confident%20industrial%20setting&image_size=square_hd',
      linkedin: '#',
      email: 'roberto.mendez@industriasp.com'
    },
    {
      id: '4',
      name: 'Ana Martínez',
      position: 'Coordinadora de Seguridad',
      bio: 'Ingeniera en Seguridad Industrial con maestría en gestión de riesgos. Certificada en normativas OSHA y estándares internacionales.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20safety%20engineer%20corporate%20headshot%20confident%20industrial%20setting&image_size=square_hd',
      linkedin: '#',
      email: 'ana.martinez@industriasp.com'
    }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      year: '2005',
      title: 'Fundación de la Empresa',
      description: 'Inicio de operaciones con un equipo de 5 personas, enfocados en servicios de mantenimiento industrial básico.',
      icon: <Calendar className="h-6 w-6 text-blue-600" />
    },
    {
      id: '2',
      year: '2008',
      title: 'Expansión de Servicios',
      description: 'Incorporación de servicios de instalaciones eléctricas y primeros contratos con empresas multinacionales.',
      icon: <Zap className="h-6 w-6 text-blue-600" />
    },
    {
      id: '3',
      year: '2012',
      title: 'Certificación ISO 9001',
      description: 'Obtención de la certificación de calidad ISO 9001, consolidando nuestros procesos y estándares de servicio.',
      icon: <Award className="h-6 w-6 text-blue-600" />
    },
    {
      id: '4',
      year: '2016',
      title: 'Departamento de Seguridad',
      description: 'Creación del departamento de seguridad industrial y obtención de certificaciones OSHA.',
      icon: <Shield className="h-6 w-6 text-blue-600" />
    },
    {
      id: '5',
      year: '2020',
      title: 'Digitalización y Tecnología',
      description: 'Implementación de tecnologías IoT para mantenimiento predictivo y plataforma de gestión digital.',
      icon: <Wrench className="h-6 w-6 text-blue-600" />
    },
    {
      id: '6',
      year: '2024',
      title: 'Crecimiento Sostenible',
      description: 'Alcanzamos los 100 empleados y expandimos operaciones a nivel nacional con oficinas en 5 ciudades principales.',
      icon: <Star className="h-6 w-6 text-blue-600" />
    }
  ];

  const certifications: Certification[] = [
    {
      id: '1',
      name: 'ISO 9001:2015',
      issuer: 'Organización Internacional de Normalización',
      year: '2012',
      logo: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=ISO%209001%20certification%20logo%20professional%20clean%20design&image_size=square',
      validity: 'Válida hasta 2025'
    },
    {
      id: '2',
      name: 'OSHA 30-Hour',
      issuer: 'Occupational Safety and Health Administration',
      year: '2016',
      logo: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=OSHA%20certification%20logo%20professional%20safety%20design&image_size=square',
      validity: 'Válida hasta 2025'
    },
    {
      id: '3',
      name: 'Certificación NEC',
      issuer: 'National Fire Protection Association',
      year: '2018',
      logo: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=NEC%20electrical%20certification%20logo%20professional%20design&image_size=square',
      validity: 'Válida hasta 2026'
    },
    {
      id: '4',
      name: 'Green Industry',
      issuer: 'Green Building Council',
      year: '2020',
      logo: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=green%20building%20certification%20logo%20sustainable%20professional&image_size=square',
      validity: 'Válida hasta 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Sobre Nosotros
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Con más de 19 años de experiencia, somos líderes en soluciones industriales integrales
          </p>
        </div>
      </section>

      {/* Company Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
              <p className="text-lg text-gray-600 mb-8">
                Proporcionar soluciones industriales integrales de alta calidad que optimicen los procesos productivos 
                de nuestros clientes, garantizando seguridad, eficiencia y sostenibilidad en cada proyecto.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
              <p className="text-lg text-gray-600 mb-8">
                Ser reconocidos como la empresa líder en servicios industriales en el país, destacando por nuestra 
                excelencia técnica, innovación constante y compromiso con el desarrollo sostenible.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                  <div className="text-gray-600">Profesionales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Proyectos Completados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">19</div>
                  <div className="text-gray-600">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                  <div className="text-gray-600">Ciudades con Oficinas</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20industrial%20facility%20professional%20clean%20organized%20high-tech%20equipment&image_size=landscape_16_9"
                alt="Instalaciones industriales"
                className="rounded-lg shadow-xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Equipo Directivo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce a los líderes que hacen posible nuestra excelencia en servicios industriales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                  
                  <div className="flex space-x-3">
                    {member.linkedin && (
                      <a href={member.linkedin} className="text-blue-600 hover:text-blue-700 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              19 años de crecimiento constante y excelencia en servicios industriales
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                      <div className="flex items-center mb-4">
                        {index % 2 === 0 ? (
                          <>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-blue-600 mb-1">{event.year}</h3>
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h4>
                            </div>
                            <div className="ml-4 p-3 bg-blue-100 rounded-full">
                              {event.icon}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mr-4 p-3 bg-blue-100 rounded-full">
                              {event.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-blue-600 mb-1">{event.year}</h3>
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h4>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Certificaciones y Reconocimientos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nuestro compromiso con la excelencia y la calidad nos ha valido importantes reconocimientos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <img
                  src={cert.logo}
                  alt={cert.name}
                  className="w-24 h-24 mx-auto mb-4 object-contain"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                <p className="text-sm text-blue-600 font-medium mb-1">Obtenida en {cert.year}</p>
                <p className="text-xs text-gray-500">{cert.validity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en nuestra empresa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Seguridad Primero</h3>
              <p className="text-blue-100">
                La seguridad de nuestros trabajadores y clientes es nuestra prioridad absoluta en cada proyecto.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excelencia</h3>
              <p className="text-blue-100">
                Buscamos la perfección en cada detalle, superando las expectativas de nuestros clientes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trabajo en Equipo</h3>
              <p className="text-blue-100">
                Valoramos la colaboración y el respeto mutuo como base de nuestro éxito colectivo.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovación</h3>
              <p className="text-blue-100">
                Constantemente buscamos nuevas tecnologías y métodos para mejorar nuestros servicios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para trabajar con nosotros?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Con más de 19 años de experiencia, estamos listos para ayudarte con tus proyectos industriales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacto"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Contactar Ahora
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/servicios"
              className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Ver Servicios
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
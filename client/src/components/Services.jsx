import React from 'react';

const ServiceCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4 text-blue-600">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      id: 1, 
      title: 'Book Borrowing', 
      description: 'Borrow up to 5 books for up to 3 weeks with an option to extend.',
      icon: '📖'
    },
    {
      id: 2, 
      title: 'Online Reservations', 
      description: 'Reserve books online and pick them up at your convenience.',
      icon: '🖥️'
    },
    {
      id: 3, 
      title: 'Study Spaces', 
      description: 'Quiet study spaces available for individual or group study.',
      icon: '🏫'
    },
  ];

  return (
    <section id="services" className="my-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard 
            key={service.id}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default Services;
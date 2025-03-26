import React from 'react';

const CategoryCard = ({ name, count, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-gray-600 text-sm">{count} books</p>
      </div>
    </div>
  );
};

const Categories = () => {
  const categories = [
    { id: 1, name: 'Fiction', count: 243, icon: '📚' },
    { id: 2, name: 'Science', count: 182, icon: '🔬' },
    { id: 3, name: 'History', count: 129, icon: '🏛️' },
    { id: 4, name: 'Biography', count: 97, icon: '👤' },
    { id: 5, name: 'Technology', count: 156, icon: '💻' },
    { id: 6, name: 'Arts', count: 68, icon: '🎨' },
  ];

  return (
    <section id="categories" className="my-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard 
            key={category.id}
            name={category.name}
            count={category.count}
            icon={category.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default Categories;
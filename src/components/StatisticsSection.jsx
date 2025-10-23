import React from 'react';

const StatisticsSection = () => {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 sm:mb-12">
          Nossas Estatísticas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Estatística 1 */}
          <div className="p-6">
            <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600">2.541</p>
            <p className="text-gray-600 text-base sm:text-lg mt-2">Feedbacks Registrados</p>
          </div>

          {/* Estatística 2 */}
          <div className="p-6">
            <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-600">85%</p>
            <p className="text-gray-600 text-base sm:text-lg mt-2">Taxa de Resolução</p>
          </div>

          {/* Estatística 3 */}
          <div className="p-6">
            <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-500">324</p>
            <p className="text-gray-600 text-base sm:text-lg mt-2">Feedbacks em Análise</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;

const HowItWorksSection = () => {
  return (
    <section className="bg-gray-100 py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-10 sm:mb-12">
          Como Funciona
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300 max-w-sm mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">1. Registre um Feedback</h4>
            <p className="text-gray-600 text-sm sm:text-base">Descreva o problema em detalhes, anexando tags e fotos.</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300 max-w-sm mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">2. Acompanhe o Status</h4>
            <p className="text-gray-600 text-sm sm:text-base">Receba atualizações sobre o andamento de seu feedback, de forma transparente.</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300 max-w-sm mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M10 15h4M10 19h4" />
            </svg>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">3. Mude a sua Escola</h4>
            <p className="text-gray-600 text-sm sm:text-base">Contribua para a melhoria da qualidade de ensino e da comunidade escolar.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

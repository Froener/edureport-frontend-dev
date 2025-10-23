import { NavLink } from "react-router-dom";

const HeroSection = () => {
  return (
    <header
      className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-stone
                 py-20 sm:py-24 md:py-32 lg:py-40 text-center overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug sm:leading-tight md:leading-tight lg:leading-tight tracking-tight mb-4 text-white">
          Sua voz muda a escola
        </h2>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto mb-8 text-white">
          Sua voz é importante! Ajude a construir um ambiente melhor. <br />
          Conte o que está dando certo, aponte melhorias e compartilhe elogios ou problemas.
        </p>

        <NavLink to="/complaintregister">
          <button
            className="bg-green-500 text-white font-bold py-3 px-6 sm:px-8 md:py-4 md:px-10 lg:py-5 lg:px-12 
                       rounded-full text-base sm:text-lg md:text-xl shadow-xl 
                       hover:bg-green-600 transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
            Enviar Feedback
          </button>
        </NavLink>
      </div>
    </header>
  );
};

export default HeroSection;

import { NavLink } from "react-router-dom";
import { useAuth } from "../Security/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  function handleUser() {
    if (user.userType === "school") {
      return "/schoolcontrolpanel";
    } else if (user.userType === "admin") {
      return "/admincontrolpanel";
    } else {
      return "/studentcontrolpanel";
    }
  }

  return (
    <>
      <nav className="bg-white p-4  flex justify-between items-center fixed w-full top-0 z-50 ">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>

          <NavLink to="/">
            <h1 className="text-xl font-bold text-blue-600">Sua Voz na Escola</h1>
          </NavLink>
        </div>

        {/* Botão hamburger para mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 focus:outline-none">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-4">
          <NavLink to="/howitworks">
            <button className="text-blue-600 font-semibold py-2 px-4 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition duration-300 cursor-pointer">
              Como Funciona
            </button>
          </NavLink>

          {isAuthenticated() ? (
            <>
              <NavLink to={handleUser()}>
                <button className="text-blue-600 font-semibold py-2 px-4 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition duration-300 cursor-pointer">
                  Olá, {user?.fullName}
                </button>
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-red-600 border-2 border-red-600 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-red-500 transition duration-300 cursor-pointer">
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <button className="text-blue-600 font-semibold py-2 px-4 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition duration-300 cursor-pointer">
                  Entrar
                </button>
              </NavLink>
              <NavLink to="/signup">
                <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-blue-700 transition duration-300 cursor-pointer">
                  Criar Conta
                </button>
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-white w-full fixed top-16 left-0 z-40 flex flex-col items-center space-y-2 p-4 shadow">
          <NavLink to="/howitworks" onClick={() => setIsOpen(false)}>
            <button className="text-blue-600 font-semibold py-2 px-4 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition duration-300">
              Como Funciona
            </button>
          </NavLink>

          {isAuthenticated() ? (
            <>
              <NavLink to={handleUser()} onClick={() => setIsOpen(false)}>
                <button className="text-blue-600 font-semibold py-2 px-4 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition duration-300">
                  Olá, {user?.fullName}
                </button>
              </NavLink>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-red-600 border-2 border-red-600 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-red-500 transition duration-300">
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setIsOpen(false)}>
                <button className="text-blue-600 font-semibold py-2 px-4 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition duration-300">
                  Entrar
                </button>
              </NavLink>
              <NavLink to="/signup" onClick={() => setIsOpen(false)}>
                <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow hover:bg-blue-700 transition duration-300">
                  Criar Conta
                </button>
              </NavLink>
            </>
          )}
        </div>
      )}
       
    </>
  );
};

export default Navbar;

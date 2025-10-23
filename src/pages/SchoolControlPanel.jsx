import { NavLink } from "react-router-dom";
import { useAuth } from "../Security/AuthContext";

const SchoolControlPainel = () => {
  const { user } = useAuth();

  return (
    <section className="pt-28 w-full max-w-6xl mx-auto px-6">
      <h1 className="text-center mb-4 text-blue-600 text-4xl font-bold">
        Bem-vindo, <span>{user.fullName}</span>
      </h1>

      <p className="text-center text-gray-700 text-lg mb-10">
        Aqui você encontra os principais recursos para gerenciar sua instituição
        e acompanhar seus feedbacks recebidos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <NavLink
          to="/schoolprofile"
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-blue-600 font-bold text-xl mb-2">Seu Perfil</h2>
          <p className="text-gray-600 text-sm">
            Edite as informações da escola e mantenha tudo atualizado.
          </p>
        </NavLink>

        <NavLink
          to="/createfeedback"
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-red-600 font-bold text-xl mb-2">
            Suas Denúncias
          </h2>
          <p className="text-gray-600 text-sm">
            Acompanhe seus feedbacks recebidos e tome providências.
          </p>
        </NavLink>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 shadow-inner mb-12">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Dados da Instituição
        </h3>
        <ul className="text-gray-700 space-y-2">
          <li>
            <strong>Nome da Escola:</strong> {user.fullName || "Não informado"}
          </li>
          <li>
            <strong>Endereço:</strong>{" "}
            {user.addressNeighborhood && user.addressCity && user.addressState
              ? `${user.addressNeighborhood}, ${user.addressCity} - ${user.addressState}`
              : "Não informado"}
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SchoolControlPainel;

import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../Security/AuthContext";

const ComplaintRegister = () => {
  const { user, loading: authLoading } = useAuth();
  const [badTags, setBadTags] = useState([]);
  const [goodTags, setGoodTags] = useState([]);
  const [selectedBad, setSelectedBad] = useState([]);
  const [selectedGood, setSelectedGood] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schoolId = user?.school?.schoolId;
  const schoolName = user?.school?.schoolName || "Sua Escola";

  const fetchSchoolTags = useCallback(async () => {
    if (!schoolId) return;

    try {
      setIsLoading(true);
      const [positiveTags, negativeTags] = await Promise.all([
        api.getPositiveTagsBySchool(schoolId),
        api.getNegativeTagsBySchool(schoolId),
      ]);
      setGoodTags(positiveTags);
      setBadTags(negativeTags);
    } catch (error) {
      console.error("Error fetching school tags:", error);
      alert("Erro ao carregar tags da escola. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) fetchSchoolTags();
  }, [schoolId, fetchSchoolTags]);

  const handleSubmit = async () => {
    if (!schoolId) {
      alert("Erro: Estudante não está associado a uma escola.");
      return;
    }
    if (selectedBad.length === 0 && selectedGood.length === 0) {
      alert("Selecione pelo menos uma tag positiva ou negativa.");
      return;
    }
    try {
      setIsSubmitting(true);
      const allSelectedTagIds = [
        ...selectedBad.map((tag) => tag.tag_id),
        ...selectedGood.map((tag) => tag.tag_id),
      ];
      const payload = { schoolId, tagIds: allSelectedTagIds };
      await api.createFeedback(payload);
      alert("Avaliação enviada com sucesso!");
      setSelectedBad([]);
      setSelectedGood([]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag, type) => {
    if (type === "bad") {
      setSelectedBad((prev) =>
        prev.some((t) => t.tag_id === tag.tag_id)
          ? prev.filter((t) => t.tag_id !== tag.tag_id)
          : [...prev, tag]
      );
    } else {
      setSelectedGood((prev) =>
        prev.some((t) => t.tag_id === tag.tag_id)
          ? prev.filter((t) => t.tag_id !== tag.tag_id)
          : [...prev, tag]
      );
    }
  };

  if (authLoading || isLoading) {
    return (
      <main className="pt-28 flex justify-center">
        <div className="text-center">Carregando informações da escola...</div>
      </main>
    );
  }

  if (!schoolId) {
    return (
      <main className="pt-28 flex justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-4">Erro</h2>
          <p>Não foi possível carregar as informações da escola.</p>
          <p className="mt-2">Verifique se você está associado a uma escola.</p>
          <NavLink
            to="/studentcontrolpanel"
            className="text-blue-600 underline mt-4 inline-block"
          >
            Voltar ao Painel
          </NavLink>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 flex justify-center px-2">
      <section className="w-full max-w-3xl mx-auto">
        <h1 className="flex justify-center mb-6 text-blue-600 text-2xl sm:text-3xl font-bold">
          Avaliar Escola
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
          <h2 className="text-center p-2 font-semibold text-xl">{schoolName}</h2>

          {/* Imagem e preview tags */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-4">
            <figure className="flex items-center border border-gray-300 rounded-lg overflow-hidden md:w-1/3">
              <img
                src="/default-school-image.png"
                alt={schoolName}
                className="object-cover w-full h-48 md:h-64 lg:h-80"
              />
            </figure>

            <div className="flex flex-col gap-2 flex-1">
              <h3 className="font-semibold text-gray-700">Tags Selecionadas:</h3>

              {selectedBad.length > 0 && (
                <div>
                  <h4 className="text-red-600 font-medium text-sm">Negativas:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedBad.map((tag) => (
                      <span
                        key={tag.tag_id}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm"
                      >
                        {tag.tag_nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedGood.length > 0 && (
                <div>
                  <h4 className="text-green-600 font-medium text-sm">Positivas:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedGood.map((tag) => (
                      <span
                        key={tag.tag_id}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm"
                      >
                        {tag.tag_nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedBad.length === 0 && selectedGood.length === 0 && (
                <p className="text-gray-500 text-sm sm:text-base">
                  Selecione tags abaixo para avaliar sua escola.
                </p>
              )}
            </div>
          </div>

          {/* Tags disponíveis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Negativas */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Tags Negativas</label>
              {badTags.length > 0 ? (
                badTags.map((tag) => {
                  const isSelected = selectedBad.some((t) => t.tag_id === tag.tag_id);
                  return (
                    <button
                      key={tag.tag_id}
                      onClick={() => toggleTag(tag, "bad")}
                      className={`px-2 py-1 rounded-full text-sm sm:text-base font-semibold cursor-pointer border ${
                        isSelected
                          ? "bg-red-200 border-red-500"
                          : "border-red-400 hover:bg-red-50"
                      }`}
                    >
                      {tag.tag_nome}
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma tag negativa disponível</p>
              )}
            </div>

            {/* Positivas */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Tags Positivas</label>
              {goodTags.length > 0 ? (
                goodTags.map((tag) => {
                  const isSelected = selectedGood.some((t) => t.tag_id === tag.tag_id);
                  return (
                    <button
                      key={tag.tag_id}
                      onClick={() => toggleTag(tag, "good")}
                      className={`px-2 py-1 rounded-full text-sm sm:text-base font-semibold cursor-pointer border ${
                        isSelected
                          ? "bg-green-200 border-green-500"
                          : "border-green-400 hover:bg-green-50"
                      }`}
                    >
                      {tag.tag_nome}
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma tag positiva disponível</p>
              )}
            </div>
          </div>

          {/* Botões */}
<div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
  <button
    onClick={handleSubmit}
    disabled={
      isSubmitting || (selectedBad.length === 0 && selectedGood.length === 0)
    }
    className={`font-semibold px-6 py-2 w-full sm:w-48 rounded-lg cursor-pointer ${
      isSubmitting || (selectedBad.length === 0 && selectedGood.length === 0)
        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
  >
    {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
  </button>

  <NavLink to="/studentcontrolpanel" className="w-full sm:w-48">
    <button className="w-full px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer">
      ← Voltar ao Painel
    </button>
  </NavLink>
</div>
        </div>
      </section>
    </main>
  );
};

export default ComplaintRegister;

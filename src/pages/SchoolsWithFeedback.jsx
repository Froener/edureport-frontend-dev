import React, { useState, useEffect } from "react";
import { api } from "../api/api";

const SchoolsWithFeedback = () => {
  const [schoolsWithFeedback, setSchoolsWithFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchoolsWithFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllSchoolsWithFeedback();
      setSchoolsWithFeedback(data);
    } catch (error) {
      console.error("Error fetching schools with feedback:", error);
      alert("Erro ao carregar escolas com feedback.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolsWithFeedback();
  }, []);

  if (isLoading) {
    return (
      <main className="pt-28 flex justify-center">
        <div className="text-center">Carregando escolas...</div>
      </main>
    );
  }

  return (
    <main className="pt-28 flex justify-center">
      <section className="w-full max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Escolas com Feedback
        </h1>

        <div className="grid gap-6">
          {schoolsWithFeedback.map((schoolFeedback) => (
            <div
              key={schoolFeedback.school.school_id}
              className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {schoolFeedback.school.schoolName}
              </h2>
              <p className="text-gray-600 mb-4">
                Tipo: {schoolFeedback.school.school_type}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Positive Tags */}
                <div>
                  <h3 className="text-green-600 font-semibold mb-2">
                    Pontos Positivos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {schoolFeedback.positiveTags &&
                    schoolFeedback.positiveTags.length > 0 ? (
                      schoolFeedback.positiveTags.map((tag) => (
                        <span
                          key={tag.tag_id}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {tag.tag_nome}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Nenhum ponto positivo cadastrado
                      </p>
                    )}
                  </div>
                </div>

                {/* Negative Tags */}
                <div>
                  <h3 className="text-red-500 font-semibold mb-2">
                    Pontos Negativos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {schoolFeedback.negativeTags &&
                    schoolFeedback.negativeTags.length > 0 ? (
                      schoolFeedback.negativeTags.map((tag) => (
                        <span
                          key={tag.tag_id}
                          className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          {tag.tag_nome}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Nenhum ponto negativo cadastrado
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {schoolsWithFeedback.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Nenhuma escola com feedback encontrada.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SchoolsWithFeedback;

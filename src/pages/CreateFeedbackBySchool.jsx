import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../Security/AuthContext";

const CreateFeedbackBySchool = () => {
  const { user, loading: authLoading } = useAuth();
  const [goodTags, setGoodTags] = useState([]);
  const [badTags, setBadTags] = useState([]);
  const [newGood, setNewGood] = useState("");
  const [newBad, setNewBad] = useState("");
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get school ID and name from user context
  const schoolId = user?.schoolId;
  const schoolName = user?.schoolName || "Sua Escola";

  // Use useCallback to memoize fetchTags and avoid dependency warnings
  const fetchTags = useCallback(async () => {
    if (!schoolId) return;

    try {
      setIsLoading(true);
      // Fetch positive and negative tags separately
      const [positiveTags, negativeTags] = await Promise.all([
        api.getPositiveTagsBySchool(schoolId),
        api.getNegativeTagsBySchool(schoolId),
      ]);

      setGoodTags(positiveTags);
      setBadTags(negativeTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      alert("Erro ao carregar tags. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]); // Add schoolId as dependency

  useEffect(() => {
    if (schoolId) {
      fetchTags();
    }
  }, [schoolId, fetchTags]); // Now fetchTags is stable and can be included in dependencies

  // ... rest of your component remains the same
  const createTag = async (type, tagName) => {
    if (!schoolId || !tagName.trim()) return;

    try {
      const tagData = {
        tag_nome: tagName.trim(),
        tag_positivo_negativo: type === "GOOD" ? "positive" : "negative",
      };

      await api.createTag(schoolId, tagData);
      fetchTags(); // Refresh the tags list

      if (type === "GOOD") setNewGood("");
      else setNewBad("");
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Erro ao criar tag. Tente novamente.");
    }
  };

  const toggleSelect = (id) => {
    setSelectedToRemove((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (selectedToRemove.length === 0 || !schoolId) return;

    try {
      // Delete all selected tags
      await Promise.all(selectedToRemove.map((id) => api.deleteTag(id)));

      setSelectedToRemove([]);
      fetchTags(); // Refresh the tags list
    } catch (error) {
      console.error("Error deleting tags:", error);
      alert("Erro ao excluir tags. Tente novamente.");
    }
  };

  if (authLoading) {
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
          <h2 className="text-xl font-semibold mb-4">Acesso Restrito</h2>
          <p>
            Esta funcionalidade está disponível apenas para usuários do tipo
            escola.
          </p>
          <p className="mt-2">
            Verifique se você está logado com uma conta de escola.
          </p>
          <NavLink
            to="/schoolcontrolpanel"
            className="text-blue-600 underline mt-4 inline-block">
            Voltar ao Painel
          </NavLink>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="pt-28 flex justify-center">
        <div className="text-center">Carregando tags...</div>
      </main>
    );
  }

  return (
    <main className="pt-28 flex justify-center">
      <section className="w-full max-w-3xl mx-auto">
        <h1 className="flex justify-center mb-2 text-blue-600 text-3xl font-bold">
          Criar Tags da Escola
        </h1>
        <h2 className="flex justify-center mb-6 text-gray-600 text-xl">
          {schoolName}
        </h2>

        <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-2 gap-6">
          {/* NEGATIVAS */}
          <div>
            <h2 className="text-red-500 font-semibold mb-2">Tags Negativas</h2>
            <div className="flex gap-2 mb-3">
              <input
                value={newBad}
                onChange={(e) => setNewBad(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && newBad.trim() && createTag("BAD", newBad)
                }
                placeholder="Adicionar tag negativa..."
                className="border rounded px-3 py-1 w-full"
              />
              <button
                onClick={() => newBad.trim() && createTag("BAD", newBad)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {badTags.map((tag) => (
                <button
                  key={tag.tag_id}
                  onClick={() => toggleSelect(tag.tag_id)}
                  className={`px-2 py-1 border rounded-full text-sm ${
                    selectedToRemove.includes(tag.tag_id)
                      ? "bg-red-300 border-red-600"
                      : "border-red-400 hover:bg-red-50"
                  }`}>
                  {tag.tag_nome}
                </button>
              ))}
              {badTags.length === 0 && (
                <p className="text-gray-500 text-sm">
                  Nenhuma tag negativa cadastrada
                </p>
              )}
            </div>
          </div>

          {/* POSITIVAS */}
          <div>
            <h2 className="text-green-600 font-semibold mb-2">
              Tags Positivas
            </h2>
            <div className="flex gap-2 mb-3">
              <input
                value={newGood}
                onChange={(e) => setNewGood(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  newGood.trim() &&
                  createTag("GOOD", newGood)
                }
                placeholder="Adicionar tag positiva..."
                className="border rounded px-3 py-1 w-full"
              />
              <button
                onClick={() => newGood.trim() && createTag("GOOD", newGood)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {goodTags.map((tag) => (
                <button
                  key={tag.tag_id}
                  onClick={() => toggleSelect(tag.tag_id)}
                  className={`px-2 py-1 border rounded-full text-sm ${
                    selectedToRemove.includes(tag.tag_id)
                      ? "bg-green-300 border-green-600"
                      : "border-green-400 hover:bg-green-50"
                  }`}>
                  {tag.tag_nome}
                </button>
              ))}
              {goodTags.length === 0 && (
                <p className="text-gray-500 text-sm">
                  Nenhuma tag positiva cadastrada
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botão de exclusão */}
        <div className="flex justify-center mt-6">
          <button
            onClick={deleteSelected}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            disabled={selectedToRemove.length === 0}>
            Remover Selecionadas ({selectedToRemove.length})
          </button>
        </div>

        {/* Voltar */}
        <div className="flex justify-center mt-4">
          <NavLink to="/schoolcontrolpanel">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Voltar ao Painel
            </button>
          </NavLink>
        </div>
      </section>
    </main>
  );
};

export default CreateFeedbackBySchool;

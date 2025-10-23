// src/components/SchoolProfile.jsx
import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../Security/AuthContext"
import { api } from "../api/api"

const SchoolProfile = () => {
  const { user, refreshUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    schoolType: "",
    addressState: "",
    addressCity: "",
    addressNeighborhood: "",
  })
  const [loading, setLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [activeField, setActiveField] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        schoolType: user.schoolType || "",
        addressState: user.addressState || "",
        addressCity: user.addressCity || "",
        addressNeighborhood: user.addressNeighborhood || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFocus = (fieldName) => setActiveField(fieldName)
  const handleBlur = () => setActiveField(null)

  const handleSave = async () => {
    setLoading(true)
    setSaveMessage("")
    try {
      await api.updateCurrentUserProfile(formData)
      await refreshUserProfile()
      setIsEditing(false)
      setSaveMessage("Perfil atualizado com sucesso!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (err) {
      setSaveMessage(err.message || "Erro ao atualizar perfil")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        schoolType: user.schoolType || "",
        addressState: user.addressState || "",
        addressCity: user.addressCity || "",
        addressNeighborhood: user.addressNeighborhood || "",
      })
    }
    setIsEditing(false)
    setSaveMessage("")
    setActiveField(null)
  }

  if (!user) {
    return (
      <section className="pt-28 text-center text-gray-700">
        <p>Carregando informações da escola...</p>
      </section>
    )
  }

  const { schoolName, email } = user

  // Estilos base
  const inputBaseClasses =
    "w-full mt-1 p-3 border-2 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm sm:text-base"
  const inputActiveClasses =
    "border-blue-500 bg-blue-50 shadow-md shadow-blue-200 transform scale-[1.02]"
  const inputInactiveClasses =
    "border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200"
  const fieldBaseClasses = "p-4 sm:p-5 rounded-lg transition-all duration-200"
  const fieldEditingClasses = "bg-blue-50 border-2 border-blue-200 shadow-sm"
  const fieldStaticClasses = "bg-gray-50"

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
      {saveMessage && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg border-2 ${
            saveMessage.includes("Erro")
              ? "bg-red-50 border-red-300 text-red-700 shadow-sm"
              : "bg-green-50 border-green-300 text-green-700 shadow-sm"
          }`}
        >
          <div className="flex items-center">
            {saveMessage.includes("Erro") ? (
              <span className="text-red-500 mr-2">⚠️</span>
            ) : (
              <span className="text-green-500 mr-2">✓</span>
            )}
            {saveMessage}
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Cabeçalho */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 h-40 sm:h-44 lg:h-48">
          <div className="absolute top-6 sm:top-auto sm:left-10 transform transition-transform duration-300 hover:scale-105 flex justify-center sm:justify-start w-full sm:w-auto">
            <img
              src="/default-profile.png"
              alt="Logo da escola"
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
          {isEditing && (
            <div className="absolute right-4 sm:right-6 top-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border border-yellow-300">
              Modo Edição
            </div>
          )}
        </div>

        {/* Conteúdo do Perfil */}
        <div className="pt-20 pb-8 px-4 sm:px-8">
          {/* Nome e Email */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 text-center sm:text-left">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-words">
                {schoolName}
              </h2>
              <div className="mt-2 inline-block bg-gray-50 px-3 py-2 rounded-lg">
                <p className="text-gray-800 text-sm sm:text-base break-words">
                  <span className="font-semibold">Email:</span> {email}
                </p>
              </div>
            </div>
          </div>

          {/* Grade de informações */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Tipo de Escola */}
            <div
              className={`${fieldBaseClasses} ${
                isEditing ? fieldEditingClasses : fieldStaticClasses
              } border ${isEditing ? "border-blue-200" : "border-gray-200"}`}
            >
              <span className="text-sm font-semibold text-gray-700">
                Tipo de Escola
                {isEditing && (
                  <span className="text-blue-600 ml-1 text-base">(editável)</span>
                )}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  name="schoolType"
                  value={formData.schoolType}
                  onChange={handleChange}
                  onFocus={() => handleFocus("schoolType")}
                  onBlur={handleBlur}
                  className={`${inputBaseClasses} ${
                    activeField === "schoolType"
                      ? inputActiveClasses
                      : inputInactiveClasses
                  }`}
                  placeholder="Ex: Pública, Estadual, Municipal..."
                />
              ) : (
                <p className="mt-2 text-gray-700 text-base sm:text-lg font-semibold break-words">
                  {formData.schoolType || "Não informado"}
                </p>
              )}
            </div>

            {/* Estado */}
            <div
              className={`${fieldBaseClasses} ${
                isEditing ? fieldEditingClasses : fieldStaticClasses
              } border ${isEditing ? "border-blue-200" : "border-gray-200"}`}
            >
              <span className="text-sm font-semibold text-gray-700">
                Estado
                {isEditing && (
                  <span className="text-blue-600 ml-1 text-xs">(editável)</span>
                )}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  name="addressState"
                  value={formData.addressState}
                  onChange={handleChange}
                  onFocus={() => handleFocus("addressState")}
                  onBlur={handleBlur}
                  className={`${inputBaseClasses} ${
                    activeField === "addressState"
                      ? inputActiveClasses
                      : inputInactiveClasses
                  }`}
                  placeholder="Ex: São Paulo"
                />
              ) : (
                <p className="mt-2 text-gray-700 text-base sm:text-lg font-semibold break-words">
                  {formData.addressState || "Não informado"}
                </p>
              )}
            </div>

            {/* Cidade */}
            <div
              className={`${fieldBaseClasses} ${
                isEditing ? fieldEditingClasses : fieldStaticClasses
              } border ${isEditing ? "border-blue-200" : "border-gray-200"}`}
            >
              <span className="text-sm font-semibold text-gray-700">
                Cidade
                {isEditing && (
                  <span className="text-blue-600 ml-1 text-xs">(editável)</span>
                )}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  name="addressCity"
                  value={formData.addressCity}
                  onChange={handleChange}
                  onFocus={() => handleFocus("addressCity")}
                  onBlur={handleBlur}
                  className={`${inputBaseClasses} ${
                    activeField === "addressCity"
                      ? inputActiveClasses
                      : inputInactiveClasses
                  }`}
                  placeholder="Ex: Campinas"
                />
              ) : (
                <p className="mt-2 text-gray-700 text-base sm:text-lg font-semibold break-words">
                  {formData.addressCity || "Não informado"}
                </p>
              )}
            </div>

            {/* Bairro */}
            <div
              className={`${fieldBaseClasses} ${
                isEditing ? fieldEditingClasses : fieldStaticClasses
              } border ${isEditing ? "border-blue-200" : "border-gray-200"}`}
            >
              <span className="text-sm font-semibold text-gray-700">
                Bairro
                {isEditing && (
                  <span className="text-blue-600 ml-1 text-xs">(editável)</span>
                )}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  name="addressNeighborhood"
                  value={formData.addressNeighborhood}
                  onChange={handleChange}
                  onFocus={() => handleFocus("addressNeighborhood")}
                  onBlur={handleBlur}
                  className={`${inputBaseClasses} ${
                    activeField === "addressNeighborhood"
                      ? inputActiveClasses
                      : inputInactiveClasses
                  }`}
                  placeholder="Ex: Centro"
                />
              ) : (
                <p className="mt-2 text-gray-700 text-base sm:text-lg font-semibold break-words">
                  {formData.addressNeighborhood || "Não informado"}
                </p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-4 sm:space-y-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                >
                  Editar Perfil
                </button>
                <NavLink to="/schoolcontrolpanel" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base">
                    Voltar ao Painel
                  </button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SchoolProfile

// src/components/StudentProfile.jsx
import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../Security/AuthContext"
import { api } from "../api/api"

const StudentProfile = () => {
  const { user, refreshUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    socialName: "",
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
        socialName: user.socialName || "",
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
        socialName: user.socialName || "",
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
        <p>Carregando informações do estudante...</p>
      </section>
    )
  }

  const { fullName, email, birthDate, school } = user

  const formatDateToBrazil = (dateString) => {
    if (!dateString) return "Não informado"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" })
  }

  const finalDateOfBirth = formatDateToBrazil(birthDate) || "Não informado"

  const inputBaseClasses =
    "w-full mt-1 p-3 border-2 rounded-lg transition-all duration-200 ease-in-out font-medium"
  const inputActiveClasses =
    "border-blue-500 bg-blue-50 focus:ring-2 focus:ring-blue-200"
  const inputInactiveClasses =
    "border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:bg-blue-50 focus:ring-2 focus:ring-blue-200"
  const fieldBaseClasses = "p-4 rounded-lg transition-all duration-200"
  const fieldEditingClasses = "bg-blue-50 border-2 border-blue-200"
  const fieldStaticClasses = "bg-gray-50"

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:py-28">
      {saveMessage && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg border-2 ${
            saveMessage.includes("Erro")
              ? "bg-red-50 border-red-300 text-red-700 shadow-sm"
              : "bg-green-50 border-green-300 text-green-700 shadow-sm"
          }`}
        >
          <div className="flex items-center text-sm sm:text-base">
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
        {/* Header */}
        <div className="pt-4 bg-gradient-to-r from-blue-600 to-blue-700 h-28 sm:h-36 lg:h-40 relative flex items-center justify-center">
          <div className="absolute left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 transform transition-transform duration-300 hover:scale-105">
            <img
              src="/default-profile.png"
              alt="Foto de perfil"
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
          {isEditing && (
            <div className="absolute right-4 sm:right-6 top-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border border-yellow-300">
              Modo Edição
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="pt-20 sm:pt-16 pb-8 px-4 sm:px-8">
          {/* Nome e email */}
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              {fullName}
            </h2>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg inline-block">
              <p className="text-gray-800 text-sm sm:text-base">
                <span className="font-semibold">Email:</span> {email}
              </p>
            </div>
          </div>

          {/* Nome Social */}
          {isEditing ? (
            <div className={`${fieldBaseClasses} ${fieldEditingClasses} border mb-8`}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Social:
                <span className="text-blue-600 ml-1 text-xs">(editável)</span>
              </label>
              <input
                type="text"
                name="socialName"
                value={formData.socialName}
                onChange={handleChange}
                onFocus={() => handleFocus("socialName")}
                onBlur={handleBlur}
                className={`${inputBaseClasses} ${
                  activeField === "socialName"
                    ? inputActiveClasses
                    : inputInactiveClasses
                }`}
                placeholder="Digite seu nome social"
              />
            </div>
          ) : (
            formData.socialName && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 mb-8">
                <span className="text-sm font-semibold text-gray-600">
                  Nome Social:
                </span>
                <p className="text-base text-gray-700 font-medium mt-1">
                  {formData.socialName}
                </p>
              </div>
            )
          )}

          {/* Campos */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Data de nascimento */}
            <div className={`${fieldBaseClasses} ${fieldStaticClasses} border border-gray-200`}>
              <span className="text-sm font-semibold text-gray-700">
                Data de Nascimento
              </span>
              <p className="mt-2 text-gray-700 text-base font-semibold">
                {finalDateOfBirth}
              </p>
            </div>

            {/* Estado */}
            <div className={`${fieldBaseClasses} ${isEditing ? fieldEditingClasses : fieldStaticClasses} border ${isEditing ? "border-blue-200" : "border-gray-200"}`}>
              <span className="text-sm font-semibold text-gray-700">
                Estado
                {isEditing && <span className="text-blue-600 ml-1 text-xs">(editável)</span>}
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
                    activeField === "addressState" ? inputActiveClasses : inputInactiveClasses
                  }`}
                  placeholder="Ex: São Paulo"
                />
              ) : (
                <p className="mt-2 text-gray-700 text-base font-semibold">
                  {formData.addressState || "Não informado"}
                </p>
              )}
            </div>

            {/* Cidade */}
            <div className={`${fieldBaseClasses} ${isEditing ? fieldEditingClasses : fieldStaticClasses} border ${isEditing ? "border-blue-200" : "border-gray-200"}`}>
              <span className="text-sm font-semibold text-gray-700">
                Cidade
                {isEditing && <span className="text-blue-600 ml-1 text-xs">(editável)</span>}
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
                    activeField === "addressCity" ? inputActiveClasses : inputInactiveClasses
                  }`}
                  placeholder="Ex: Campinas"
                />
              ) : (
                <p className="mt-2 text-gray-700 text-base font-semibold">
                  {formData.addressCity || "Não informado"}
                </p>
              )}
            </div>

            {/* Bairro */}
            <div className={`${fieldBaseClasses} ${isEditing ? fieldEditingClasses : fieldStaticClasses} border ${isEditing ? "border-blue-200" : "border-gray-200"}`}>
              <span className="text-sm font-semibold text-gray-700">
                Bairro
                {isEditing && <span className="text-blue-600 ml-1 text-xs">(editável)</span>}
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
                    activeField === "addressNeighborhood" ? inputActiveClasses : inputInactiveClasses
                  }`}
                  placeholder="Ex: Centro"
                />
              ) : (
                <p className="mt-2 text-gray-700 text-base font-semibold">
                  {formData.addressNeighborhood || "Não informado"}
                </p>
              )}
            </div>

            {/* Escola */}
            <div className={`${fieldBaseClasses} ${fieldStaticClasses} border border-gray-200 col-span-1 sm:col-span-2`}>
              <span className="text-sm font-semibold text-gray-700">
                Escola
              </span>
              <p className="mt-2 text-gray-700 text-base font-semibold">
                {school?.schoolName || "Não informado"}
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-4 sm:space-y-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Editar Perfil
                </button>
                <NavLink to="/studentcontrolpanel" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
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

export default StudentProfile

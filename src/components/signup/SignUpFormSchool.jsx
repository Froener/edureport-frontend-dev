import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../api/api";
import FormField from "./FormField";
import SelectField from "./SelectField";
import { useAuth } from "../../Security/AuthContext";

// Zod validation schema
const schema = z
  .object({
    schoolName: z.string().min(3, "Campo obrigatório"),
    schoolType: z.string().min(2, "Selecione uma categoria"),
    state: z.string().min(2, "Selecione um estado"),
    city: z.string().min(2, "Cidade obrigatória"),
    neighborhood: z.string().min(2, "Bairro obrigatório"),
    email: z.string().email("Email inválido"),
    confirmEmail: z.string(),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Os emails não coincidem",
    path: ["confirmEmail"],
  });

const schoolTypes = [
  { value: "municipal", label: "Municipal" },
  { value: "estadual", label: "Estadual" },
  { value: "federal", label: "Federal" },
  { value: "privada", label: "Privada" },
];

const brazilianStates = [
  { value: "AC", label: "Acre (AC)" },
  { value: "AL", label: "Alagoas (AL)" },
  { value: "AP", label: "Amapá (AP)" },
  { value: "AM", label: "Amazonas (AM)" },
  { value: "BA", label: "Bahia (BA)" },
  { value: "CE", label: "Ceará (CE)" },
  { value: "DF", label: "Distrito Federal (DF)" },
  { value: "ES", label: "Espírito Santo (ES)" },
  { value: "GO", label: "Goiás (GO)" },
  { value: "MA", label: "Maranhão (MA)" },
  { value: "MT", label: "Mato Grosso (MT)" },
  { value: "MS", label: "Mato Grosso do Sul (MS)" },
  { value: "MG", label: "Minas Gerais (MG)" },
  { value: "PA", label: "Pará (PA)" },
  { value: "PB", label: "Paraíba (PB)" },
  { value: "PR", label: "Paraná (PR)" },
  { value: "PE", label: "Pernambuco (PE)" },
  { value: "PI", label: "Piauí (PI)" },
  { value: "RJ", label: "Rio de Janeiro (RJ)" },
  { value: "RN", label: "Rio Grande do Norte (RN)" },
  { value: "RS", label: "Rio Grande do Sul (RS)" },
  { value: "RO", label: "Rondônia (RO)" },
  { value: "RR", label: "Roraima (RR)" },
  { value: "SC", label: "Santa Catarina (SC)" },
  { value: "SP", label: "São Paulo (SP)" },
  { value: "SE", label: "Sergipe (SE)" },
  { value: "TO", label: "Tocantins (TO)" },
];

const SignUpFormSchool = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const { refreshUserProfile } = useAuth();

  const onSubmit = async (data) => {
    try {
      const payload = {
        user: {
          full_name: data.schoolName,
          email: data.email,
          password_hash: data.password,
          address_state: data.state,
          address_city: data.city,
          address_neighborhood: data.neighborhood,
        },
        school_name: data.schoolName,
        school_type: data.schoolType,
      };

      await api.signUpSchool(payload);
      await refreshUserProfile();

      navigate("/schoolcontrolpanel");
    } catch (error) {
      console.error("Erro ao cadastrar escola: ", error);
      alert("Erro ao cadastrar escola. Veja console");
    }
  };

  return (
    <form
      className="flex flex-col mx-auto w-full max-w-3xl gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 sm:gap-16 w-full p-2">
        <FormField
          id="schoolName"
          label="Instituição:"
          placeholder="Nome da Instituição"
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-16 w-full p-2">
        <SelectField
          id="schoolType"
          label="Tipo:"
          options={schoolTypes}
          register={register}
          errors={errors}
        />
        <SelectField
          id="state"
          label="Estado:"
          options={brazilianStates}
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-16 w-full p-2">
        <FormField
          id="city"
          label="Cidade:"
          placeholder="Cidade"
          register={register}
          errors={errors}
        />
        <FormField
          id="neighborhood"
          label="Bairro:"
          placeholder="Bairro"
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-16 w-full p-2">
        <FormField
          id="email"
          label="Email:"
          placeholder="Seu e-mail"
          type="email"
          register={register}
          errors={errors}
        />
        <FormField
          id="confirmEmail"
          label="Confirme seu e-mail:"
          placeholder="Confirme seu e-mail"
          type="email"
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-16 w-full p-2">
        <FormField
          id="password"
          label="Crie sua senha:"
          placeholder="Crie sua senha"
          type="password"
          register={register}
          errors={errors}
        />
        <FormField
          id="confirmPassword"
          label="Confirme sua senha:"
          placeholder="Confirme sua senha"
          type="password"
          register={register}
          errors={errors}
        />
      </div>
      <div className="px-2">
        <button
          type="submit"
          className="mt-4 mb-8 w-full p-3 text-sm sm:text-base text-white font-semibold transition duration-200 hover:bg-green-700 bg-green-500 rounded-md">
          Continuar
        </button>
      </div>
    </form>
  );
};

export default SignUpFormSchool;

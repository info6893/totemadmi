import { CitarPx } from "@/components/admitotem/CitarPx";

export default function Citar({
    params,
  }:{
    params: { idEspecialidad: string, Especialidad: string, Depa: string }
  }) {

  return (
        <>
            <CitarPx idEsp={params.idEspecialidad} EspNombre={params.Especialidad} Depa={params.Depa} />
        </>
    );
}

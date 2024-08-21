import { Especialidad } from "@/components/admitotem/Especialidad"
import axios from "axios"
import Link from 'next/link'
import { useState } from "react";

const departamento: { [key: string]: { idDepartamento: number; Departamento: string; } } = {
  "depa1": { idDepartamento: 1, Departamento: "MEDICINA" },
  "depa2": { idDepartamento: 2, Departamento: "PEDIATRIA" },
  "depa3": { idDepartamento: 3, Departamento: "OBSTETRICIA Y GINECOLOGIA" },
  "depa4": { idDepartamento: 4, Departamento: "CIRUGIA" },
};

const buscarespecialidad = async (idDepa: string) => {
  const response = await axios.get(`${process.env.apiurl}/Totem/Especialidades/CuposHoy/${idDepa}`);
  return response.data;
}

const fechaentre = async () => {
  const responsefecha = await axios.get(`${process.env.apiurl}/Totem/RangoFechas`);
  return responsefecha.data;
}

export default async function Servicio({params,}:{params: { idDepa: string }}) {

  const serv = await buscarespecialidad(params.idDepa);
  const fecha = await fechaentre();
  const depaKey = `depa${params.idDepa}`;

  return (
      <>
        <section>
            <div className="py-0">
                <div className="mx-auto px-2 max-w-6xl text-gray-500">
                    <div className="relative">
                      <Link href="/admitotem/">
                        <h1 className="mt-6 text-center font-semibold text-black dark:text-black text-5xl p-2"> SERVICIO : {departamento[depaKey].Departamento } </h1>
                      </Link>
                    </div>
                    <div className="relative">
                      <Link href="/admitotem/">
                        <h1 className="mt-6 text-center font-semibold text-black dark:text-black text-2xl p-2"> Citas Desde : {fecha.desde} hasta : {fecha.hasta} </h1>
                      </Link>
                    </div>
                </div>
            </div>
        </section>
        <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-1 gap-4">
          {
            serv.map( (ser: any) => (
              <Especialidad key={ser.idEspecialidad} idEsp={ser.idEspecialidad} esp={ser.especialidad} cupos={ser.cuposLibres} depa={departamento[depaKey].Departamento} />
            ))
          }
        </div>

      </>
  );
}
'use client';
import Link from 'next/link';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { Paciente, Sis, SisRpta, FormInputsTotem, EstabOrigen } from '@/components';
import { Ticket } from './Ticket';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export const CitarPx = ({ idEsp, EspNombre, Depa }: any) => {
  const especialidad = decodeURIComponent(EspNombre)
  const departamento = decodeURIComponent(Depa)
  const router = useRouter();
  const [nearest, setNearest] = useState<any>(null);
  const { register, handleSubmit , formState: { errors, isValid }, setValue, reset } = useForm<FormInputsTotem>({mode: 'onChange'});
  const [paciente, setPaciente] = useState<Partial<Paciente>>({});
  const [sisrpta, setRpta] = useState<Partial<SisRpta>>({});
  const [estaborigen, setEstaborigen] = useState<any>();
  const [iafa, setIafa] = useState<any>()
  console.log(iafa)
  const [iafacargar, setiafacargar] = useState<any>()
 
  useEffect(() => {
    if (nearest?.exito == 1) {
      print();
      router.push('/admitotem');
    }
    cargariafas()
  }, [nearest, router])

  // Validad que tenga 8 digitos el Documento
  const [dni, setDni] = useState('');
  const handleDniChange = (event: ChangeEvent<HTMLInputElement>) => {
    //clean for search
    setEstaborigen('')
    setValue('iafa', '0');
    setValue('establecimientoOrigen', '');
    setValue('numReferencia', '');
    const dni = event.target.value;
    setValue('dni', dni);
    if (dni.length === 8) {
      buscardni(dni)
      setDni(dni)
    }
  }

  // Busca Px
  const buscardni = async (dni: string) => {
    if(dni.length === 8){
      try {      
          const data: any = await axios.get(`${process.env.apiurl}/Totem/SolicitaAdmitir?dni=${dni}&tipo=1`);
          console.log(data)
          setPaciente(data.data.paciente);
          if(data.data.sisRpta.exito == 1){ // si es SIS
            const numRef = (data.data.sis.eess).slice(-5);
            setValue('establecimientoOrigen', numRef);
            buscarOrgRef(numRef);
            setValue('iafa', '3');
            setIafa(3)
          }else{
            setValue('iafa', '5');
            setIafa(5)
          }
          setRpta(data.data.sisRpta);
      } catch (error) {
        setValue('dni', '');
        Swal.fire({
          title: 'Error',
          text: 'DNI no encontrado!',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          timer: 5000,
          timerProgressBar: true
        });
      }
    }
  }


  // IPRESS de referencia
  const buscarOrgRef = (id: any) =>  {
    buscarreforigen(id);
  }
  const handleEstablOriChange = (event: ChangeEvent<HTMLInputElement>) => {
    buscarreforigen(event.target.value);
  }
  const buscarreforigen = async (ref: string) => {
    if(ref != ''){
      const data: any = await axios.get(`${process.env.apiurl}/Totem/Establecimientos/${ref}`);
      setEstaborigen(data.data)
    }
  }

  // Mostrar las IAFAS
  const cargariafas = async () => {
    const data: any = await axios.get(`${process.env.apiurl}/FuentesFinanciamiento`);
    setiafacargar(data.data)
  }
  
  // Selecciona IAFA
  const handleIafaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setIafa(event.target.value)
    // console.log('Dato enviado : '+event.target.value)
    // console.log(iafa, (!(iafa == 3)))
    setValue('iafa', event.target.value);
    setValue('establecimientoOrigen', '')
    setValue('numReferencia', '')
    setEstaborigen('')
  }

  // Admisión
  const onSubmit: SubmitHandler<any> = async (data: FormInputsTotem) => {
    const datos = {
      idPaciente: paciente.idPaciente,
      idEspecialidad: idEsp,
      idIafa: data.iafa,
      referenciaCodigo: data.establecimientoOrigen,
      referenciaNumero: data.numReferencia
    };
    const datEnv = await axios.post(`${process.env.apiurl}/Totem/AdmisionGuardar`, datos);
    const respuesta = datEnv.data;
    if (respuesta.exito == 1) {
      setNearest(respuesta);
      reset();
    } else {
      Swal.fire({
        title: 'Información',
        text: respuesta.mensaje,
        icon: respuesta.exito === 1 ? 'success' : 'warning',
        confirmButtonText: 'Aceptar'
      });
    }

  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="block print:hidden">
        <section className="shadow-md">
          <div className="">
            <div className="mx-auto px-2 max-w-6xl text-gray-500">
              <div className="relative shadow-lg rounded-md">
                <Link href="/admitotem/">
                  <h1 className="mt-6 text-center font-semibold text-black dark:text-black text-5xl">ADMISIÓN</h1>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center p-1">
          <div className="mx-auto w-full max-w-[750px] bg-white rounded-lg shadow-lg p-2">

            <div className="mb-5 shadow-md p-4 rounded-md">
              {sisrpta.exito == 0 ? (
                <label className="mb-1 block text-base text-[#ee4747] font-bold">
                  PACIENTE NO CUENTA CON SIS
                </label>
              ) : sisrpta.exito == 1 ? (
                <label className="mb-1 block text-base text-[#3739d4] font-bold">
                  PACIENTE CUENTA CON SIS
                </label>
              ) : null}
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5 flex items-center shadow-sm p-1 rounded-md">
                  <label className="mr-3 text-base font-bold text-[#07074D]">
                    DEPARTAMENTO:
                  </label>
                  <label className="text-base font-medium text-[#07074D]">
                    {departamento}
                  </label>
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5 flex items-center shadow-sm p-1 rounded-md">
                  <label className="mr-3 text-base font-bold text-[#07074D]">
                    ESPECIALIDAD:
                  </label>
                  <label className="text-base font-medium text-[#07074D]">
                    {especialidad}
                  </label>
                </div>
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input type="text" {...register('dni', { required: true } )} onChange={handleDniChange} autoFocus={true} maxLength={8} placeholder="Num. Doc." min="0" className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md shadow-sm" />
                </div>
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/10">
                <div className="mb-5 flex items-center shadow-sm p-1 rounded-md">
                  <label className="mr-3 text-base font-bold text-[#07074D]">
                    Num. Doc.:
                  </label>
                  <label className="text-base font-medium text-[#07074D]">
                    {dni}
                  </label>
                </div>
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/10">
                <div className="mb-5 flex items-center shadow-sm p-1 rounded-md">
                  <label className="mr-3 text-base font-bold text-[#07074D]">
                    Nombres y Apellidos:
                  </label>
                  <label className="text-base font-medium text-[#07074D]">
                    {paciente.apenom}
                  </label>
                </div>
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/10">
                <div className="mb-5 flex items-center shadow-sm p-1 rounded-md">
                  <label className="mr-3 text-base font-bold text-[#07074D]">
                    Edad:
                  </label>
                  <label className="text-base font-medium text-[#07074D]">
                    {paciente.edad}
                  </label>
                </div>
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/10">
                <div className="mb-5 flex items-center shadow-sm p-1 rounded-md">
                  <label className="mr-3 text-base font-bold text-[#07074D]">
                    Sexo:
                  </label>
                  <label className="text-base font-medium text-[#07074D]">
                    {paciente.sexo}
                  </label>
                </div>
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">

              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <select {...register('iafa', { required: true })} onChange={handleIafaChange} className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md shadow-sm">
                    {iafacargar && (
                      iafacargar.map((data: any) => (
                        <>
                          <option key={data.idFuenteFinanciamiento} value={data.idFuenteFinanciamiento}> {data.descripcion} </option>
                        </>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  {estaborigen && (
                    estaborigen.map((data: any) => (
                      <label className="text-base font-medium text-[#07074D]" key={data.idEstablecimiento}>
                        {data.codigo} - {data.nombre}
                      </label>
                    ))
                  )}
                </div>
              </div>

            </div>
            <div className="-mx-3 flex flex-wrap">

              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input type="text" {...register('establecimientoOrigen')} disabled={!(iafa == 3)} onBlur={handleEstablOriChange} maxLength={8} placeholder="Establecimiento Referido" min="0" className={`w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md shadow-sm`} />
                </div>
              </div>

              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input type="text" {...register('numReferencia')} disabled={!(iafa == 3)} placeholder="Num. Referencia" maxLength={8} className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md shadow-sm" />
                </div>
              </div>

            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <button type="submit" disabled={!isValid} className="submit-button-class py-3 px-8 text-center text-base font-semibold text-white outline-none shadow-lg rounded-md bg-[#6A64F1] hover:bg-[#4A4DF1] hover:shadow-form cursor-pointer">
                    Admitir
                  </button>

                    {/* <button type="submit" className="submit-button-class py-3 px-8 text-center text-base font-semibold text-white outline-none shadow-lg rounded-md bg-[#6A64F1] hover:bg-[#4A4DF1] hover:shadow-form cursor-pointer" >
                      Admitir
                    </button> */}

                </div>
              </div>
            </div>

          </div>
        </div>
      </form>

      {nearest && (
        <Ticket Datos={nearest} />
      )}

    </>
  );
}
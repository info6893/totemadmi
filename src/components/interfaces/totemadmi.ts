
export type FormInputsDni = {
    dni: string;
}

export type FormInputsTotem = {
    dni: string;
    establecimientoOrigen: string;
    numReferencia: string;
    iafa: string;
};

export interface TicketPrint {
    idPaciente: number;
    exito:      number;
    mensaje:    string;
    apenom:     string;
    edad:       number;
    sexo:       string;

}

export interface Paciente {
    idPaciente: number;
    exito:      number;
    mensaje:    string;
    apenom:     string;
    edad:       number;
    sexo:       string;
}

export interface Sis {
    apeMaterno:         string;
    apePaterno:         string;
    codError:           string;
    contrato:           string;
    correlativo:        string;
    descEESS:           string;
    descTipoSeguro:     string;
    direccion:          string;
    disa:               string;
    eess:               string;
    estado:             string;
    fecAfiliacion:      string;
    fecCaducidad:       string;
    fecNacimiento:      string;
    genero:             string;
    idGrupoPoblacional: string;
    idNumReg:           string;
    idPlan:             string;
    idUbigeo:           string;
    msgConfidencial:    string;
    nombres:            string;
    nroContrato:        string;
    nroDocumento:       string;
    regimen:            string;
    resultado:          string;
    tabla:              string;
    tipoDocumento:      string;
    tipoFormato:        string;
    tipoSeguro:         string;
}

export interface SisRpta {
    exito:   number;
    mensaje: string;
    dato1:   string;
    dato2:   string;
}


export interface EstabOrigen {
    idEstablecimiento: number;
    codigo: string;
    nombre: string;
}
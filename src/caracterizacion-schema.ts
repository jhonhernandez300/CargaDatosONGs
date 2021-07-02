import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CaracterizacionSchema = new Schema({            
    razonSocial: {type: String},
    idNegocio: {type: String},
    estaEliminado: {type: Boolean},
    idCohorte: {type: String},    
    yearDeConstitucion: {type: Number},
    representanteLegalOLiderDeLaOrganizacion: {type: String},
    generoDelRepresentanteLegal: {type: String},
    institucionQueExpidePersoneriaJuridica: {type: String},
    direccion: {type: String},
    telefono: {type: String},
    correo: {type: String},    
    laOrganizacionTieneRedesOMedios: [{type: String}],
    queRedesOMediosManejaLaOrganizacion: [{type: String}],
    tipologiaDeLaOrganizacion: {type: String},
    territorioDeCobertura: [{type: String}],
    sector: {type: String},
    queOdsDesarrollaLaOrganizacion: [{type: String}],
    poblacionObjetivoDeLaOrganizacion: [],
    comunidadesEnQueDesarrollaPrincipalmenteSuTrabajo: {type: String},
    totalDeIngresosDeLaOrganizacionEnElYear2018: {type: Number},
    fuentesDeFinanciacionDeLaOrganizacion: [],
    numeroTotalDeEmpleadosConContratoLaboral: {type: Number},
    numeroTotalDeVoluntariosEnLaOrganizacion: {type: Number},
    numeroTotalDePracticantesEnLaOrganizacion: {type: Number},
    territorioDeActividad: {type: String},    
    numeroTotalDeEmpleadosConContratoDePrestacionDeServicios: {type: Number},
    porcentajeDeFinanciacionPorRecursosPropios: {type: Number},
    porcentajeDeFinanciacionPorRecursosPrivados: {type: Number},    
    porcentajeDeFinanciacionPorRecursosDonaciones: {type: Number},    
    porcentajeDeFinanciacionPorCooperacionInternacional: {type: Number}
});
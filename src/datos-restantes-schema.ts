import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const DatosRestantesSchema = new Schema({        
    nit: {type: String},
    correoElectronico: {type: String},
    telefono: {type: String},
    razonSocial: {type: String},
    yearDeConstitucion: {type: Number},
    institucionQueExpidePersoneriaJuridica: {type: String},
    laOrganizacionTieneRedesOMedios: [{type: String}],
    queRedesOMediosManejaLaOrganizacion: [{type: String}],
    territorioDeCobertura: [{type: String}],
    queOdsDesarrollaLaOrganizacion: [{type: String}],
    poblacionObjetivoDeLaOrganizacion: [],
    totalDeIngresosDeLaOrganizacionEnElUltimoYear2018: {type: Number},
    fuentesDeFinanciacionDeLaOrganizacion: [],
    numeroTotalDeEmpleadosConContratoLaboral: {type: Number},
    numeroTotalDeVoluntariosEnLaOrganizacion: {type: Number},
    numeroTotalDePracticantesEnLaOrganizacion: {type: Number},
    territorioDeActividad: {type: String},
    porcentajeDeFinanciacionPorRecursosPropios: {type: Number}
});
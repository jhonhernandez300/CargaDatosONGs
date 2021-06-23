import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CaracterizacionSchema = new Schema({    
    empresa: {type: String},
    nit: {type: String},
    yearDeConstitucion: {type: Number},
    telefono: {type: String},
    correo: {type: String},
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
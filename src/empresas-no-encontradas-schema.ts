import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const EmpresasNoEncontradasSchema = new Schema({        
    nit: {type: Number},
    razonSocial: {type: String},
    nombreComercial: {type: String},
    municipio: {type: String},
    direccionDeLaOrganizacion: {type: String},
    estaEliminado: {type: Boolean},
    idCohorte: {type: String},
    barrioComuna: {type: String},
    telefono: {type: String},
    correoElectronico: {type: String},
    tipologiaDeLaOrganizacion: {type: String},
    subregion: {type: String},
    institucion: {type: Schema.Types.ObjectId},    
    empresarios: [],
    cohortes: []
});
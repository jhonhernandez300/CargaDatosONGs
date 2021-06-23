import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const EmpresaSchema = new Schema({    
    _id: {type: Object}, //tipo ObjectId en mongo
    nit: {type: String},
    razonSocial: {type: String},
    nombreComercial: {type: String},
    municipio: {type: String},
    direccionDeLaOrganizacion: {type: String},
    barrioComuna: {type: String}, //tipo null en mongo
    telefono: {type: String},
    correoElectronico: {type: String},
    topologiaDeLaOrganizacion: {type: String},
    subregion: {type: String},
    institucion: {type: Object}, //tipo ObjectId en mongo
    cohortes: {type: String}, //tipo null en mongo
    empresarios: [{type: String}]
});
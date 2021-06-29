import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const EmpresariosSchema = new Schema({    
    nombre: {type: String},
    institucion: {type: String},
    correoElectronico: {type: String},
    telefono: {type: String},
    negocio: [{type: Schema.Types.ObjectId}]
});
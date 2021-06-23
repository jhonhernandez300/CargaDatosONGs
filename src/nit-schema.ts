import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const NitSchema = new Schema({        
    nit: {type: String}
});
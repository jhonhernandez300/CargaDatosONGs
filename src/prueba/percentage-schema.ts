import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PercentageSchema = new Schema({    
    itemType: {type: String},
    frequency: {type: Number},
    relFrequency: {type: Number},
    porcentageFrecuency: {type: Number}
});
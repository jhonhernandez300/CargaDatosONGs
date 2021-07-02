import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const FrequencySchema = new Schema({    
    bins: {type: Number},
    frequency: {type: Number},
    intervalsStart: {type: Number},
    intervalsEnd: {type: Number}
});
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SalesOrdersSchema = new Schema({    
    orderMonth: {type: Number},
    orderDay: {type: Number},
    orderYear: {type: Number},
    region: {type: String},
    rep: {type: String},
    item: {type: String},
    unit: {type: Number},
    unitCost: {type: Number},
    total: {type: Number}
});
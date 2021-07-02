import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import { SalesOrdersSchema } from './sales-orders-schema';

//"start:dev": "nodemon ./src/prueba/index-sales-orders.ts"

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);
    var emptyList: any = [];
    var counter: number = 1;

    for (let element of workSheet[0].data) {
        counter++;        
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 45) {
        //if (counter == 3) {
            var objeto: any = {
                orderMonth: element[0],
                orderDay: element[1],
                orderYear: element[2],
                region: element[3],
                rep: element[4],
                item: element[5],
                units: element[6],
                unitsCosts: element[7],
                total: parseFloat(element[6] as string) * parseFloat(element[7] as string)
            };
            //console.log('objeto ', objeto);

            emptyList.push({
                orderMonth: objeto['orderMonth'],
                orderDay: objeto['orderDay'],
                orderYear: objeto['orderYear'],
                region: objeto['region'],
                rep: objeto['rep'],                    
                item: objeto['item'],
                units: objeto['units'],
                unitsCosts: objeto['unitsCosts'],
                total: objeto['total']
            });
        }
    }//for

    //console.log('emptyList ', emptyList);
    return emptyList;
}

const connect = async (connectionString: string) => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        //console.log('conectado');
    } catch (Error) {
        console.log(Error.message);
    }
}

connect('mongodb://localhost/Prueba');

const insertDataInDatabase = async (data: any[]) => {
    const empresaData = mongoose.model('SalesOrders', SalesOrdersSchema, 'SalesOrders');
    await empresaData.create(data);
}

workSheetsFromFile("C://Users//PC//Documents//sample.xls")
    .then(response => {
        insertDataInDatabase(response);
        console.log('***************           Datos guardados       *************************** ');        
    })
    .catch(error => {
        console.error(': ', error);
    })
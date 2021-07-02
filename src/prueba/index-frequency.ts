import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import { FrequencySchema } from './frequency-schema';

//"start:dev": "nodemon ./src/prueba/index-frequency.ts"

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);
    var emptyList: any = [];
    var counter: number = 1;

    for (let element of workSheet[0].data) {
        counter++;        
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 12) {
        //if (counter == 3) {
            var objeto: any = {
                bins: element[10],
                frequency: element[11],
                intervalsStart: element[12],
                intervalsEnd: element[13]
            };
            //console.log('objeto', objeto);

            emptyList.push({
                bins: objeto['bins'],
                frequency: objeto['frequency'],
                intervalsStart: objeto['intervalsStart'],     
                intervalsEnd: objeto['intervalsEnd']          
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
    const empresaData = mongoose.model('Frequency', FrequencySchema, 'Frequency');
    await empresaData.create(data);
}

workSheetsFromFile("C://Users//PC//Documents//sample.xls")
    .then(response => {
        insertDataInDatabase(response);
        console.log('**           Datos guardados       **** ');        
    })
    .catch(error => {
        console.error(': ', error);
    })
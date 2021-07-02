import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import { PercentageSchema } from './percentage-schema';

//"start:dev": "nodemon ./src/prueba/index-percentage.ts"

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);
    var emptyList: any = [];
    var counter: number = 1;
    var frequencySum: number = 0;

    for (let i = 1; i <= 5; i++) {
        frequencySum +=  parseInt(workSheet[0].data[i][16] as string)
        //console.log('workSheet[0].data[i][16] ', workSheet[0].data[i][16]);
        //console.log('frequencySum ', frequencySum); 
        //console.log('workSheet[0].data[i][16] as string) ', workSheet[0].data[i][16] as string); 
    }

    for (let element of workSheet[0].data) {
        counter++;        
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 7) {
        //if (counter == 7) {            
            var objeto: any = {
                itemType: element[15],
                frequency: element[16],
                relFrequency: parseFloat(element[16] as string) / frequencySum
                // porcentageFrecuency: element[18]
            };
            //console.log('objeto', objeto);

            emptyList.push({
                itemType: objeto['itemType'],
                frequency: objeto['frequency'],
                relFrequency: objeto['relFrequency']     
                // porcentageFrecuency: objeto['porcentageFrecuency']          
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
    const empresaData = mongoose.model('Percentage', PercentageSchema, 'Percentage');
    await empresaData.create(data);
}

workSheetsFromFile("C://Users//PC//Documents//sample.xls")
    .then(response => {
        insertDataInDatabase(response);
        console.log('*           Datos guardados       * ');        
    })
    .catch(error => {
        console.error(': ', error);
    })
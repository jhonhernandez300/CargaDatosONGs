import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import fs from 'fs';
import { quitarTildes } from './utils';
import { DatosRestantesSchema } from './datos-restantes-schema';

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

const guardarDatos = async (path: string):Promise<any[]> => {
    return new Promise( (resolve, reject) => {
        fs.readFile(path, {encoding:'utf8'}, (error, data) => {
            if (error) {
                console.log('Error', error);
                return;
            }
            resolve(JSON.parse(data.toString()));
        });  
    });
}


const insertDataInDatabase = async (data: any[]) => {
    //console.log('data', data);
    const empresaData = mongoose.model('CaracterizacionDatosRestantes', DatosRestantesSchema, 'CaracterizacionDatosRestantes');
    await empresaData.create(data);
}

connect('mongodb://localhost/Ongs');

guardarDatos("C:\\Users\\PC\\Documents\\empresasNoEncontradasRestantes.json")
    //.then((response) => {
    .then((response) => {
        //console.log('response', response);
        insertDataInDatabase(response.map((element) => {
            delete element.numero;
            return {...element, nit:element.nit.toString(), telefono:element.telefono.toString()}
        }));        
        console.log('Datos guardados');
    })
    .catch((error) => {
        console.error(': ', error);
    })
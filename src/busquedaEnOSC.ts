import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import fs  from 'fs';
import { quitarTildes }  from './utils';

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);    
    var datosJson: any;
    var counter: number = 1;

    fs.readFile('C:\\Users\\PC\\Documents\\empresasNoEncontradas.json', (error, data) => {
        if(error){
            console.log('Error', error);
            return;
        }
        datosJson = JSON.parse(data.toString());

        //console.log('datosJson ', datosJson); 

        for (let i = 0; i <= datosJson.length - 1; i++) {   
        //for (let i = 0; i < 1; i++) {   
            const primerItem = 'BUS DE POT';
            const segundoItem = '3116447983';
            const tercerItem = 'NO TIENE';

            // datosJson[i].telefono == undefined ? '99' : datosJson[i].telefono;
            // //datosJson[i].correoElectronico == undefined ? 'no tiene' : datosJson[i].correoElectronico;
            
            // if(datosJson[i].correoElectronico == undefined || datosJson[i].correoElectronico == 'No registra'){
            //     datosJson[i].correoElectronico = 'no tiene';
            // }
            //console.log('datosJson[i] ', datosJson[i]); 

            for (let element of workSheet[0].data) {
                counter++;
                ////console.log('counter ', counter); 
                if (counter >= 9 && counter <= 1678) {
                //if (counter == 9) {
                    let laRazonSocial:string;                    

                    var objeto1: any = {
                        razonSocial: element[2]  == undefined ? '' : quitarTildes(element[2]),                        
                        telefono: element[5] == undefined ? '' : element[5],                        
                        email: element[6] == undefined ? '' : element[6],
                        numero: element[0]
                    };    
                    //console.log('objeto1 ', objeto1); 

                    laRazonSocial = objeto1.razonSocial;
                    laRazonSocial = quitarTildes(laRazonSocial.toUpperCase());
                    // console.log('laRazonSocial', laRazonSocial);
                    // console.log('primerItem', primerItem);
                    // console.log('laRazonSocial.indexOf(primerItem)', laRazonSocial.indexOf(primerItem));

                    // console.log('objeto1.telefono', objeto1.telefono);
                    // console.log('datosJson[i].telefono', datosJson[i].telefono);
                    

                    if (laRazonSocial.indexOf(primerItem) != -1 ) {
                        console.log('objeto1 ', objeto1);                        
                    } else if (objeto1.telefono == segundoItem) {
                        // console.log('objeto1.telefono', objeto1.telefono);
                        console.log('datosJson[i].telefono', segundoItem, ' \n');
                        // console.log('datosJson[i]', datosJson[i]);
                        // console.log('i ', i);
                        // console.log('objeto1 ** telefono **', objeto1);                    
                    } else if (objeto1.email == tercerItem) {
                        // console.log('objeto1.email', objeto1.email);
                        // console.log('datosJson[i].correoElectronico', datosJson[i].correoElectronico);
                        console.log('objeto1 ** correoElectronico **', tercerItem);
                    }  
                }
            }
        }//for datosJson
        console.log('\n **********************       Proceso finalizado ***************************');     
    });
}

/**1654
 * 
 
 */

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
connect('mongodb://localhost/Ongs');

workSheetsFromFile("C://Users//PC//Documents//generalOSC.xlsx")
    .then(response => {
        //insertDataInDatabase(response);
        //insertNitsNofFoundedInDatabase(response)
        //console.log('datos guardados en Caracterizacion ');
    })
    .catch(error => {
        console.error(': ', error);
    })

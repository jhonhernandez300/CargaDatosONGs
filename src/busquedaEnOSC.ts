import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import fs from 'fs';
import { quitarTildes } from './utils';

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);
    var datosJson: any;
    var counter: number = 1;

    fs.readFile('C:\\Users\\PC\\Documents\\empresasNoEncontradas.json', (error, data) => {
        if (error) {
            console.log('Error', error);
            return;
        }
        datosJson = JSON.parse(data.toString());

        //console.log('datosJson ', datosJson); 

        for (let i = 0; i <= datosJson.length - 1; i++) {
            //for (let i = 0; i < 1; i++) {   
            const primerItem = 'LECHE'; 
            let primerItemSegundaOpcion = '';
            const segundoItem = '8806797';
            const tercerItem = 'direccion@gotadelechemanizales.com';

            /**BUS DE POT
             * ASOCANNACOL
             * 1656 MADRE KUMBRA
             * 1657 COLABORATORIO DE ACCION COLECTIVA  PLURIVERSOS
             * 1659 FUNDACION ECOLOGICA Y DE PAZ FUNDECOPAZ
             * 1661 CENTRO DE ESTUDIOS KUMANDAY
             * 1660 MARCHA CARNAVAL CALDAS
             * 1662 COLECTIVO TEJIENDO TACTOS
             * 1580 CORPORACION PARA EL DEPORTE LA RECREACION Y LA PROMOCION DEL TALENTO HUMANO CORPODER
             * 1663 FUNDACION POLARI
             * 1664 ARMARIO ABIERTO
             * 1665 FUNDACION SOFIA
             * 1666 SEMILLERMO HABITAT SUSTENTABLE
             * 1667 MALEZA
             * 1668 FEMINARIAS
             * 1669 VEEDURIA CIUDADANA AMBIENTAL
             * 1670 FUNDACION CRAZULAS
             * 1499 ASOCIACION GOTA DE LECHE
             * 
             */

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
                    let laRazonSocial: string;

                    var objeto1: any = {
                        razonSocial: element[2] == undefined ? '' : quitarTildes(element[2]),
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

                    if (primerItemSegundaOpcion == '') {
                        if (laRazonSocial.indexOf(primerItem) != -1) {
                            console.log('objeto1 ', objeto1);
                        } else if (objeto1.telefono == segundoItem) {
                            // console.log('objeto1.telefono', objeto1.telefono);
                            //console.log('datosJson[i].telefono', segundoItem, ' \n');
                            // console.log('datosJson[i]', datosJson[i]);
                            // console.log('i ', i);
                            console.log('objeto1 ********** telefono *******', objeto1);                    
                        } else if (objeto1.email == tercerItem) {
                            // console.log('objeto1.email', objeto1.email);
                            // console.log('datosJson[i].correoElectronico', datosJson[i].correoElectronico);
                            console.log('objeto1 ++++++++++++ correoElectronico +++++++++', objeto1);
                        }
                    }else {
                        if (laRazonSocial.indexOf(primerItem) != -1 && laRazonSocial.indexOf(primerItemSegundaOpcion) != -1) {
                            console.log('objeto1 ', objeto1);
                        } else if (objeto1.telefono == segundoItem) {
                            // console.log('objeto1.telefono', objeto1.telefono);
                            //console.log('datosJson[i].telefono', segundoItem, ' \n');
                            // console.log('datosJson[i]', datosJson[i]);
                            // console.log('i ', i);
                            console.log('objeto1 ************** telefono ************', objeto1);                    
                        } else if (objeto1.email == tercerItem) {
                            // console.log('objeto1.email', objeto1.email);
                            // console.log('datosJson[i].correoElectronico', datosJson[i].correoElectronico);
                            console.log('objeto1 ++++++++++ correoElectronico ++++++++++++++++', objeto1);
                        }
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

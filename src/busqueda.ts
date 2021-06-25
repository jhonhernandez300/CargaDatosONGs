import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import { ICaracterizacion } from './icaracterizacion';
import { INit } from './init';
import { EmpresaSchema } from './empresaSchema';
import { NitSchema } from './nit-schema';
import { CaracterizacionSchema } from './caracterizacion-schema';
import fs  from 'fs';

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);    
    var counter: number = 1;
    var datosJson: any;
    var empresasEncontradas: any [] = [];

    fs.readFile('C:\\Users\\PC\\Documents\\empresasNoEncontradas.json', (error, data) => {
        if(error){
            console.log('Error', error);
            return;
        }
        datosJson = JSON.parse(data.toString());
        
        //console.log('datosJson ', datosJson);        
        //console.log('datosEmpresas.length ', datosJson.length);   
        for (let i = 0; i <= datosJson.length - 1; i++) {            
        //for (let i = 0; i < 1; i++) {     
            //console.log('i ', i);                                    
            
            const primerItem = 'CRAZULAS';
            
            /*FUNDACION CULTURA VIVA ARTE Y CORAZON
            FUNDACION UNIVERSITARIA DEL EJE CAFETERO 
            FUNDACION ALEJANDRA VELEZ MEJIA
            FUNDACION SOFIA
            SEMILLERO HABITAT SUSTENTABLE 
            MALEZA
            FEMINARIAS
            VEEDURIA CIUDADANA AMBIENTAL
            FUNDACION CRAZULAS

             */

            // empresasEncontradas.push({
                
            // });

            datosJson[i].razonSocial == undefined ? 'no tiene' : datosJson[i].razonSocial;

            //datosJson[i].telefono = 3137108006;
            datosJson[i].telefono == undefined ? 'no tiene' : datosJson[i].telefono;
            
            //datosJson[i].correoElectronico = 'corpoarte.g.s.manizales@gtmail.com';
            datosJson[i].correoElectronico == undefined ? 'no tiene' : datosJson[i].correoElectronico;
            //console.log('datosJson[i].razonSocial ', datosJson[i].razonSocial);
            //console.log('datosJson[i] ', datosJson[i]);
    
            for (let elementManizales of workSheet[7].data) {
                counter++;
                ////console.log('counter ', counter); 
                if (counter >= 3 && counter <= 1321) {
                //if (counter == 93) {
                    var objeto1: any = {
                        razonSocial: elementManizales[7]  == undefined ? '' : quitarTildes(elementManizales[7]),
                        telefonoComercial1: elementManizales[27] == undefined ? '' : elementManizales[27],
                        telefonoDeNotificacion1: elementManizales[33] == undefined ? '' : elementManizales[33],
                        correo: elementManizales[28] == undefined ? '' : elementManizales[28]
                    };    
            
                //    console.log('objeto1.razonSocial ', objeto1.razonSocial);
                //    console.log('datosJson[i].razonSocial ', datosJson[i].razonSocial);
                //    console.log('objeto1.razonSocial.indexOf(datosJson[i].razonSocial) ', objeto1.razonSocial.indexOf(datosJson[i].razonSocial));

                    // console.log('objeto.telefono ', objeto.telefono);
                    // console.log('datosJson[i].telefono ', datosJson[i].telefono);

                    // console.log('objeto.correo ', objeto.correo);
                    // console.log('datosJson[i].correoElectronico ', datosJson[i].correoElectronico);
                    
                    if (objeto1.razonSocial.indexOf(primerItem) != -1 ) {
                        console.log('objeto1 ', objeto1);                        
                    } else if (objeto1.telefonoComercial1 == datosJson[i].telefono) {
                        console.log('objeto1 ****', objeto1);
                    } else if (objeto1.telefonoDeNotificacion1 == datosJson[i].telefono) {
                        console.log('objeto1 ****', objeto1);                    
                    } else if (objeto1.correo == datosJson[i].correoElectronico) {
                        console.log('objeto1 ****', objeto1);
                    }                
                }
            }
            
            //console.log('i ', i);
            counter = 1;
            for (let element of workSheet[6].data) {
                counter++;
                ////console.log('counter ', counter); 
                if (counter >= 3 && counter <= 95) {
                    //if (counter == 24) {
                    var objeto2: any = {
                        razonSocial: element[7]  == undefined ? '' : quitarTildes(element[7]),
                        telefono: element[27] == undefined ? '' : element[27],
                        correo: element[31] == undefined ? '' : element[31]
                    };    
            
                    //console.log('objeto.razonSocial ', objeto.razonSocial);
                    //console.log('datosJson[i].razonSocial ', datosJson[i].razonSocial);                    

                    // console.log('objeto.telefono ', objeto.telefono);
                    // console.log('datosJson[i].telefono ', datosJson[i].telefono);

                    // console.log('objeto.correo ', objeto.correo);
                    // console.log('datosJson[i].correoElectronico ', datosJson[i].correoElectronico);
                    if (objeto2.razonSocial.indexOf(primerItem) != -1 ) {
                        console.log('objeto2 ', objeto2);
                    } else if (objeto2.telefono == datosJson[i].telefono) {
                        console.log('objeto2 ****', objeto2);
                    } else if (objeto2.correo == datosJson[i].correoElectronico) {
                        console.log('objeto2 ****', objeto2);
                    }                
                }
            }

            counter = 1;
            for (let element of workSheet[5].data) {
                counter++;
                ////console.log('counter ', counter); 
                if (counter >= 3 && counter <= 1102) {
                    //if (counter == 24) {
                    var objeto3: any = {
                        razonSocial: element[2]  == undefined ? '' : quitarTildes(element[2]),
                        telefono: element[13] == undefined ? '' : element[13],
                        correo: element[17] == undefined ? '' : element[17]
                    };    
            
                    //console.log('objeto.razonSocial ', objeto.razonSocial);
                    //console.log('datosJson[i].razonSocial ', datosJson[i].razonSocial);                    

                    // console.log('objeto.telefono ', objeto.telefono);
                    // console.log('datosJson[i].telefono ', datosJson[i].telefono);

                    // console.log('objeto.correo ', objeto.correo);
                    // console.log('datosJson[i].correoElectronico ', datosJson[i].correoElectronico);
                    if (objeto3.razonSocial.indexOf(primerItem) != -1  ) {
                        console.log('objeto3 ', objeto3);
                    } else if (objeto3.telefono == datosJson[i].telefono) {
                        console.log('objeto3 ****', objeto3);
                    } else if (objeto3.correo == datosJson[i].correoElectronico) {
                        console.log('objeto3 ****', objeto3);
                    }                
                }
            }
    
            counter = 1;
            for (let element of workSheet[1].data) {
                counter++;
                ////console.log('counter ', counter); 
                if (counter >= 3 && counter <= 93) {
                    //if (counter == 24) {
                    var objeto4: any = {
                        razonSocial: element[1]  == undefined ? '' : quitarTildes(element[1]),
                        telefono: element[6] == undefined ? '' : element[6],
                        correo: element[4] == undefined ? '' : element[4]
                    };    
            
                    // console.log('objeto4.razonSocial ', objeto4.razonSocial);
                    // console.log('datosJson[i].razonSocial ', datosJson[i].razonSocial);       
                    // console.log('objeto4.razonSocial.indexOf(datosJson[i].razonSocial) ', objeto4.razonSocial.indexOf(datosJson[i].razonSocial));             

                    // console.log('objeto4.telefono ', objeto4.telefono);
                    // console.log('datosJson[i].telefono ', datosJson[i].telefono);

                    // console.log('objeto3.correo ', objeto3.correo);
                    // console.log('datosJson[i].correoElectronico ', datosJson[i].correoElectronico);
                    if (objeto4.razonSocial.indexOf(primerItem) != -1  ) {
                        console.log('objeto4 ', objeto4);
                    } else if (objeto4.telefono == datosJson[i].telefono) {
                        console.log('objeto4 ****', objeto4);
                    } else if (objeto4.correo == datosJson[i].correoElectronico) {
                        console.log('objeto4 ****', objeto4);
                    }                
                }
            }
    
            counter = 1;
            for (let element of workSheet[0].data) {
                counter++;
                ////console.log('counter ', counter); 
                if (counter >= 3 && counter <= 93) {
                    //if (counter == 24) {
                    var objeto5: any = {
                        razonSocial: element[1]  == undefined ? '' : quitarTildes(element[1]),
                        telefono: element[6] == undefined ? '' : element[6],
                        correo: element[4] == undefined ? '' : element[4]
                    };    

                    // console.log('objeto5.razonSocial ', objeto5.razonSocial);
                    // console.log('datosJson[i].razonSocial ', datosJson[i].razonSocial);

                    // console.log('objeto5.telefono ', objeto5.telefono);
                    // console.log('datosJson[i].telefono ', datosJson[i].telefono);

                    // console.log('objeto.correo ', objeto.correo);
                    // console.log('datosJson[i].correoElectronico ', datosJson[i].correoElectronico);
                    if (objeto5.razonSocial.indexOf(primerItem) != -1  ) {
                        console.log('objeto5 ', objeto5);
                    } else if (objeto5.telefono == datosJson[i].telefono) {
                        console.log('objeto5 ****', objeto5);
                    } else if (objeto5.correo == datosJson[i].correoElectronico) {
                        console.log('objeto5 ****', objeto5);
                    }                
                }
            }
        }
        console.log('ciclo for finalizado ');     
    })
};

const procesarValorTexto = (valorDeExcel: any) => {
    if (valorDeExcel == undefined) {
        return '';
    } else {
        return valorDeExcel;
    }
}

const procesarValorEntero = (valorDeExcel: any) => {
    if (valorDeExcel == undefined) {
        return 0;
    } else {
        return parseInt(valorDeExcel);
    }
}

const procesarValorConDecimales = (valorDeExcel: any) => {
    if (valorDeExcel == undefined) {
        return 0.0;
    } else {
        return parseFloat(valorDeExcel);
    }
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

const insertDataInDatabase = async (data: any[]) => {
    const empresaData = mongoose.model('Caracterizacion', CaracterizacionSchema, 'Caracterizacion');
    await empresaData.create(data);
}

const quitarTildes = (dato: any) => {
    if(dato.indexOf('Á') != -1){
        dato = dato.replace('Á', 'A');
    }

    if(dato.indexOf('É') != -1){
        dato = dato.replace('É', 'E');
    }

    if(dato.indexOf('Í') != -1){
        dato = dato.replace('Í', 'I');
    }
    if(dato.indexOf('Ó') != -1){
        dato = dato.replace('Ó', 'O');
    }
    if(dato.indexOf('Ú') != -1){
        dato = dato.replace('Ú', 'U');
    }
    return dato;
}

connect('mongodb://localhost/Ongs');

workSheetsFromFile("C://Users//PC//Documents//BD Camaras de comercio.xlsx")
    .then(response => {
        //insertDataInDatabase(response);
        //insertNitsNofFoundedInDatabase(response)
        //console.log('datos guardados en Caracterizacion ');
    })
    .catch(error => {
        console.error(': ', error);
    })










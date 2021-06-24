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
    var emptyList: any = [];
    var listaDeNitsNoEncontrados: any = [];
    var datosABuscar: any = [];
    var counter: number = 1;
    var contadorNoEncontrados: number = 0;
    var contadorEncontrados: number = 0;
    var contadorCooperativasYPre: number = 0;
    var contadorFiltrados: number = 0;
    var counterObjeto: number = -1;
    var datosEmpresas: any[]=[];
    var datosDeIndex: any[]=[];

    fs.readFile('C:\\Users\\PC\\Documents\\empresasNoEncontradas.json', (error, data) => {
        if(error){
            console.log('Error', error);
            return;
        }
        datosDeIndex = JSON.parse(data.toString());
        console.log('datosDeIndex ', datosDeIndex);
        
    })
    
    datosEmpresas[0] = datosDeIndex[0].razonSocial;
    datosEmpresas[1] = '3116447983';
    datosEmpresas[2] = 'no registra';

    datosEmpresas[3] = 'FUNDACIÓN INTERNACIONAL MARIA DE MORENO';
    datosEmpresas[4] = '7953000';
    datosEmpresas[5] = 'caldasfundacionmarialucia@org.com';

    datosEmpresas[6] = 'ASOCANNACOL';
    datosEmpresas[7] = '3209062861';
    datosEmpresas[8] = 'secretaria.asocannacol.@gmail.com';

    datosEmpresas[9] = 'ASOMONES';
    datosEmpresas[10] = '3232218090';
    datosEmpresas[11] = 'luzdey57@hotmail.com';

    datosEmpresas[12] = 'ASOCIACIÓN AFROCOLOMBIANA DE LA VEREDA MOCHILON';
    datosEmpresas[13] = '3143216285';
    datosEmpresas[14] = 'mirianlh1996@gmail.com';

    datosEmpresas[15] = 'MADRE KUMBRA';
    datosEmpresas[16] = '3183921402';
    datosEmpresas[17] = 'madrekumbra@gmail.com';

    datosEmpresas[18] = 'COLABORATORIO DE ACCIÓN COLECTIVA  PLURIVERSOS';
    datosEmpresas[19] = '3105243899';
    datosEmpresas[20] = 'Pluriversos.culturaypoder@gmail.com';

    datosEmpresas[21] = 'FUNDACIÓN ECOLÓGICA Y DE PAZ (FUNDECOPAZ)';
    datosEmpresas[22] = '3137240786';
    datosEmpresas[23] = 'yalilegarcia29@gmail.com';

    datosEmpresas[24] = '';
    datosEmpresas[25] = '';
    datosEmpresas[26] = '';

    datosEmpresas[24] = '';
    datosEmpresas[25] = '';
    datosEmpresas[26] = '';

    datosEmpresas[24] = '';
    datosEmpresas[25] = '';
    datosEmpresas[26] = '';

    datosEmpresas[24] = '';
    datosEmpresas[25] = '';
    datosEmpresas[26] = '';

    datosEmpresas[24] = '';
    datosEmpresas[25] = '';
    datosEmpresas[26] = '';

    datosEmpresas[24] = '';
    datosEmpresas[25] = '';
    datosEmpresas[26] = '';

    datosEmpresas[24] = '';
    datosEmpresas[25] = '';
    datosEmpresas[26] = '';

    datosEmpresas[24] = '';
    datosEmpresas[25] = '';
    datosEmpresas[26] = '';

    
    var i: number;
    for (i = 0; i <= datosEmpresas.length - 1; i = i+3) {

        for (let element of workSheet[7].data) {
            counter++;
            ////console.log('counter ', counter); 
            if (counter >= 3 && counter <= 1321) {
                //if (counter == 24) {
                var objeto: any = {
                    razonSocial: element[7]  == undefined ? '' : element[7],
                    telefono: element[27] == undefined ? '' : element[27],
                    correo: element[28] == undefined ? '' : element[28]
                };

                if (objeto.razonSocial.indexOf(datosEmpresas[i]) != -1) {
                    //console.log('objeto.razonSocial ', objeto.razonSocial);
                } else if (objeto.telefono == datosEmpresas[i+1]) {
                    //console.log('objeto.telefono ', objeto.telefono);
                } else if (objeto.correo == datosEmpresas[i+2]) {
                    //console.log('objeto.correo ', objeto.correo);
                }                
            }
        }
        ////console.log('No encontrado ', datosEmpresas[i]);

        counter = 1;
        for (let element of workSheet[6].data) {
            counter++;
            ////console.log('counter ', counter); 
            if (counter >= 3 && counter <= 95) {
                //if (counter == 24) {
                var objeto: any = {
                    razonSocial: element[7] == undefined ? '' : element[7],
                    telefono: element[27] == undefined ? '' : element[27],
                    correo: element[31]  == undefined ? '' : element[31]
                };

                if (objeto.razonSocial.indexOf(datosEmpresas[i]) != -1) {
                    //console.log('objeto.razonSocial ', objeto.razonSocial);
                } else if (objeto.telefono == datosEmpresas[i+1]) {
                    //console.log('objeto.telefono ', objeto.telefono);
                } else if (objeto.correo == datosEmpresas[i+2]) {
                    //console.log('objeto.correo ', objeto.correo);
                }                
            }
        }

        counter = 1;
        for (let element of workSheet[5].data) {
            counter++;
            ////console.log('counter ', counter); 
            if (counter >= 3 && counter <= 1102) {
                //if (counter == 24) {
                var objeto: any = {
                    razonSocial: element[2] == undefined ? '' : element[2],
                    telefono: element[13] == undefined ? '' : element[13],
                    correo: element[17]  == undefined ? '' : element[17]
                };

                if (objeto.razonSocial.indexOf(datosEmpresas[i]) != -1) {
                    //console.log('objeto.razonSocial ', objeto.razonSocial);
                } else if (objeto.telefono == datosEmpresas[i+1]) {
                    //console.log('objeto.telefono ', objeto.telefono);
                } else if (objeto.correo == datosEmpresas[i+2]) {
                    //console.log('objeto.correo ', objeto.correo);
                }                
            }
        }

        counter = 1;
        for (let element of workSheet[1].data) {
            counter++;
            ////console.log('counter ', counter); 
            if (counter >= 3 && counter <= 93) {
            //if (counter == 93) {
                //if (counter == 24) {
                var objeto: any = {
                    razonSocial: element[1] == undefined ? '' : element[1],
                    telefono: element[5] == undefined ? '' : element[5],
                    correo: element[4]  == undefined ? '' : element[4]
                };
                ////console.log('objeto ', objeto);

                if (objeto.razonSocial.indexOf(datosEmpresas[i]) != -1) {
                    //console.log('objeto.razonSocial ', objeto.razonSocial);
                } else if (objeto.telefono == datosEmpresas[i+1]) {
                    //console.log('objeto.telefono ', objeto.telefono);
                } else if (objeto.correo == datosEmpresas[i+2]) {
                    //console.log('objeto.correo ', objeto.correo);
                }                
            }
        }

        counter = 1;
        for (let element of workSheet[0].data) {
            counter++;
            ////console.log('counter ', counter); 
            if (counter >= 3 && counter <= 87) {
            //if (counter == 87) {
                //if (counter == 24) {
                var objeto: any = {
                    razonSocial: element[1] == undefined ? '' : element[1],
                    telefono: element[5] == undefined ? '' : element[5],
                    correo: element[4]  == undefined ? '' : element[4]
                };
                ////console.log('objeto ', objeto);

                if (objeto.razonSocial.indexOf(datosEmpresas[i]) != -1) {
                    //console.log('objeto.razonSocial ', objeto.razonSocial);
                } else if (objeto.telefono == datosEmpresas[i+1]) {
                    //console.log('objeto.telefono ', objeto.telefono);
                } else if (objeto.correo == datosEmpresas[i+2]) {
                    //console.log('objeto.correo ', objeto.correo);
                }                
            }
        }

    }
    //console.log('ciclo for finalizado ');
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










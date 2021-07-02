import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import { EmpresasNoEncontradasSchema } from './empresas-no-encontradas-schema';
import fs from 'fs';
import { EmpresariosSchema } from './empresarios-schema';
import { Types } from 'mongoose';

// let listado: string[] = ['FUNDACION INTERNACIONAL MARIA DE MORENO',
//     'ASOMONES',
//     'ASOCIACION AFROCOLOMBIANA DE LA VEREDA MOCHILON',
//     'COMCHIDOR',
//     'MANIZALES EN COMUN',
//     'FUNDACION CULTURA VIVA ARTE Y CORAZON',
//     'FUNDACION UNIVERSITARIA DEL EJE CAFETERO',
//     'FUNDACION ALEJANDRA VELEZ MEJIA',
//     'FUNDACION PEQUENO CORAZON',
//     'CORPORACION ALBERTO ARANGO RESTREPO CEDER'
// ];

// let listadoDeLas10: string[] = ['BUS DE POT',
//              'ASOCANNACOL',
//              'MADRE KUMBRA',
//              'COLABORATORIO DE ACCION COLECTIVA PLURIVERSOS',
//              'FUNDACION ECOLOGICA Y DE PAZ FUNDECOPAZ',
//              'CENTRO DE ESTUDIOS KUMANDAY',
//              'MARCHA CARNAVAL CALDAS',
//              'COLECTIVO TEJIENDO TACTOS',
//              'CORPORACION PARA EL DEPORTE LA RECREACION Y LA PROMOCION DEL TALENTO HUMANO CORPODER',
//              'FUNDACION POLARI',
//              'ARMARIO ABIERTO',
//              'FUNDACION SOFIA',
//              'SEMILLERO HABITAT SUSTENTABLE',
//              'MALEZA',
//              'FEMINARIAS',
//              'VEEDURIA CIUDADANA AMBIENTAL',
//              'FUNDACION CRAZULAS',
//              'ASOCIACION GOTA DE LECHE'
// ];

let listadoTodasJuntas: string[] = [
    'FUNDACION INTERNACIONAL MARIA DE MORENO',
    'ASOMONES',
    'ASOCIACION AFROCOLOMBIANA DE LA VEREDA MOCHILON',
    'COMCHIDOR',
    'MANIZALES EN COMUN',
    'FUNDACION CULTURA VIVA ARTE Y CORAZON',
    'FUNDACION UNIVERSITARIA DEL EJE CAFETERO',
    'FUNDACION ALEJANDRA VELEZ MEJIA',
    'FUNDACION PEQUENO CORAZON',
    'CORPORACION ALBERTO ARANGO RESTREPO CEDER',
    'BUS DE POT',
    'ASOCANNACOL',
    'MADRE KUMBRA',
    'COLABORATORIO DE ACCION COLECTIVA PLURIVERSOS',
    'FUNDACION ECOLOGICA Y DE PAZ FUNDECOPAZ',
    'CENTRO DE ESTUDIOS KUMANDAY',
    'MARCHA CARNAVAL CALDAS',
    'COLECTIVO TEJIENDO TACTOS',
    'CORPORACION PARA EL DEPORTE LA RECREACION Y LA PROMOCION DEL TALENTO HUMANO CORPODER',
    'FUNDACION POLARI',
    'ARMARIO ABIERTO',
    'FUNDACION SOFIA',
    'SEMILLERO HABITAT SUSTENTABLE',
    'MALEZA',
    'FEMINARIAS',
    'VEEDURIA CIUDADANA AMBIENTAL',
    'FUNDACION CRAZULAS',
    'ASOCIACION GOTA DE LECHE',   

];

var idEmpresa: any;
var idEmpresario: any;

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

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);
    var listaDeEmpresas: any = [];
    var registro: number = 11;

    for (let element of workSheet[0].data) {
        registro++;
        //console.log('registro ', registro);
        if (registro >= 22 && registro <= 154) {
        //console.log('Entrando al if ');
        //console.log('element[0] ', element[0]);
        //if (registro == 22) {

            //console.log(' ', removeAccents(element[1]) == undefined ? '' : removeAccents(element[1]));
            //console.log('removeAccents(element[2]) ', removeAccents(element[2]));
            if (revisarContraListado(removeAccents(element[2]) as string)) {
            //if (revisarContraListado(removeAccents('ASOMONES'))) {                
                listaDeEmpresas.push({
                    nit: element[3] == undefined ? 0 : element[3],                    
                    razonSocial: toTitleCase(removeAccents(element[2])) == undefined ? '' : toTitleCase(removeAccents(element[2])),
                    nombreComercial: toTitleCase(removeAccents(element[2])) == undefined ? '' : toTitleCase(removeAccents(element[2])),
                    municipio: toTitleCase(element[10] as string) == undefined ? '' : toTitleCase(element[10] as string),
                    direccionDeLaOrganizacion: toTitleCase(element[11] as string) == undefined ? '' : toTitleCase(element[11] as string),
                    barrioComuna: '',
                    estaEliminado: false,
                    telefono: element[12] == undefined ? '' : element[12],
                    correoElectronico: element[13] == undefined ? '' : element[13],
                    tipologiaDeLaOrganizacion: toTitleCase(element[21] as string) == undefined ? '' : toTitleCase(element[21] as string),
                    subregion: toTitleCase(element[9] as string) == undefined ? '' : toTitleCase(element[9] as string),
                    institucion: Types.ObjectId('5fe0c8dc7d8f1448e8532252'),
                    empresarios: [],
                    nombre: toTitleCase(element[6] as string) == undefined ? 0 : toTitleCase(element[6] as string),
                    institucionEmpresarios: 'Federacion De Ongs De Caldas',
                    negocio: [],
                    cohortes: []
                });
                //console.log('objeto ', objeto);
            }
        }
    }    
    //console.log('listaDeEmpresas.length ', listaDeEmpresas.length);
    return listaDeEmpresas;
};

const revisarContraListado = (data: string): boolean => {    
    return listadoTodasJuntas.includes(data.toUpperCase());    
}

const removeAccents = (str: any): string => {
    //console.log('str', str);
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

}

connect('mongodb://localhost/Ongs');

const grabarEmpresa = async (data: any) => {
    var datoDeLaEmpresa: any = [];
    datoDeLaEmpresa.push({
        nit: data.nit,
        razonSocial: data.razonSocial,
        estaEliminado: data.estaEliminado,
        idCohorte: data.idCohorte,
        nombreComercial: data.nombreComercial,
        municipio: data.municipio,
        direccionDeLaOrganizacion: data.direccionDeLaOrganizacion,
        barrioComuna: data.barrioComuna,
        telefono: data.telefono,
        correoElectronico: data.correoElectronico,
        tipologiaDeLaOrganizacion: data.tipologiaDeLaOrganizacion,
        subregion: data.subregion,
        institucion: Types.ObjectId(data.institucion),
        empresarios: data.empresarios,
        cohortes: data.cohortes
    });
    //const empresaData = mongoose.model('CaracterizacionEmpresasNoEncontradas', EmpresasNoEncontradasSchema, 'CaracterizacionEmpresasNoEncontradas');
    const empresaData = mongoose.model('CaracterizacionJuntasNoEncontradas', EmpresasNoEncontradasSchema, 'CaracterizacionJuntasNoEncontradas');
    //const empresaData = mongoose.model('Prueba18Empresas', EmpresasNoEncontradasSchema, 'Prueba18Empresas');
    return await empresaData.create(datoDeLaEmpresa);
}

workSheetsFromFile("C://Users//PC//Documents//2019_12_19_Caracterización detallada (2).xlsx")
    .then(async responseExcel => {
        //console.log('response ', responseExcel);
        for (let i = 0; i <= responseExcel.length - 1; i++) {
            //console.log('responseEmpresa[i] ', responseExcel[i]);
            var responseEmpresa = await grabarEmpresa(responseExcel[i]);
            //console.log('responseEmpresa ', responseEmpresa);
            //console.log('responseEmpresa[0]._id ', responseEmpresa[0]._id);      
            var responseEmpresario = await guardarEmpresario(responseExcel[i], responseEmpresa[0]._id) //Se usa response porque responseExcel tiene los datos de la empresa y del empresario
            //console.log('responseEmpresario ', responseEmpresario);      
            //console.log('Empresario guardado, responseEmpresario[0]._id ', responseEmpresario[0]._id);
            var responseActualizarEmpresa = await actualizarEmpresa(responseEmpresa[0]._id, responseEmpresario[0]._id);
            //console.log('responseActualizarEmpresa, ', responseActualizarEmpresa);
            console.log('///////////////////////                 Proceso Terminado  para  una empresa        /////////////////////');
        }
    })
    .catch(error => {
        // console.error(': ', error);
    })

const guardarEmpresario = async (data: any, idEmpresa: any) => {
    data.negocio.push(idEmpresa);
    //console.log('data.negocio ', data.negocio);

    var datoDelEmpresario: any = [];
    datoDelEmpresario.push({
        nombre: data.nombre,
        institucion: Types.ObjectId(data.institucion),
        correoElectronico: data.correoElectronico,
        telefono: data.telefono,
        negocio: data.negocio
    });
    const empresarios = mongoose.model('Empresarios', EmpresariosSchema, 'Empresarios');
    //const empresarios = mongoose.model('Prueba18Empresarios', EmpresariosSchema, 'Prueba18Empresarios');
    return await empresarios.create(datoDelEmpresario);
}

const actualizarEmpresario = async (idEmpresa: any, idEmpresario: any) => {
    const data = mongoose.model('Empresarios', EmpresariosSchema, 'Empresarios');
    await data.updateOne({ _id: idEmpresa }, { $addToSet: { negocio: idEmpresa } });
}

const actualizarEmpresa = async (idEmpresa: any, idEmpresario: any) => {
    //const data = mongoose.model('CaracterizacionEmpresasNoEncontradas', EmpresasNoEncontradasSchema, 'CaracterizacionEmpresasNoEncontradas');
    const data = mongoose.model('CaracterizacionJuntasNoEncontradas', EmpresasNoEncontradasSchema, 'CaracterizacionJuntasNoEncontradas');
    //const data = mongoose.model('Prueba18Empresas', EmpresasNoEncontradasSchema, 'Prueba18Empresas');
    await data.updateOne({ _id: idEmpresa }, { $addToSet: { empresarios: idEmpresario } });
}

function toTitleCase(str: string) {
    return str.replace(/\S+/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
}

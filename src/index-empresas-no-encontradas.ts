import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import { EmpresasNoEncontradasSchema } from './empresas-no-encontradas-schema';
import fs from 'fs';
import { EmpresariosSchema } from './empresarios-schema';

let listado: string[] = ['FUNDACION INTERNACIONAL MARIA DE MORENO',
    'ASOMONES',
    'ASOCIACION AFROCOLOMBIANA DE LA VEREDA MOCHILON',
    'COMCHIDOR',
    'MANIZALES EN COMUN',
    'FUNDACION CULTURA VIVA ARTE Y CORAZON',
    'FUNDACION UNIVERSITARIA DEL EJE CAFETERO',
    'FUNDACION ALEJANDRA VELEZ MEJIA',
    'FUNDACION PEQUENO CORAZON',
    'CORPORACION ALBERTO ARANGO RESTREPO CEDER'
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
        if (registro >= 22 && registro <= 154) {
            //if (registro == 89) {
            var objeto: any = {
                nit: element[2] == undefined ? 0 : element[2],
                razonSocial: removeAccents(element[1]) == undefined ? '' : removeAccents(element[1]),
                nombreComercial: element[1] == undefined ? '' : element[1],
                municipio: element[9] == undefined ? '' : element[9],
                direccionDeLaOrganizacion: element[10] == undefined ? '' : element[10],
                barrioComuna: '',
                telefono: element[11] == undefined ? '' : element[11],
                correoElectronico: element[12] == undefined ? '' : element[12],
                tipologiaDeLaOrganizacion: element[20] == undefined ? '' : element[20],
                subregion: element[8] == undefined ? '' : element[8],
                institucion: '5fe0c8dc7d8f144e8532252',
                empresarios: []
            };
            //console.log('objeto ', objeto);

            if (revisarContraListado(objeto.razonSocial) == true) {
                listaDeEmpresas.push({
                    nit: objeto['nit'],
                    razonSocial: objeto['razonSocial'],
                    nombreComercial: removeAccents(objeto['nombreComercial']),
                    municipio: removeAccents(objeto['municipio']),
                    direccionDeLaOrganizacion: removeAccents(objeto['direccionDeLaOrganizacion']),
                    barrioComuna: removeAccents(objeto['barrioComuna']),
                    telefono: objeto['telefono'],
                    correoElectronico: objeto['correoElectronico'],
                    tipologiaDeLaOrganizacion: removeAccents(objeto['tipologiaDeLaOrganizacion']),
                    subregion: removeAccents(objeto['subregion']),
                    institucion: removeAccents(objeto['institucion']),
                    empresarios: objeto['empresarios'],
                });
                //console.log('listaDeEmpresas ', listaDeEmpresas);
                return listaDeEmpresas;
            }
        }
    }
    //console.log('listaDeEmpresas ', listaDeEmpresas);
    //console.log('listaDeEmpresas.length ', listaDeEmpresas.length);
    //return listaDeEmpresas;
};

const revisarContraListado = (data: string): boolean => {
    for (let i = 0; i <= listado.length - 1; i++) {
        // console.log('listado[i] ', listado[i]);
        // console.log('data ', data);
        // console.log('listado[i] == data ', listado[i] == data, '\n');
        if (listado[i] == data) {
            return true;
        }
    }
    return false;
}

const removeAccents = (str: any): string => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

connect('mongodb://localhost/Ongs');

const grabarEmpresa = async (data: any[]) => {
    var datoDeLaEmpresa: any = [];
    datoDeLaEmpresa.push({
        nit: data[0].nit,
        razonSocial: data[0].razonSocial,
        nombreComercial: data[0].nombreComercial,
        municipio: data[0].municipio,
        direccionDeLaOrganizacion: data[0].direccionDeLaOrganizacion,
        barrioComuna: data[0].barrioComuna,
        telefono: data[0].telefono,
        correoElectronico: data[0].correoElectronico,
        tipologiaDeLaOrganizacion: data[0].tipologiaDeLaOrganizacion,
        subregion: data[0].subregion,
        institucion: data[0].institucion,
        empresarios: data[0].empresarios
    });
    const empresaData = mongoose.model('CaracterizacionEmpresasNoEncontradas', EmpresasNoEncontradasSchema, 'CaracterizacionEmpresasNoEncontradas');
    return await empresaData.create(datoDeLaEmpresa);
}

workSheetsFromFile("C://Users//PC//Documents//2019_12_19_Caracterización detallada (2).xlsx")
    .then(response => {
        //console.log('response ', response);
        idEmpresa = grabarEmpresa(response);
        console.log('***************           Empresa guardada       *************************** ');
        //buscarEmpresario("C://Users//PC//Documents//2019_12_19_Caracterización detallada (2).xlsx", idEmpresa)
        //     .then(otraRespuesta => {
        //         idEmpresario = guardarEmpresario(otraRespuesta);
        //     })
        //     .catch(error => {
        //         console.error(': ', error);
        //     })
        // console.log('++++++++++++++++           Empresario guardado       +++++++++++++++++++++++++ ');
        // actualizarEmpresa(idEmpresa, idEmpresario);
        // console.log('***************      ****     Empresa Actualizada   ****     *************************** ');
    })
    .catch(error => {
        console.error(': ', error);
    })

const buscarEmpresario = async (path: string, idEmpresa: any) => {
    // const workSheet = xlsx.parse(path);
    // var listaDeEmpresarios: any = [];
    // var registro: number = 11;

    // for (let element of workSheet[0].data) {
    //     registro++;
    //     if (registro >= 22 && registro <= 154) {
    //         //if (registro == 89) {

    //         //if ()
    //             var objeto: any = {
    //                 nombre: element[6] == undefined ? 0 : element[6],
    //                 institucion: 'FEDERACION DE ONGS DE CALDAS',
    //                 correoElectronico: element[13] == undefined ? '' : element[13],
    //                 telefono: element[12] == undefined ? '' : element[12],
    //                 negocio: [idEmpresa]
    //           //  };
    //         //console.log('objeto ', objeto);

    //         listaDeEmpresarios.push({
    //             nombre: objeto['nombre'],
    //             institucion: objeto['institucion'],
    //             correoElectronico: removeAccents(objeto['correoElectronico']),
    //             telefono: removeAccents(objeto['telefono']),
    //             negocio: removeAccents(objeto['negocio'])
    //         });
    //         //console.log('quitarTildes(objeto[razonSocial]) ', quitarTildes(objeto['razonSocial']));      
    //         return listaDeEmpresarios;
    //     }
    // }
    //console.log('listaDeEmpresas ', listaDeEmpresas);
    //console.log('listaDeEmpresas.length ', listaDeEmpresas.length);
    //return listaDeEmpresas;
};

const guardarEmpresario = async (empresario: any) => {
    const data = mongoose.model('Empresarios', EmpresariosSchema, 'Empresarios');
    return await data.create(empresario);
}

const actualizarEmpresa = async (idEmpresa: any, idEmpresario: any) => {
    const data = mongoose.model('Empresarios', EmpresariosSchema, 'Empresarios');
    await data.updateOne({ _id: idEmpresa }, { $addToSet: { empresarios: idEmpresario } });
}


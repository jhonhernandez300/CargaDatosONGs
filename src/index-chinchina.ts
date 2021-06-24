import mongoose from 'mongoose';
import xlsx from 'node-xlsx';
import { EmpresaSchema } from './empresaSchema';
import { CaracterizacionChinchinaSchema } from './caracterizacion-chinchina-schema';
import { NitSchema } from './nit-schema';
import { CaracterizacionSchema } from './caracterizacion-schema';

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);
    var emptyList: any = [];
    var listaDeNitsNoEncontrados: any = [];
    var datosDeLosNoEncontrados: any = [];
    var counter: number = 1;
    var contadorNoEncontrados: number = 0;
    var contadorEncontrados: number = 0;
    var contadorCooperativasYPre: number = 0;
    var contadorFiltrados: number = 0;
    var indice: number = -1;
    var counterObjeto: number = -1;
    var datosEmpresas: any = [];

    for (let element of workSheet[6].data) {
        counter++;                
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 95) {
            //if (counter >= 4) { 
        //if (counter == 95) {
            var objeto: any = { nit: element[15]== undefined ? '' : element[15], 
                                telefonoComercial1: element[27]== undefined ? '' : element[27], 
                                emailComercial: element[31]== undefined ? '' : element[31], 
                                razonSocial: element[7]== undefined ? '' : element[7],
                                claGenEsadl: element[51]== undefined ? '' : element[51]  
                            };
            //console.log('objeto ', objeto); 
            if (objeto.claGenEsadl.indexOf('FONDOS') != -1
                || objeto.claGenEsadl.indexOf('COOPERATIVAS') != -1
                || objeto.razonSocial.indexOf('LIQUIDACION') != -1
                || objeto.razonSocial.indexOf('PRECOOPERATIVAS') != -1) {
                    contadorFiltrados++;
                    continue;
            }  
            const datosEmpresas = await searchInEmpresa(objeto.nit, objeto.telefono, objeto.correo);
            //console.log('datosEmpresas ', datosEmpresas);
            if (datosEmpresas == '') {
                //console.log('objeto[nit] ', objeto['nit']);                
                datosDeLosNoEncontrados.push({ nit: objeto['nit'], 
                                            emailComercial: objeto['emailComercial'], 
                                            telefonoComercial1: objeto['telefonoComercial1'], 
                                            razonSocial: objeto['razonSocial'], 
                                            claGenEsadl: objeto['claGenEsadl'] 
                                        });
                contadorNoEncontrados++;
            } else {
                contadorEncontrados++;
            }

            if (datosEmpresas.length > 0) {                
                //console.log('columnasDeExcelConDatos ', columnasDeExcelConDatos);
                var idDeMongo = datosEmpresas[0]._id;
                objeto['idEmpresa'] = idDeMongo;
                emptyList.push({
                    empresa: objeto['idEmpresa'],                    
                    nit: objeto['nit'],
                    telefonoComercial1: objeto['telefonoComercial1'],
                    emailComercial: objeto['emailComercial'],
                    BaseDeDatosOrigen: element[0], //a,
                    matricula: element[1], //b
                    organizacion: element[3], //d,
                    categoria: element[4], //e,
                    estMatricula: element[5], //f,
                    estDatos: element[6], //g,
                    razonSocial: element[7], //h,
                    fechaDeMatricula: element[16], //q,
                    fechaDeRenovacion: element[17], //r,
                    ultimoYearDeRenovacion: element[18], //s,
                    fechaConstitucion: element[20], //u,
                    fechaDeVigencia: element[23], //x,
                    direccionComercial: element[24], //y,
                    municipioComercial: element[26], //aa,
                    telefonoComercial2: procesarValorEntero(element[28]), //ac,
                    vigilancia: procesarValorTexto(element[30]), //ae),
                    direccionDeNotificacion: element[34], //ai,
                    municipioDeNotificacion: element[35], //aj,
                    telefonoDeNotificacion1: procesarValorEntero(element[36]), //ak,
                    telefonoDeNotificacion2: procesarValorEntero(element[37]), //al,
                    emailNotificacion: element[38], //am,
                    ciiu1: element[39], //an,
                    ctrEmbargo: procesarValorNS(element[45]), //at),
                    ubicacion: element[49], //ax,
                    claGenEsadl: element[50], //ay,
                    claEspeEsadl: element[51], //az,
                    benLey1780Mat: procesarValorNS(element[54]), //bc),
                    cumLey1780Ren: procesarValorNS(element[55]), //bd),
                    manLey1780Ren: procesarValorNS(element[56]), //be),
                    tamañoDeLaEmpresa: procesarValorTexto(element[60]), //bi),
                    personal: element[61], //bj,
                    activoCorriente: procesarValorConDecimales(element[62]), //bk,
                    activoTotal: procesarValorConDecimales(element[67]), //bp,
                    pasivoCorriente: procesarValorConDecimales(element[68]), //bq,
                    pasivoTotal: procesarValorConDecimales(element[70]), //bs,
                    patrimonio: procesarValorConDecimales(element[71]), //bt,
                    pasivoMasPatrimonio: procesarValorConDecimales(element[72]), //bu,
                    ingresosOperacionales: procesarValorConDecimales(element[73]), //bv,
                    ingresosNoOperacionales: procesarValorConDecimales(element[74]), //bw,
                    gastosOperacionales: procesarValorConDecimales(element[75]), //bx,
                    gastosNoOperacionales: procesarValorConDecimales(element[76]), //by,
                    costosDeVentas: procesarValorConDecimales(element[77]), //bz,
                    gastosDeImpuestos: procesarValorConDecimales(element[79]), //ca,
                    utilidadesOperacional: procesarValorConDecimales(element[80]), //cb,
                    utilidadesNetas: procesarValorConDecimales(element[81]), //cc,
                    grupoNiif: procesarValorTexto(element[82]), //cd),
                    yearDatos: element[83], //ce,
                    fechaDatos: element[84], //cf,
                    patrimEsadl: element[95], //cr,
                    fechaDePagoDeRenta2015: element[123], //dt,
                    fechaDePagoDeRenta2016: element[124], //du,
                    fechaDePagoDeRenta2017: element[125], //dv,
                    fechaDePagoDeRenta2018: element[126], //dw,
                    fechaDePagoDeRenta2019: element[127], //dx,
                    acti2015: element[128], //dy,
                    acti2016: element[129], //dz,
                    acti2017: element[130], //ea,
                    acti2018: element[131], //eb,
                    acti2019: element[132], //ec,
                    tieneLibros: procesarValorNS(element[134]), //ee),
                    repLegal: procesarValorEntero(element[136]), //eg,
                    nombreDelRepresentanteLegal: element[137], //eh,
                    autEnv: procesarValorNS(element[148]), //es)
                });
            }
        }
    }
    //console.log('emptyList ', emptyList);       
    console.log('contadorEncontrados ', contadorEncontrados);
    // console.log('contadorNoEncontrados ', contadorNoEncontrados); 
    // console.log('contadorFiltrados ', contadorFiltrados);
    // console.log('datos de los no encontrados ', datosDeLosNoEncontrados);
     
    return emptyList;    
};

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

const searchCompany = async (nit: string, telefono: string, correoElectronico: string, path: string) => {
    const workSheet = xlsx.parse(path);

    for (let element of workSheet[0].data) {
        var companyInformation: any = { Id: element[0], Nit: element[1], Telefono: element[6], Correo: element[7] };

        if (nit == companyInformation.Nit) {
            console.log('aaaaaaaa');
            return true;
        } else if (telefono == companyInformation.Telefono) {
            return true;
        } else if (correoElectronico == companyInformation.Correo) {
            return true;
        } else {
            return false;
        }
    }
}

const searchInEmpresa = async (nit: string, telefono: string, correoElectronico: string) => {
    const empresaData = mongoose.model('Empresa', EmpresaSchema, 'Empresa');
    var data = await empresaData.find({
        $or: [{ nit }, { telefono }, { correoElectronico }]
    });
    //console.table(data);
    //console.log('data ', data);
    return data;
}

const searchInCaracterizacion = async (nit: string, telefono: string, correoElectronico: string) => {
    const caracterizacionData = mongoose.model('Caracterizacion', CaracterizacionChinchinaSchema, 'Caracterizacion');
    var data = await caracterizacionData.find({
        $or: [{ nit }, { telefono }, { correoElectronico }]
    });
    //console.table(data);
    //console.log('data ', data);
    return data;
}

const procesarValorNS = (valorDeExcel: any) => {
    if (valorDeExcel == 'N') return false;
    if (valorDeExcel == 'S') return true;
    if (valorDeExcel == undefined) return false;
}

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

connect('mongodb://localhost/Ongs');

const insertDataInDatabase = async (data: any[]) => {
    const empresaData = mongoose.model('CaracterizacionChinchina', CaracterizacionChinchinaSchema, 'CaracterizacionChinchina');
    //const empresaData = mongoose.model('Prueba', CaracterizacionChinchinaSchema, 'Prueba');
    await empresaData.create(data);
}

workSheetsFromFile("C://Users//PC//Documents//BD Camaras de comercio.xlsx")
    .then(response => {
        insertDataInDatabase(response);        
        console.log('datos guardados en CaracterizacionChinchina ');        
    })
    .catch(error => {
        console.error(': ', error);
    })

const insertNitsNotFoundedInDatabase = async (data: any[]) => {
    //console.log('data ', data);
    const empresaData = mongoose.model('NitNoEncontradosChinchina', NitSchema, 'NitNoEncontradosChinchina');
    //const empresaData = mongoose.model('PruebaNitNoEncontrados', NitSchema, 'PruebaNitNoEncontrados');
    await empresaData.create(data);
    //console.log('Nit no encontrados guardados en la colección NitNoEncontrados');
}
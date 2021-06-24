import mongoose from 'mongoose';
import xlsx from 'node-xlsx';
import { EmpresaSchema } from './empresaSchema';
import { CaracterizacionManizalesSchema } from './caracterizacion-manizales-schema';
import { NitSchema } from './nit-schema';
import { CaracterizacionSchema } from './caracterizacion-schema';

const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);
    var emptyList: any = [];
    var listaDeNitsNoEncontrados: any = [];
    var counter: number = 1;
    var contadorNoEncontrados: number = 0;
    var contadorEncontrados: number = 0;
    var contadorCooperativasYPre: number = 0;
    var contadorFiltrados: number = 0;
    var counterObjeto: number = -1;
    var datosEmpresas: any = [];

    for (let element of workSheet[7].data) {
        counter++;
        counterObjeto++;
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 1321) {
            //if (counter == 3) {
            var objeto: any = {
                nit: element[15] == undefined ? '' : element[15],
                telefono: element[27] == undefined ? '' : element[27],
                correo: element[28] == undefined ? '' : element[28],
                razonSocial: element[7] == undefined ? '' : element[7],
                claGenEsdl: element[47] == undefined ? '' : element[47]
            };
            //console.log('objeto ', objeto);   
            if (objeto.claGenEsdl.indexOf('FONDOS') != -1
                || objeto.claGenEsdl.indexOf('COOPERATIVAS') != -1
                || objeto.razonSocial.indexOf('LIQUIDACION') != -1
                || objeto.razonSocial.indexOf('PRECOOPERATIVAS') != -1) {
                    contadorFiltrados++;
                    continue;
            }
            //console.log('aaaaaaaaaa ');
            const datosEmpresas = await searchInEmpresa(objeto.nit, objeto.telefono, objeto.correo);
            //console.log('datosEmpresas ', datosEmpresas);
            if (datosEmpresas == '') {
                if (objeto['nit'] !== undefined) listaDeNitsNoEncontrados.push({ nit: objeto['nit'] });
                //console.log('objeto.correo ', objeto.correo);
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
                    telefonoComercial1: objeto['telefono'],
                    emailComercial: objeto['correo'],
                    baseDeDatosOrigen: element[0],//a
                    matricula: element[1], //b,                    
                    organizacion: element[3], //d, 
                    categoria: element[4], //e,
                    estMatricula: element[5], //f,
                    estDatos: element[6], //g,
                    razonSocial: element[7], //h,                                
                    claseId: element[13], //n,
                    identificacion: element[14], //o,        
                    fechaDeMatricula: element[16], //q,
                    fechaDeRenovacion: element[17], //r,
                    ultimoYearDeRenta: element[16], //s,          
                    fechaDeConstitucion: element[20], //u,                        
                    fechaDeVigencia: element[23], //x,
                    direccionComercial: element[24], //y,
                    barrioComercial: element[25], //z,
                    MunicipioComercial: element[26], //aa,                        
                    direccionDeNotificacion: element[31], //af,
                    municipioDeNotificacion: element[32], //ag,
                    telefonoDeNotificacion1: procesarValorEntero(element[33]), //ah),
                    telefonoDeNotificacion2: procesarValorEntero(element[34]), //ai),
                    emailDeNotificacion: element[35], //aj,
                    ciiu1: element[36], //ak,
                    ciiu2: procesarValorTexto(element[37]), //al),                
                    librosComercio: procesarValorNS(element[41]), //ap),
                    ctrEmbargo: procesarValorNS(element[42]), //aq),        
                    ubicacion: element[46], //au,
                    claGenEsadl: procesarValorTexto(element[47]), //av),
                    claEspeEsadl: element[48], //aw,                                
                    cumLey1780Ren: procesarValorNS(element[52]), //ba),
                    manLey1780Ren: procesarValorNS(element[53]), //bb),        
                    TamañoDeLaEmpresa: element[57], //bf,
                    personal: element[58], //bg,
                    activoCorriente: element[59], //bh,
                    activoNoCorriente: element[60], //bi,        
                    activoTotal: element[64], //bm,
                    pasivoCorriente: element[65], //bn,
                    pasivoALargoPlazo: element[66], //bo,
                    PasivoTotal: element[67], //bp,
                    patrimonio: element[68], //bq,
                    pasivoMasPatrimonio: element[69], //br,
                    ingresosOperacionales: element[70], //bs,
                    ingresosNoOperacionales: element[71], //bt,
                    gastosOperacionales: element[72], //bu,           
                    gastosNoOperacionales: element[73], //bv, 
                    costosDeVentas: element[74], //bw,
                    gastosImpuestos: element[75], //bx,
                    utiladesOperacionales: element[76], //by,
                    utilididadesNetas: element[77], //bz,                        
                    grupoNiif: element[78], //ca,
                    yearDeLosDatos: element[79], //cb,
                    fechaDeLosDatos: element[80], //cc,                    
                    fechaDePagoDeRenta2015: procesarValorEntero(element[120]), //dq),
                    fechaDePagoDeRenta2016: procesarValorEntero(element[12]), //.dr),
                    fechaDePagoDeRenta2017: procesarValorEntero(element[122]), //ds),
                    fechaDePagoDeRenta2018: procesarValorEntero(element[123]), //dt),
                    fechaDePagoDeRenta2019: procesarValorEntero(element[124]), //du),
                    activos2015: procesarValorConDecimales(element[125]), //dv),
                    activos2016: procesarValorConDecimales(element[126]), //dw),
                    activos2017: procesarValorConDecimales(element[127]), //dx),
                    activos2018: procesarValorConDecimales(element[128]), //dy),
                    activos2019: procesarValorConDecimales(element[129]), //dz),        
                    tieneLibros: procesarValorNS(element[131]), //eb),  
                    representanteLegal: procesarValorEntero(element[133]), //ed,
                    NombreDelRepresentanteLegal: element[134], //ee,        
                    numeroIdeDelSuplente: procesarValorEntero(element[139]), //ej),
                    nombreDelSuplente: procesarValorTexto(element[140]), //ek),        
                    autEnv: procesarValorNS(element[145]), //ep)
                });
            }
        }
    }
    //console.log('emptyList ', emptyList);
    //console.log('contadorNoEncontrados ', contadorNoEncontrados);
    //console.log('contadorFiltrados ', contadorFiltrados);
    //console.log('contadorCooperativasYPre ', contadorCooperativasYPre);
    //console.log('contadorEncontrados ', contadorEncontrados);
    //console.log('listaDeNitsNoEncontrados ', listaDeNitsNoEncontrados);
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
            //console.log('aaaaaaaa');
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
    const empresaData = mongoose.model('CaracterizacionManizales', CaracterizacionManizalesSchema, 'CaracterizacionManizales');
    await empresaData.create(data);
}

workSheetsFromFile("C://Users//PC//Documents//BD Camaras de comercio.xlsx")
    .then(response => {
        insertDataInDatabase(response);
        console.log('datos guardados en Caracterizacion ');
    })
    .catch(error => {
        console.error(': ', error);
    })

const insertNitsNotFoundedInDatabase = async (data: any[]) => {
    //console.log('data ', data);
    const empresaData = mongoose.model('NitNoEncontradosManizales', NitSchema, 'NitNoEncontradosManizales');
    await empresaData.create(data);
    //console.log('Nit no encontrados guardados en la colección NitNoEncontrados');
}

import mongoose from 'mongoose';
import xlsx from 'node-xlsx';
import { EmpresaSchema } from './empresaSchema';
import { CaracterizacionLaDoradaSchema } from './caracterizacion-ladorada-schema';
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
    var datosEmpresas: any = [];

    for (let element of workSheet[5].data) {
        counter++;
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 1102) {
            //if (counter >= 3 && counter <= 5) {
            //if (counter == 3) {           
            //console.log('objeto ', objeto);
            var objeto: any = {
                nit: element[3] == undefined ? '' : element[3],
                telefonoComercial1: element[13] == undefined ? '' : element[13],
                emailComercial: element[17] == undefined ? '' : element[17],
                razonSocial: element[2] == undefined ? '' : element[2],
                claGenEsadl: element[25] == undefined ? '' : element[25]
            };
            //console.log('objeto ', objeto); 
            if (objeto.claGenEsadl.indexOf('FONDOS') != -1
                || objeto.claGenEsadl.indexOf('COOPERATIVAS') != -1
                || objeto.razonSocial.indexOf('LIQUIDACION') != -1
                || objeto.razonSocial.indexOf('PRECOOPERATIVAS') != -1) {
                contadorFiltrados++;
                continue;
            }
            const datosEmpresas = await searchInEmpresa(objeto.nit, objeto.telefonoComercial1, objeto.emailComercial);
            // console.log('datosEmpresas ', datosEmpresas);
            if (datosEmpresas == '') {
                //console.log('objeto[nit] ', objeto['nit']);
                //console.log('objeto[nit] !== undefined ', objeto['nit'] !== undefined);
                datosDeLosNoEncontrados.push({
                    nit: objeto['nit'],
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
                var idDeMongo = datosEmpresas[0]._id;
                objeto['idEmpresa'] = idDeMongo;
                emptyList.push({
                    empresa: objeto['idEmpresa'],
                    nit: objeto['nit'],
                    telefonoComercial1: objeto['telefonoComercial1'],
                    emailComercial: objeto['emailComercial'],
                    BaseDeDatosOrigen: element[0], //a,
                    matricula: element[1], //b,
                    razonSocial: element[3], //c,
                    fechaDeMatricula: element[4], //e,
                    fechaDeRenovacion: element[5], //f,
                    ultimoYearDeRenta: element[6], //g,
                    fechaDeConstitucion: element[7], //h,
                    yearsDeFuncionamiento: element[9], //,
                    fechaDeVigencia: element[10], //k,
                    direccionComercial: element[11], //l,
                    numeroComercial: element[12], //m,
                    telefonoComercial2: procesarValorEntero(element[14]), //o),
                    telefonoComercial3: procesarValorEntero(element[15]), //p),
                    vigilancia: procesarValorTexto(element[16]), //q),
                    ciiu1: element[20], //u,
                    ciiu2: procesarValorTexto(element[21]), //v),
                    ciiu3: procesarValorTexto(element[22]), //w),
                    ciiu4: procesarValorTexto(element[23]), //x),
                    actividad: procesarValorTexto(element[24]), //y),
                    claGenEsadl: element[25], //z,
                    claEspecialEsadl: element[26], //aa,
                    claseDeEconomiaSoli: element[27], //ab,
                    beneficioDeLaLey1780MAT: procesarValorNS(element[29]), //ad),
                    cumLey1780Ren: procesarValorNS(element[30]), //ae),
                    manLey1780REN: procesarValorNS(element[31]), //af),
                    renLey1780REN: procesarValorNS(element[32]), //ag),
                    tamanoDeLaEmpresa: procesarValorTexto(element[35]), //aj),
                    personal: element[36], //ak,
                    activoCorriente: procesarValorConDecimales(element[37]), //al,
                    activoNoCorriente: procesarValorConDecimales(element[38]), //am,
                    activoTotal: procesarValorConDecimales(element[42]), //aq,
                    pasivoCorriente: procesarValorConDecimales(element[43]), //ar,
                    pasivoALargoPlazo: procesarValorConDecimales(element[44]), //as,
                    pasivoTotal: procesarValorConDecimales(element[45]), //at,
                    patrimonio: procesarValorConDecimales(element[46]), //au,
                    pasivoMasPatrimonio: procesarValorConDecimales(element[47]), //av,
                    ingresosOperacionales: procesarValorConDecimales(element[48]), //aw,
                    ingresosNoOperacionales: procesarValorConDecimales(element[50]), //ay,
                    gastosNoOperacionales: procesarValorConDecimales(element[51]), //az,
                    costoDeVentas: procesarValorConDecimales(element[52]), //ba,
                    gastosImpuestos: procesarValorConDecimales(element[53]), //bb,
                    utilidadOperacional: procesarValorConDecimales(element[54]), //bc,
                    utilidadNeta: procesarValorConDecimales(element[55]), //bd,
                    grupoNiif: element[56], //be,
                    yearDatos: element[57], //bf,
                    fechaDatos: element[58], //bg,
                    patrimonioEsad: element[59], //bh,
                    porNalPri: element[62], //bk,
                    porNalTot: element[64], //bm,
                    fechaDePagoDeRenta2015: procesarValorEntero(element[87]), //cj),
                    fechaDePagoDeRenta2016: procesarValorEntero(element[88]), //ck),
                    fechaDePagoDeRenta2017: procesarValorEntero(element[89]), //cl),
                    fechaDePagoDeRenta2018: procesarValorEntero(element[90]), //cm),
                    fechaDePagoDeRenta2019: procesarValorEntero(element[91]), //cn),
                    activosDel2015: procesarValorEntero(element[92]), //co),
                    activosDel2016: procesarValorEntero(element[93]), //cp),
                    activosDel2017: procesarValorEntero(element[94]), //cq),
                    activosDel2018: procesarValorEntero(element[95]), //cr),
                    activosDel2019: procesarValorEntero(element[96]), //cs),
                    tieneLibros: procesarValorNS(element[98]), //cu),
                    representanteLegal1: procesarValorEntero(element[100]), //cw,
                    nombreDelRepresentanteLegal1: procesarValorTexto(element[101]), //cx,
                    representanteLegal2: procesarValorEntero(element[102]), //cy),
                    nombreDelRepresentanteLegal2: procesarValorTexto(element[103]), //cz),
                    numeroIdeDelSuplente: procesarValorEntero(element[106]), //dc),
                    nombreDelSuplente: procesarValorTexto(element[107]), //dd),
                    autEnv: procesarValorNS(element[112]), //di)
                });
            }
        }
    }
    //console.log('emptyList ', emptyList);
    //console.log('contadorNoEncontrados ', contadorNoEncontrados);
    //console.log('contadorFiltrados ', contadorFiltrados);
    console.log('contadorEncontrados ', contadorEncontrados);
    //console.log('datos de los no encontrados ', datosDeLosNoEncontrados);

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
    const empresaData = mongoose.model('CaracterizacionLaDorada', CaracterizacionLaDoradaSchema, 'CaracterizacionLaDorada');
    await empresaData.create(data);
}

workSheetsFromFile("C://Users//PC//Documents//BD Camaras de comercio.xlsx")
    .then(response => {
        insertDataInDatabase(response);
        console.log('datos guardados en CaracterizacionLaDorada ');
    })
    .catch(error => {
        console.error(': ', error);
    })

const insertNitsNotFoundedInDatabase = async (data: any[]) => {
    //console.log('data ', data);
    const empresaData = mongoose.model('NitNoEncontradosLaDorada', NitSchema, 'NitNoEncontradosLaDorada');
    await empresaData.create(data);
    //console.log('Nit no encontrados guardados en la colección NitNoEncontrados');
}
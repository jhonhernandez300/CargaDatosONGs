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
    var counter: number = 1;
    var contadorNoEncontrados: number = 0;
    var contadorEncontrados: number = 0;
    var contadorCooperativasYPre: number = 0;
    var indice: number = -1;
    var counterObjeto: number = -1;
    var datosEmpresas: any = [];

    for (let element of workSheet[5].data) {
        counter++;
        counterObjeto++;
        indice++;
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 1102) {
        //if (counter >= 3 && counter <= 5) {
        //if (counter == 3) {
            var objeto: any = { nit: element[3], telefono: element[13], correo: element[17], razonSocial: element[2] };//telefonoComercial1 columna N
            //console.log('objeto ', objeto);               
            const datosEmpresas = await searchInEmpresa(objeto.nit, objeto.telefono, objeto.correo);
            // console.log('datosEmpresas ', datosEmpresas);
            if (datosEmpresas == '') {
                //console.log('objeto[nit] ', objeto['nit']);
                //console.log('objeto[nit] !== undefined ', objeto['nit'] !== undefined);
                if (objeto['nit'] !== undefined) listaDeNitsNoEncontrados.push({ nit: objeto['nit'] });
                contadorNoEncontrados++;                
            } else {
                contadorEncontrados++;
            }
            /*primer registro para hacer pruebas: 9012955431
            3212669977
            digitalmipymes@yahoo.com
            */

            if (datosEmpresas.length > 0) {
                //console.log('dataFromCaracterizacion ', dataFromCaracterizacion);
                //console.log('estaEnLiquidacionOEsPre ', estaEnLiquidacionOEsPre(objeto.razonSocial))
                if (estaEnLiquidacionOEsPre(objeto.razonSocial) == false) {                    
                    var columnasDeExcelConDatos: any = generarObjetoConColumnasDeExcel("C://Users//PC//Documents//BD Camaras de comercio.xlsx", indice);
                    //console.log('columnasDeExcelConDatos ', columnasDeExcelConDatos);
                    var idDeMongo = datosEmpresas[0]._id;
                    objeto['idEmpresa'] = idDeMongo;
                    emptyList.push({
                        empresa: objeto['idEmpresa'],
                        nit: objeto['nit'],
                        telefonoComercial1: objeto['telefono'],
                        emailComercial: objeto['correo'],
                        BaseDeDatosOrigen: columnasDeExcelConDatos.a,
                        matricula: columnasDeExcelConDatos.b,
                        razonSocial: columnasDeExcelConDatos.c,
                        fechaDeMatricula: columnasDeExcelConDatos.e,
                        fechaDeRenovacion: columnasDeExcelConDatos.f,
                        ultimoYearDeRenta: columnasDeExcelConDatos.g,
                        fechaDeConstitucion: columnasDeExcelConDatos.h,
                        yearsDeFuncionamiento: columnasDeExcelConDatos.j,
                        fechaDeVigencia: columnasDeExcelConDatos.k,
                        direccionComercial: columnasDeExcelConDatos.l,
                        numeroComercial: columnasDeExcelConDatos.m,
                        telefonoComercial2: procesarValorNumerico(columnasDeExcelConDatos.o),
                        telefonoComercial3: procesarValorNumerico(columnasDeExcelConDatos.p),
                        vigilancia: procesarValorTexto(columnasDeExcelConDatos.q),
                        ciiu1: columnasDeExcelConDatos.u,
                        ciiu2: procesarValorTexto(columnasDeExcelConDatos.v),
                        ciiu3: procesarValorTexto(columnasDeExcelConDatos.w),
                        ciiu4: procesarValorTexto(columnasDeExcelConDatos.x),
                        actividad: procesarValorTexto(columnasDeExcelConDatos.y),
                        claGenEsadl: columnasDeExcelConDatos.z,
                        claEspecialEsadl: columnasDeExcelConDatos.aa,
                        claseDeEconomiaSoli: columnasDeExcelConDatos.ab,
                        beneficioDeLaLey1780MAT: procesarValorNS(columnasDeExcelConDatos.ad),
                        cumLey1780Ren: procesarValorNS(columnasDeExcelConDatos.ae),
                        manLey1780REN: procesarValorNS(columnasDeExcelConDatos.af),
                        renLey1780REN: procesarValorNS(columnasDeExcelConDatos.ag),
                        tamanoDeLaEmpresa: procesarValorTexto(columnasDeExcelConDatos.aj),
                        personal: columnasDeExcelConDatos.ak,
                        activoCorriente: columnasDeExcelConDatos.al,
                        activoNoCorriente: columnasDeExcelConDatos.am,
                        activoTotal: columnasDeExcelConDatos.aq,
                        pasivoCorriente: columnasDeExcelConDatos.ar,
                        pasivoALargoPlazo: columnasDeExcelConDatos.as,
                        pasivoTotal: columnasDeExcelConDatos.at,
                        patrimonio: columnasDeExcelConDatos.au,
                        pasivoMasPatrimonio: columnasDeExcelConDatos.av,
                        ingresosOperacionales: columnasDeExcelConDatos.aw,
                        ingresosNoOperacionales: columnasDeExcelConDatos.ay,
                        gastosNoOperacionales: columnasDeExcelConDatos.az,
                        costoDeVentas: columnasDeExcelConDatos.ba,
                        gastosImpuestos: columnasDeExcelConDatos.bb,
                        utilidadOperacional: columnasDeExcelConDatos.bc,
                        utilidadNeta: columnasDeExcelConDatos.bd,
                        grupoNiif: columnasDeExcelConDatos.be,
                        yearDatos: columnasDeExcelConDatos.bf,
                        fechaDatos: columnasDeExcelConDatos.bg,
                        patrimonioEsad: columnasDeExcelConDatos.bh,
                        porNalPri: columnasDeExcelConDatos.bk,
                        porNalTot: columnasDeExcelConDatos.bm,
                        fechaDePagoDeRenta2015: procesarValorNumerico(columnasDeExcelConDatos.cj),
                        fechaDePagoDeRenta2016: procesarValorNumerico(columnasDeExcelConDatos.ck),
                        fechaDePagoDeRenta2017: procesarValorNumerico(columnasDeExcelConDatos.cl),
                        fechaDePagoDeRenta2018: procesarValorNumerico(columnasDeExcelConDatos.cm),
                        fechaDePagoDeRenta2019: procesarValorNumerico(columnasDeExcelConDatos.cn),
                        activosDel2015: procesarValorNumerico(columnasDeExcelConDatos.co),
                        activosDel2016: procesarValorNumerico(columnasDeExcelConDatos.cp),
                        activosDel2017: procesarValorNumerico(columnasDeExcelConDatos.cq),
                        activosDel2018: procesarValorNumerico(columnasDeExcelConDatos.cr),
                        activosDel2019: procesarValorNumerico(columnasDeExcelConDatos.cs),
                        tieneLibros: procesarValorNS(columnasDeExcelConDatos.cu),
                        representanteLegal1: columnasDeExcelConDatos.cw,
                        nombreDelRepresentanteLegal1: columnasDeExcelConDatos.cx,
                        representanteLegal2: procesarValorNumerico(columnasDeExcelConDatos.cy),
                        nombreDelRepresentanteLegal2: procesarValorTexto(columnasDeExcelConDatos.cz),
                        numeroIdeDelSuplente: procesarValorNumerico(columnasDeExcelConDatos.dc),
                        nombreDelSuplente: procesarValorTexto(columnasDeExcelConDatos.dd),
                        autEnv: procesarValorNS(columnasDeExcelConDatos.di)
                    });
                }else {
                    contadorCooperativasYPre++;
                }
            }
        }
    }
    //console.log('emptyList ', emptyList);
    console.log('contadorNoEncontrados ', contadorNoEncontrados);
    console.log('contadorCooperativasYPre ', contadorCooperativasYPre);
    console.log('contadorEncontrados ', contadorEncontrados);
    //console.log('listaDeNitsNoEncontrados ', listaDeNitsNoEncontrados);
    await insertNitsNotFoundedInDatabase(listaDeNitsNoEncontrados);
    console.log('datos guardados en NitNoEncontrados ');
    return emptyList;
    //return listaDeNitsNoEncontrados;
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

const procesarValorNS = (valorDeExcel: string) => {
    if (valorDeExcel == 'N') return false;
    if (valorDeExcel == 'S') return true;
    if (valorDeExcel == undefined) return false;
}

const procesarValorTexto = (valorDeExcel: string) => {
    if (valorDeExcel == undefined) {
        return '';
    } else {
        return valorDeExcel;
    }
}

const procesarValorNumerico = (valorDeExcel: string) => {
    if (valorDeExcel == undefined) {
        return 0;
    } else {
        return valorDeExcel;
    }
}

const generarObjetoConColumnasDeExcel = (path: string, indice: number) => {
    const workSheet = xlsx.parse(path);
    let element = workSheet[5].data;
    //console.log('element ', element[indice][0]);
    var objeto: any = {
        a: element[indice][0],
        b: element[indice][1],
        c: element[indice][2],
        e: element[indice][4],
        f: element[indice][5],
        g: element[indice][6],
        h: element[indice][7],
        i: element[indice][8],
        j: element[indice][9],
        k: element[indice][10],
        l: element[indice][11],
        m: element[indice][12],
        n: element[indice][13],
        o: element[indice][14],
        p: element[indice][15],
        q: element[indice][16],
        r: element[indice][17],
        u: element[indice][20],
        v: element[indice][21],
        w: element[indice][22],
        x: element[indice][23],
        y: element[indice][24],
        z: element[indice][25],
        aa: element[indice][26],
        ab: element[indice][27],
        ad: element[indice][29],
        ae: element[indice][30],
        af: element[indice][31],
        ag: element[indice][32],
        aj: element[indice][35],
        ak: element[indice][36],
        al: element[indice][37],
        am: element[indice][38],
        aq: element[indice][42],
        ar: element[indice][43],
        as: element[indice][44],
        at: element[indice][45],
        au: element[indice][46],
        av: element[indice][47],
        aw: element[indice][48],
        ay: element[indice][50],
        az: element[indice][51],
        ba: element[indice][52],
        bb: element[indice][53],
        bc: element[indice][54],
        bd: element[indice][55],
        be: element[indice][56],
        bf: element[indice][57],
        bg: element[indice][58],
        bh: element[indice][59],
        bk: element[indice][62],
        bm: element[indice][64],
        cj: element[indice][87],
        ck: element[indice][88],
        cl: element[indice][89],
        cm: element[indice][90],
        cn: element[indice][91],
        co: element[indice][92],
        cp: element[indice][93],
        cq: element[indice][94],
        cr: element[indice][95],
        cs: element[indice][96],
        ct: element[indice][97],
        cu: element[indice][98],
        cw: element[indice][100],
        cx: element[indice][101],
        cy: element[indice][102],
        cz: element[indice][103],
        dc: element[indice][106],
        dd: element[indice][107],
        de: element[indice][108],
        df: element[indice][109],
        dg: element[indice][110],
        dh: element[indice][111],
        di: element[indice][112]
    };
    //console.log('objeto ', objeto);
    return objeto;
}

const estaEnLiquidacionOEsPre = (data: string) => {    
    var liquidacion = /LIQUIDACION/gi;    
     
    if(data.search(liquidacion) != -1) {
        return true;
    }else {
        return revisarSiEsPre(data);
    }
}

const revisarSiEsPre = (data: string) => {        
    var pre = /PRE-COOPERATIVAS/gi;        
    //console.log(data.search(pre));
    if(data.search(pre) != -1){
        return true;
    } else {
        return false;
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
        console.log('datos guardados en Caracterizacion ');
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
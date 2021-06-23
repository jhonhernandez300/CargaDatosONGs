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
    var counter: number = 1;
    var contadorNoEncontrados: number = 0;
    var contadorEncontrados: number = 0;
    var contadorCooperativasYPre: number = 0;
    var indice: number = -1;
    var counterObjeto: number = -1;
    var datosEmpresas: any = [];

    for (let element of workSheet[6].data) {
        counter++;
        counterObjeto++;
        indice++;
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 96) {
            //if (counter >= 4) { 
            //if (counter == 3) {
            var objeto: any = { yearDeConstitucion: element[20], nit: element[15], telefono: element[27], correo: element[31], razonSocial: element[7] };
            //console.log('objeto ', objeto);   
            const datosEmpresas = await searchInEmpresa(objeto.nit, objeto.telefono, objeto.correo);
            //console.log('datosEmpresas ', datosEmpresas);
            if (datosEmpresas == '') {
                //console.log('objeto[nit] ', objeto['nit']);
                if (objeto['nit'] !== undefined) listaDeNitsNoEncontrados.push({ nit: objeto['nit'] });
                contadorNoEncontrados++;
            } else {
                contadorEncontrados++;
            }

            if (datosEmpresas.length > 0) {
                //console.log('dataFromCaracterizacion ', dataFromCaracterizacion);
                //console.log('element[0] ', element[0])
                if (estaEnLiquidacionOEsPre(objeto.razonSocial) == false) {
                    var columnasDeExcelConDatos: any = generarObjetoConColumnasDeExcel("C://Users//PC//Documents//BD Camaras de comercio.xlsx", indice);
                    //console.log('columnasDeExcelConDatos ', columnasDeExcelConDatos);
                    var idDeMongo = datosEmpresas[0]._id;
                    objeto['idEmpresa'] = idDeMongo;
                    emptyList.push({
                        empresa: objeto['idEmpresa'],
                        yearDeConstitucion: objeto['yearDeConstitucion'],
                        nit: objeto['nit'],
                        telefonoComercial1: objeto['telefono'],
                        emailComercial: objeto['correo'],
                        BaseDeDatosOrigen: columnasDeExcelConDatos.a,
                        matricula: columnasDeExcelConDatos.b,
                        organizacion: columnasDeExcelConDatos.d,
                        categoria: columnasDeExcelConDatos.e,
                        estMatricula: columnasDeExcelConDatos.f,
                        estDatos: columnasDeExcelConDatos.g,
                        razonSocial: columnasDeExcelConDatos.h,
                        fechaDeMatricula: columnasDeExcelConDatos.q,
                        fechaDeRenovacion: columnasDeExcelConDatos.r,
                        ultimoYearDeRenovacion: columnasDeExcelConDatos.s,
                        fechaConstitucion: columnasDeExcelConDatos.u,
                        fechaDeVigencia: columnasDeExcelConDatos.x,
                        direccionComercial: columnasDeExcelConDatos.y,
                        municipioComercial: columnasDeExcelConDatos.aa,
                        telefonoComercial2: columnasDeExcelConDatos.ac,
                        vigilancia: procesarValorTexto(columnasDeExcelConDatos.ae),
                        direccionDeNotificacion: columnasDeExcelConDatos.ai,
                        municipioDeNotificacion: columnasDeExcelConDatos.aj,
                        telefonoDeNotificacion1: columnasDeExcelConDatos.ak,
                        telefonoDeNotificacion2: columnasDeExcelConDatos.al,
                        emailNotificacion: columnasDeExcelConDatos.am,
                        ciiu1: columnasDeExcelConDatos.an,
                        ctrEmbargo: procesarValorNS(columnasDeExcelConDatos.at),
                        ubicacion: columnasDeExcelConDatos.ax,
                        claGenEsadl: columnasDeExcelConDatos.ay,
                        claEspeEsadl: columnasDeExcelConDatos.az,
                        benLey1780Mat: procesarValorNS(columnasDeExcelConDatos.bc),
                        cumLey1780Ren: procesarValorNS(columnasDeExcelConDatos.bd),
                        manLey1780Ren: procesarValorNS(columnasDeExcelConDatos.be),
                        tamañoDeLaEmpresa: procesarValorTexto(columnasDeExcelConDatos.bi),
                        personal: columnasDeExcelConDatos.bj,
                        activoCorriente: columnasDeExcelConDatos.bk,
                        activoTotal: columnasDeExcelConDatos.bp,
                        pasivoCorriente: columnasDeExcelConDatos.bq,
                        pasivoTotal: columnasDeExcelConDatos.bs,
                        patrimonio: columnasDeExcelConDatos.bt,
                        pasivoMasPatrimonio: columnasDeExcelConDatos.bu,
                        ingresosOperacionales: columnasDeExcelConDatos.bv,
                        ingresosNoOperacionales: columnasDeExcelConDatos.bw,
                        gastosOperacionales: columnasDeExcelConDatos.bx,
                        gastosNoOperacionales: columnasDeExcelConDatos.by,
                        costosDeVentas: columnasDeExcelConDatos.bz,
                        gastosDeImpuestos: columnasDeExcelConDatos.ca,
                        utilidadesOperacional: columnasDeExcelConDatos.cb,
                        utilidadesNetas: columnasDeExcelConDatos.cc,
                        grupoNiif: procesarValorTexto(columnasDeExcelConDatos.cd),
                        yearDatos: columnasDeExcelConDatos.ce,
                        fechaDatos: columnasDeExcelConDatos.cf,
                        patrimEsadl: columnasDeExcelConDatos.cr,
                        fechaDePagoDeRenta2015: columnasDeExcelConDatos.dt,
                        fechaDePagoDeRenta2016: columnasDeExcelConDatos.du,
                        fechaDePagoDeRenta2017: columnasDeExcelConDatos.dv,
                        fechaDePagoDeRenta2018: columnasDeExcelConDatos.dw,
                        fechaDePagoDeRenta2019: columnasDeExcelConDatos.dx,
                        acti2015: columnasDeExcelConDatos.dy,
                        acti2016: columnasDeExcelConDatos.dz,
                        acti2017: columnasDeExcelConDatos.ea,
                        acti2018: columnasDeExcelConDatos.eb,
                        acti2019: columnasDeExcelConDatos.ec,
                        tieneLibros: procesarValorNS(columnasDeExcelConDatos.ee),
                        repLegal: columnasDeExcelConDatos.eg,
                        nombreDelRepresentanteLegal: columnasDeExcelConDatos.eh,
                        autEnv: procesarValorNS(columnasDeExcelConDatos.es)
                    });
                } else {
                    contadorCooperativasYPre++;
                }

            }
        }
    }
    //console.log('emptyList ', emptyList);
    console.log('contadorNoEncontrados ', contadorNoEncontrados);
    console.log('contadorCooperativasYPre ', contadorCooperativasYPre);
    console.log('contadorEncontrados ', contadorEncontrados);
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

const searchInCaracterizacion = async (nit: string, telefono: string, correoElectronico: string) => {
    const caracterizacionData = mongoose.model('Caracterizacion', CaracterizacionChinchinaSchema, 'Caracterizacion');
    var data = await caracterizacionData.find({
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

const generarObjetoConColumnasDeExcel = (path: string, indice: number) => {
    const workSheet = xlsx.parse(path);
    let element = workSheet[6].data;
    //console.log('element ', element[indice][0]);
    var objeto: any = {
        a: element[indice][0],
        b: element[indice][1],
        d: element[indice][3],
        e: element[indice][4],
        f: element[indice][5],
        g: element[indice][6],
        h: element[indice][7],
        q: element[indice][16],
        r: element[indice][17],
        s: element[indice][18],
        u: element[indice][20],
        x: element[indice][23],
        y: element[indice][24],
        aa: element[indice][26],
        ac: element[indice][28],
        ae: element[indice][30],
        ai: element[indice][34],
        aj: element[indice][35],
        ak: element[indice][36],
        al: element[indice][37],
        am: element[indice][38],
        an: element[indice][39],
        at: element[indice][45],
        ax: element[indice][49],
        ay: element[indice][50],
        az: element[indice][51],
        bc: element[indice][54],
        bd: element[indice][55],
        be: element[indice][56],
        bi: element[indice][60],
        bj: element[indice][61],
        bk: element[indice][62],
        bp: element[indice][67],
        bq: element[indice][68],
        bs: element[indice][70],
        bt: element[indice][71],
        bu: element[indice][72],
        bv: element[indice][73],
        bw: element[indice][74],
        bx: element[indice][75],
        by: element[indice][76],
        bz: element[indice][77],
        ca: element[indice][79],
        cb: element[indice][79],
        cc: element[indice][80],
        cd: element[indice][81],
        ce: element[indice][82],
        cf: element[indice][83],
        cr: element[indice][95],
        dt: element[indice][123],
        du: element[indice][124],
        dv: element[indice][125],
        dw: element[indice][126],
        dx: element[indice][127],
        dy: element[indice][128],
        dz: element[indice][129],
        ea: element[indice][130],
        eb: element[indice][131],
        ec: element[indice][132],
        ee: element[indice][134],
        eg: element[indice][136],
        eh: element[indice][137],
        em: element[indice][142],
        en: element[indice][142],
        es: element[indice][148]
    };
    //console.log('objeto ', objeto);
    return objeto;
}

const estaEnLiquidacionOEsPre = (data: string) => {
    var liquidacion = /LIQUIDACION/gi;

    if (data.search(liquidacion) != -1) {//No lo encontró == -1 negado, es lo encontró, osea != -1
        return true;
    } else {
        return revisarSiEsPre(data);
    }
}

const revisarSiEsPre = (data: string) => {
    var pre = /PRE-COOPERATIVAS/gi;
    //console.log(data.search(pre));
    if (data.search(pre) != -1) {
        return true;
    } else {
        return false;
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
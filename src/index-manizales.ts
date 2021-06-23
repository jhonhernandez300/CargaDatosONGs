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
    var indice: number = -1;
    var counterObjeto: number = -1;
    var datosEmpresas: any = [];

    for (let element of workSheet[7].data) {
        counter++;
        counterObjeto++;
        indice++;
        //console.log('counter ', counter); 
        if (counter >= 3 && counter <= 1321) {
        //if (counter == 3) {
            var objeto: any = { nit: element[15] == undefined ? '' : element[15], 
                //telefono: element[27] == undefined ? '' : element[27], 
                correo: element[28] == undefined ? '' : element[28], 
                razonSocial: element[7] == undefined ? '' : element[7], 
                claGenEsdl: element[47] == undefined ? '' : element[47]};
            //console.log('objeto ', objeto);   
            if(objeto.claGenEsdl.indexOf('FONDOS') != -1 
                || objeto.claGenEsdl.indexOf('COOPERATIVAS') != -1 
                || objeto.razonSocial.indexOf('LIQUIDACION') != -1){
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

            //if (datosEmpresas.length > 0) {
                //console.log('dataFromCaracterizacion ', dataFromCaracterizacion);
                //console.log('element[0] ', element[0])
            //     if (estaEnLiquidacionOEsPre(objeto.razonSocial) == false) {
            //         var columnasDeExcelConDatos: any = generarObjetoConColumnasDeExcel("C://Users//PC//Documents//BD Camaras de comercio.xlsx", indice);
            //         //console.log('columnasDeExcelConDatos ', columnasDeExcelConDatos);
            //         var idDeMongo = datosEmpresas[0]._id;
            //         objeto['idEmpresa'] = idDeMongo;
            //         emptyList.push({
            //             empresa: objeto['idEmpresa'],
            //             nit: objeto['nit'],
            //             telefonoComercial1: objeto['telefono'],
            //             emailComercial: objeto['correo'],
            //             baseDeDatosOrigen: columnasDeExcelConDatos.a, 
            //             matricula: columnasDeExcelConDatos.b,                    
            //             organizacion: columnasDeExcelConDatos.d, 
            //             categoria: columnasDeExcelConDatos.e,
            //             estMatricula: columnasDeExcelConDatos.f,
            //             estDatos: columnasDeExcelConDatos.g,
            //             razonSocial: columnasDeExcelConDatos.h,                                
            //             claseId: columnasDeExcelConDatos.n,
            //             identificacion: columnasDeExcelConDatos.o,        
            //             fechaDeMatricula: columnasDeExcelConDatos.q,
            //             fechaDeRenovacion: columnasDeExcelConDatos.r,
            //             ultimoYearDeRenta: columnasDeExcelConDatos.s,          
            //             fechaDeConstitucion: columnasDeExcelConDatos.u,                        
            //             fechaDeVigencia: columnasDeExcelConDatos.x,
            //             direccionComercial: columnasDeExcelConDatos.y,
            //             barrioComercial: columnasDeExcelConDatos.z,
            //             MunicipioComercial: columnasDeExcelConDatos.aa,                        
            //             direccionDeNotificacion: columnasDeExcelConDatos.af,
            //             municipioDeNotificacion: columnasDeExcelConDatos.ag,
            //             telefonoDeNotificacion1: procesarValorEntero(columnasDeExcelConDatos.ah),
            //             telefonoDeNotificacion2: procesarValorEntero(columnasDeExcelConDatos.ai),
            //             emailDeNotificacion: columnasDeExcelConDatos.aj,
            //             ciiu1: columnasDeExcelConDatos.ak,
            //             ciiu2: procesarValorTexto(columnasDeExcelConDatos.al),                
            //             librosComercio: procesarValorNS(columnasDeExcelConDatos.ap),
            //             ctrEmbargo: procesarValorNS(columnasDeExcelConDatos.aq),        
            //             ubicacion: columnasDeExcelConDatos.au,
            //             claGenEsadl: procesarValorTexto(columnasDeExcelConDatos.av),
            //             claEspeEsadl: columnasDeExcelConDatos.aw,                                
            //             cumLey1780Ren: procesarValorNS(columnasDeExcelConDatos.ba),
            //             manLey1780Ren: procesarValorNS(columnasDeExcelConDatos.bb),        
            //             TamañoDeLaEmpresa: columnasDeExcelConDatos.bf,
            //             personal: columnasDeExcelConDatos.bg,
            //             activoCorriente: columnasDeExcelConDatos.bh,
            //             activoNoCorriente: columnasDeExcelConDatos.bi,        
            //             activoTotal: columnasDeExcelConDatos.bm,
            //             pasivoCorriente: columnasDeExcelConDatos.bn,
            //             pasivoALargoPlazo: columnasDeExcelConDatos.bo,
            //             PasivoTotal: columnasDeExcelConDatos.bp,
            //             patrimonio: columnasDeExcelConDatos.bq,
            //             pasivoMasPatrimonio: columnasDeExcelConDatos.br,
            //             ingresosOperacionales: columnasDeExcelConDatos.bs,
            //             ingresosNoOperacionales: columnasDeExcelConDatos.bt,
            //             gastosOperacionales: columnasDeExcelConDatos.bu,           
            //             gastosNoOperacionales: columnasDeExcelConDatos.bv, 
            //             costosDeVentas: columnasDeExcelConDatos.bw,
            //             gastosImpuestos: columnasDeExcelConDatos.bx,
            //             utiladesOperacionales: columnasDeExcelConDatos.by,
            //             utilididadesNetas: columnasDeExcelConDatos.bz,                        
            //             grupoNiif: columnasDeExcelConDatos.ca,
            //             yearDeLosDatos: columnasDeExcelConDatos.cb,
            //             fechaDeLosDatos: columnasDeExcelConDatos.cc,                    
            //             fechaDePagoDeRenta2015: procesarValorEntero(columnasDeExcelConDatos.dq),
            //             fechaDePagoDeRenta2016: procesarValorEntero(columnasDeExcelConDatos.dr),
            //             fechaDePagoDeRenta2017: procesarValorEntero(columnasDeExcelConDatos.ds),
            //             fechaDePagoDeRenta2018: procesarValorEntero(columnasDeExcelConDatos.dt),
            //             fechaDePagoDeRenta2019: procesarValorEntero(columnasDeExcelConDatos.du),
            //             activos2015: procesarValorConDecimales(columnasDeExcelConDatos.dv),
            //             activos2016: procesarValorConDecimales(columnasDeExcelConDatos.dw),
            //             activos2017: procesarValorConDecimales(columnasDeExcelConDatos.dx),
            //             activos2018: procesarValorConDecimales(columnasDeExcelConDatos.dy),
            //             activos2019: procesarValorConDecimales(columnasDeExcelConDatos.dz),        
            //             tieneLibros: procesarValorNS(columnasDeExcelConDatos.eb),        
            //             representanteLegal: columnasDeExcelConDatos.ed,
            //             NombreDelRepresentanteLegal: columnasDeExcelConDatos.ee,        
            //             numeroIdeDelSuplente: procesarValorEntero(columnasDeExcelConDatos.ej),
            //             nombreDelSuplente: procesarValorTexto(columnasDeExcelConDatos.ek),        
            //             autEnv: procesarValorNS(columnasDeExcelConDatos.ep)
            //         });
            //     } else {
            //         contadorCooperativasYPre++;
            //     }
            // }
        }
    }
    //console.log('emptyList ', emptyList);
    console.log('contadorNoEncontrados ', contadorNoEncontrados);
    console.log('contadorFiltrados ', contadorFiltrados);
    //console.log('contadorCooperativasYPre ', contadorCooperativasYPre);
    console.log('contadorEncontrados ', contadorEncontrados);
    console.log('listaDeNitsNoEncontrados ', listaDeNitsNoEncontrados);

    //await insertNitsNotFoundedInDatabase(listaDeNitsNoEncontrados);
    //console.log('datos guardados en NitNoEncontrados ');
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

const procesarValorEntero = (valorDeExcel: string) => {
    if (valorDeExcel == undefined) {
        return 0;
    } else {
        return parseInt(valorDeExcel);
    }
}

const procesarValorConDecimales = (valorDeExcel: string) => {
    if (valorDeExcel == undefined) {
        return 0.0;
    } else {
        return parseFloat(valorDeExcel);
    }
}

const generarObjetoConColumnasDeExcel = (path: string, indice: number) => {
    const workSheet = xlsx.parse(path);
    let element = workSheet[7].data;
    //console.log('element ', columnasDeExcelConDatos0]);
    var objeto: any = {
        a: element[indice][0], 
        b: element[indice][1],        
        d: element[indice][3], 
        e: element[indice][4],
        f: element[indice][5],
        g: element[indice][6],
        h: element[indice][7],                                
        n: element[indice][13],
        o: element[indice][14],
        p: element[indice][15],
        q: element[indice][16],
        r: element[indice][17],
        s: element[indice][18],                    
        u: element[indice][20],                        
        x: element[indice][23],
        y: element[indice][24],
        z: element[indice][25],
        aa: element[indice][26],
        ab: element[indice][27],
        ac: element[indice][28],        
        af: element[indice][31],
        ag: element[indice][32],
        ah: element[indice][33],
        ai: element[indice][34],
        aj: element[indice][35],
        ak: element[indice][36],
        al: element[indice][37],                
        ap: element[indice][41],
        aq: element[indice][42],        
        au: element[indice][46],
        av: element[indice][47],
        aw: element[indice][48],        
        az: element[indice][51],
        ba: element[indice][52],
        bb: element[indice][53],        
        bf: element[indice][57],
        bg: element[indice][58],
        bh: element[indice][59],
        bi: element[indice][60],        
        bm: element[indice][64],
        bn: element[indice][65],
        bo: element[indice][66],
        bp: element[indice][67],
        bq: element[indice][68],
        br: element[indice][69],
        bs: element[indice][70],
        bt: element[indice][71],
        bu: element[indice][72],           
        bv: element[indice][73], 
        bw: element[indice][74],
        bx: element[indice][75],
        by: element[indice][76],
        bz: element[indice][77],                        
        ca: element[indice][78],
        cb: element[indice][79],
        cc: element[indice][80],                    
        dq: element[indice][120],
        dr: element[indice][121],
        ds: element[indice][122],
        dt: element[indice][123],
        du: element[indice][124],
        dv: element[indice][125],
        dw: element[indice][126],
        dx: element[indice][127],
        dy: element[indice][128],
        dz: element[indice][129],        
        eb: element[indice][131],        
        ed: element[indice][133],
        ee: element[indice][134],        
        ej: element[indice][139],
        ek: element[indice][140],        
        ep: element[indice][145]
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
    var pre = /PRECOOPERATIVAS/gi;
    //console.log(data.search(pre));
    if (data.search(pre) != -1) {
        return true;
    } else {
        return false;
    }
}

connect('mongodb://localhost/Ongs');

const insertDataInDatabase = async (data: any[]) => {
    const empresaData = mongoose.model('CaracterizacionManizales', CaracterizacionManizalesSchema, 'CaracterizacionManizales');
    await empresaData.create(data);
}

workSheetsFromFile("C://Users//PC//Documents//BD Camaras de comercio.xlsx")
    .then(response => {
        //insertDataInDatabase(response);
        //console.log('datos guardados en Caracterizacion ');
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
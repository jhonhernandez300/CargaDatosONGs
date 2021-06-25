import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import { ICaracterizacion } from './icaracterizacion';
import { INit } from './init';
import { EmpresaSchema } from './empresaSchema';
import { NitSchema } from './nit-schema';
import { CaracterizacionSchema } from './caracterizacion-schema';
import  fs from 'fs';


const workSheetsFromFile = async (path: string) => {
    const workSheet = xlsx.parse(path);
    var emptyList: any = [];
    var listaDeNitsNoEncontrados: any = [];
    var datosDeLosNoEncontrados: any = [];
    var counter: number = 11;
    var contadorNoEncontrados: number = 0;
    var contadorEncontrados: number = 0;
    var contadorCooperativasYPre: number = 0;
    var contadorFiltrados: number = 0;
    var counterObjeto: number = -1;
    var datosEmpresas: any = [];

    for (let element of workSheet[0].data) {
        counter++;
        counterObjeto++;
        //console.log('counter ', counter); 
        if (counter >= 22 && counter <= 154) {
        //if (counter == 24) {
            var objeto: any = {
                yearDeConstitucion: element[3] == undefined ? '' : element[3],
                nit: element[2] == undefined ? '' : element[2],
                telefono: element[11] == undefined ? '' : element[11],
                correoElectronico: element[12] == undefined ? '' : element[12],
                razonSocial: element[1] == undefined ? '' : quitarTildes(element[1]),
                numero: element[0] == undefined ? 0 : element[0]
            };
            //console.log('objeto ', objeto);   
            if (objeto.razonSocial.indexOf('FONDOS') != -1
                || objeto.razonSocial.indexOf('COOPERATIVAS') != -1
                || objeto.razonSocial.indexOf('LIQUIDACION') != -1
                || objeto.razonSocial.indexOf('PRECOOPERATIVAS') != -1) {
                contadorFiltrados++;
                continue;
            }
            const datosEmpresas = await readCollection(objeto.nit, objeto.telefono, objeto.correoElectronico);
            //var objeto: any = { yearDeConstitucion: '10', nit: '10', telefono: '0', correo: '0' };
            //const datosEmpresas = await readCollection(objeto.nit, objeto.telefono, objeto.correo);
            //console.log('datosEmpresas ', datosEmpresas);
            //console.log(quitarTildes('CASÁ'));

            if (datosEmpresas == '') {
                datosDeLosNoEncontrados.push({
                    nit: objeto['nit'],
                    correoElectronico: objeto['correoElectronico'],
                    telefono: objeto['telefono'],                    
                    razonSocial: quitarTildes(objeto['razonSocial']),
                    claGenEsadl: objeto['claGenEsadl'],
                    numero: objeto['numero']
                });
                contadorNoEncontrados++;
            } else {
                contadorEncontrados++;
            }
            //console.log('datosEmpresas ', datosEmpresas); 
            //console.log('datosEmpresas.length ', datosEmpresas.length); 
            //console.log('element.length ', element.length); 

            // if (datosEmpresas.length > 0) {
            //     var idDeMongo = datosEmpresas[0]._id;
            //     objeto['idEmpresa'] = idDeMongo;
            //     emptyList.push({
            //         empresa: objeto['idEmpresa'],
            //         yearDeConstitucion: objeto['yearDeConstitucion'],
            //         nit: objeto['nit'],
            //         telefono: objeto['telefono'],
            //         correoElectronico: objeto['correoElectronico'],
            //         InstitucionQueExpidePersoneriaJuridica: procesarValorTexto(element[7]),
            //         totalDeIngresosDeLaOrganizacionEnElUltimoYear2018: element[49],
            //         TerritorioDeActividad: procesarValorTexto(element[58]),
            //         NumeroTotalDeEmpleadosConContratoLaboral: procesarValorEntero(element[55]),
            //         NumeroTotalDeVoluntariosEnLaOrganizacion: procesarValorEntero(element[56]),
            //         NumeroTotalDePracticantesEnLaOrganizacion: procesarValorEntero(element[57]),
            //         PorcentajeDeFinanciacionPorRecursosPropios: procesarValorConDecimales(element[60]),
            //         laOrganizacionTieneRedesOMedios: revisarOpcionesTienRedesOMedios(element[13], element[14], element[15]),
            //         queRedesOMediosManejaLaOrganizacion: revisarOpcionesQueRedes(element[16], element[17], element[18], element[19]),
            //         territorioDeCobertura: revisarOpcionesTerritorio(element[21], element[22], element[23], element[24]),
            //         queOdsDesarrollaLaOrganizacion: revisarOpcionesOds(element[26], element[27], element[28], element[29],
            //             element[30], element[31], element[32], element[33],
            //             element[34], element[35], element[36], element[37],
            //             element[38], element[39], element[40], element[41],
            //             element[42]),
            //         poblacionObjetivoDeLaOrganizacion: revisarOpcionesPoblacion(element[43], element[44], element[45], element[46], element[47]),
            //         fuentesDeFinanciacionDeLaOrganizacion: revisarOpcionesFuentes(element[50], element[51], element[52], element[53], element[54])
            //     });
            // }
        }
    }
    //console.log('emptyList ', emptyList);
    // console.log('contadorEncontrados ', contadorEncontrados);
    // console.log('contadorFiltrados ', contadorFiltrados);
    // console.log('contadorNoEncontrados ', contadorNoEncontrados);    
    // console.log('datosDeLosNoEncontrados ', datosDeLosNoEncontrados);
    
    fs.writeFile('C:\\Users\\PC\\Documents\\empresasNoEncontradas.json', JSON.stringify(datosDeLosNoEncontrados), (error) => {
        if(error){
            console.log('Error', error);
            return;
        }
        console.log('Archivo grabado');
    });
    //await insertNitsNofFoundedInDatabase(listaDeNitsNoEncontrados);
    return emptyList;
    //return listaDeNitsNoEncontrados;
};

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

const revisarOpcionesFuentes = (datoDeExcel50: any, datoDeExcel51: any, datoDeExcel52: any, datoDeExcel53: any, datoDeExcel54: any) => {
    //console.log('datos De Excel ', datoDeExcel43, datoDeExcel47);
    let vector: String[] = [];
    let posicion: number = 0;

    if (datoDeExcel50 == 'X' || datoDeExcel50 == undefined) { //Puede venir con X o vacío (undefined)
        if (opcionMarcada(datoDeExcel50) == 'Si') {
            vector[posicion] = 'Recursos propios';
            posicion++;
        }
        if (opcionMarcada(datoDeExcel51) == 'Si') {
            vector[posicion] = 'Sector público';
            posicion++;
        }
        if (opcionMarcada(datoDeExcel52) == 'Si') {
            vector[posicion] = 'Sector privado';
            posicion++;
        }
        if (opcionMarcada(datoDeExcel53) == 'Si') {
            vector[posicion] = 'Cooperación internacional';
            posicion++;
        }
        if (opcionMarcada(datoDeExcel54) == 'Si') {
            vector[posicion] = 'Donación';
            posicion++;
        }
    }

    return vector;
}

const revisarOpcionesPoblacion = (datoDeExcel43: any, datoDeExcel44: any, datoDeExcel45: any, datoDeExcel46: any, datoDeExcel47: any) => {
    //console.log('datos De Excel ', datoDeExcel43, datoDeExcel47);
    let vector: String[] = [];
    let posicion: number = 0;

    if (opcionMarcada(datoDeExcel43) == 'Si') {
        vector[posicion] = 'Niños(as)';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel44) == 'Si') {
        vector[posicion] = 'Adolescente';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel45) == 'Si') {
        vector[posicion] = 'Jóvenes';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel46) == 'Si') {
        vector[posicion] = 'Adulto';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel47) == 'Si') {
        vector[posicion] = 'Adulto Mayor';
        posicion++;
    }
    return vector;
}

const revisarOpcionesOds = (datoDeExcel26: any, datoDeExcel27: any, datoDeExcel28: any, datoDeExcel29: any,
    datoDeExcel30: any, datoDeExcel31: any, datoDeExcel32: any, datoDeExcel33: any,
    datoDeExcel34: any, datoDeExcel35: any, datoDeExcel36: any, datoDeExcel37: any,
    datoDeExcel38: any, datoDeExcel39: any, datoDeExcel40: any, datoDeExcel41: any,
    datoDeExcel42: any) => {
    //console.log('datos De Excel ', datoDeExcel26, datoDeExcel42);
    let vector: String[] = [];
    let posicion: number = 0;

    //No tiene else porque los tiene que revisar todos
    if (opcionMarcada(datoDeExcel26) == 'Si') {
        vector[posicion] = 'Fin de la pobreza';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel26) == 'Si') {
        vector[posicion] = 'Fin de la pobreza';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel27) == 'Si') {
        vector[posicion] = 'Hambre cero';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel28) == 'Si') {
        vector[posicion] = 'Salud y bienestar';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel29) == 'Si') {
        vector[posicion] = 'Educación de calidad';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel30) == 'Si') {
        vector[posicion] = 'Igualdad de género';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel31) == 'Si') {
        vector[posicion] = 'Agua limpia y saneamiento';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel32) == 'Si') {
        vector[posicion] = 'Energía asequible y no contaminante';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel33) == 'Si') {
        vector[posicion] = 'Trabajo decente y crecimiento económico';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel34) == 'Si') {
        vector[posicion] = 'Industria, innovación e infraestructura';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel35) == 'Si') {
        vector[posicion] = 'Reducción de las desigualdades';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel36) == 'Si') {
        vector[posicion] = 'Ciudades y comunidades sostenibles';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel37) == 'Si') {
        vector[posicion] = 'Producción y consumo responsable';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel38) == 'Si') {
        vector[posicion] = 'Acción por el clima';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel39) == 'Si') {
        vector[posicion] = 'Vida submarina';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel40) == 'Si') {
        vector[posicion] = 'Vida de ecosistemas terrestres';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel41) == 'Si') {
        vector[posicion] = 'Paz, justicia e instituciones sólidas';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel42) == 'Si') {
        vector[posicion] = 'Alianzas para lograr los objetivos';
        posicion++;
    }
    return vector;
}

const revisarOpcionesTerritorio = (datoDeExcel21: any, datoDeExcel22: any, datoDeExcel23: any, datoDeExcel24: any) => {
    //console.log('datos De Excel ', datoDeExcel21, datoDeExcel22, datoDeExcel23, datoDeExcel24);
    let vector: String[] = [];
    let posicion: number = 0;

    if (opcionMarcada(datoDeExcel21) == 'Si') {
        vector[0] = 'Local';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel22) == 'Si') {
        vector[1] = 'Regional';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel23) == 'Si') {
        vector[2] = 'Nacional';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel24) == 'Si') {
        vector[3] = 'Internacional';
        posicion++;
    }
    return vector;
}

const revisarOpcionesTienRedesOMedios = (datoDeExcel13: any, datoDeExcel14: any, datoDeExcel15: any) => {
    //console.log('datos De Excel ', datoDeExcel13, datoDeExcel14, datoDeExcel15);
    if (opcionMarcada(datoDeExcel13) == 'Si') return 'Sí';

    if (opcionMarcada(datoDeExcel14) == 'Si') {
        return 'No';
    } else {
        return 'No Registra';
    }
}

const revisarOpcionesQueRedes = (datoDeExcel16: any, datoDeExcel17: any, datoDeExcel18: any, datoDeExcel19: any) => {
    //console.log('datos De Excel ', datoDeExcel16, datoDeExcel17, datoDeExcel18, datoDeExcel19);
    if (opcionMarcada(datoDeExcel16) == 'Si') return 'Facebook';
    if (opcionMarcada(datoDeExcel17) == 'Si') return 'Instagram';

    if (opcionMarcada(datoDeExcel18) == 'Si') {
        return 'Twitter';
    } else {
        return 'Página web';
    }
}

const opcionMarcada = (datoDeExcel: any) => {
    //console.log('datoDeExcel == X ', datoDeExcel == 'X');
    if (datoDeExcel == 'X') return 'Si';
    return 'No';
}

const readCollection = async (nit: string, telefono: string, correoElectronico: string) => {
    const empresaData = mongoose.model('Empresa', EmpresaSchema, 'Empresa');
    var data = await empresaData.find({
        $or: [{ nit }, { telefono }, { correoElectronico }]
    });
    //console.table(data);
    //console.log('datos de mongo', data);
    return data;
}

const insertDataInDatabase = async (data: any[]) => {
    const empresaData = mongoose.model('Caracterizacion', CaracterizacionSchema, 'Caracterizacion');
    await empresaData.create(data);
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

workSheetsFromFile("C://Users//PC//Documents//2019_12_19_Caracterización detallada (2).xlsx")
    .then(response => {
        //insertDataInDatabase(response);
        //insertNitsNofFoundedInDatabase(response)
        //console.log('datos guardados en Caracterizacion ');
    })
    .catch(error => {
        console.error(': ', error);
    })

const insertNitsNofFoundedInDatabase = async (data: any[]) => {
    //console.log('data ', data);
    const empresaData = mongoose.model('NitNoEncontrados', NitSchema, 'NitNoEncontrados');
    await empresaData.create(data);
    console.log('Nit no encontrados guardados en la colección NitNoEncontrados');
}








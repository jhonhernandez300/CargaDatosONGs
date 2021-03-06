import xlsx from 'node-xlsx';
import mongoose from 'mongoose';
import { ICaracterizacion } from './icaracterizacion';
import { INit } from './init';
import { EmpresaSchema } from './empresaSchema';
import { NitSchema } from './nit-schema';
import { CaracterizacionSchema } from './caracterizacion-schema';
import  fs from 'fs';
import { Types } from 'mongoose';


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
        //if (counter == 22) {
        //if (counter == 62) {
            var objeto: any = {
                yearDeConstitucion: element[4] == undefined ? '' : element[4],
                nit: element[3],
                razonSocial: element[2],                
                direccion: element[11],
                telefono: element[12] == undefined ? '' : element[12],
                correoElectronico: element[13] == undefined ? '' : element[13],                                
                institucionQueExpidePersoneriaJuridica: procesarValorTexto(element[8])
            };
            //console.log('objeto ', objeto);   
            if (objeto.razonSocial.indexOf('FONDOS') != -1
                || objeto.razonSocial.indexOf('COOPERATIVAS') != -1
                || objeto.razonSocial.indexOf('LIQUIDACION') != -1
                || objeto.razonSocial.indexOf('PRECOOPERATIVAS') != -1) {
                contadorFiltrados++;
                continue;
            }
            const datosEmpresas = await readCollection(objeto.nit, objeto.telefono, objeto.correoElectronico, objeto.razonSocial);
            //var objeto: any = { yearDeConstitucion: '10', nit: '10', telefono: '0', correo: '0' };
            //const datosEmpresas = await readCollection(objeto.nit, objeto.telefono, objeto.correo);
            //console.log('datosEmpresas ', datosEmpresas);
            //console.log(quitarTildes('CAS??'));
            /*function toTitleCase(str) {
            return str.replace(/\S+/g, str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
            }
            */

            if (datosEmpresas == '') {
                datosDeLosNoEncontrados.push({          
                    razonSocial: objeto['razonSocial'],
                    nit: objeto['nit'],
                    estaEliminado: false,
                    idCohorte: Types.ObjectId('5fe205a6d068363fda940a0b'),
                    correoElectronico: objeto['correoElectronico'],
                    telefono: objeto['telefono'],                                        
                    yearDeConstitucion: objeto['yearDeConstitucion'],  
                    representanteLegalOLiderDeLaOrganizacion: element[6],    
                    direccion: element[11],  
                    generoDelRepresentanteLegal: element[7],            
                    InstitucionQueExpidePersoneriaJuridica: procesarValorTexto(element[8]),                                      
                    laOrganizacionTieneRedesOMedios: revisarOpcionesTienRedesOMedios(element[14], element[15], element[16]),
                    queRedesOMediosManejaLaOrganizacion: revisarOpcionesQueRedes(element[17], element[18], element[19], element[20]),
                    tipologiaDeLaOrganizacion: element[21],
                    territorioDeCobertura: revisarOpcionesTerritorio(element[22], element[23], element[24], element[25]),
                    sector: element[26],
                    queOdsDesarrollaLaOrganizacion: revisarOpcionesOds(element[27], element[28], element[29], element[30],
                        element[31], element[32], element[33], element[34],
                        element[35], element[36], element[37], element[38],
                        element[39], element[40], element[41], element[42],
                        element[43]),
                    poblacionObjetivoDeLaOrganizacion: revisarOpcionesPoblacion(element[44], element[45], element[46], element[47], element[48]),
                    comunidadesEnQueDesarrollaPrincipalmenteSuTrabajo: element[49],
                    totalDeIngresosDeLaOrganizacionEnElYear2018: element[50],                    
                    fuentesDeFinanciacionDeLaOrganizacion: revisarOpcionesFuentes(element[51], element[52], element[53], element[54], element[55]),
                    NumeroTotalDeEmpleadosConContratoLaboral: procesarValorEntero(element[56]),
                    NumeroTotalDeVoluntariosEnLaOrganizacion: procesarValorEntero(element[57]),
                    NumeroTotalDePracticantesEnLaOrganizacion: procesarValorEntero(element[58]),
                    territorioDeActividad: element[59],
                    numeroTotalDeEmpleadosConContratoDePrestacionDeServicios: element[60],
                    porcentajeDeFinanciacionPorRecursosPropios: element[61],
                    porcentajeDeFinanciacionPorRecursosPublicos: element[62],
                    porcentajeDeFinanciacionPorRecursosPrivados: element[63],
                    porcentajeDeFinanciacionPorDonaciones: element[64],
                    porcentajeDeFinanciacionPorCooperacionInternacional: element[65] == undefined ? '' : element[65]
                });
                contadorNoEncontrados++;
            } else {
                contadorEncontrados++;
            }
            //console.log('datosEmpresas ', datosEmpresas); 
            //console.log('datosEmpresas.length ', datosEmpresas.length); 
            //console.log('element.length ', element.length); 

            if (datosEmpresas.length > 0) {
                var idDeMongo = datosEmpresas[0]._id;
                objeto['idEmpresa'] = idDeMongo;
                emptyList.push({                                                       
                    idNegocio: Types.ObjectId(objeto['idEmpresa']),
                    estaEliminado: false,
                    idCohorte: Types.ObjectId('5fe205a6d068363fda940a0b'),
                    correoElectronico: objeto['correoElectronico'],
                    telefono: objeto['telefono'],                                        
                    yearDeConstitucion: objeto['yearDeConstitucion'],  
                    representanteLegalOLiderDeLaOrganizacion: element[6],    
                    direccion: element[11],  
                    generoDelRepresentanteLegal: element[7],            
                    InstitucionQueExpidePersoneriaJuridica: procesarValorTexto(element[8]),                                      
                    laOrganizacionTieneRedesOMedios: revisarOpcionesTienRedesOMedios(element[14], element[15], element[16]),
                    queRedesOMediosManejaLaOrganizacion: revisarOpcionesQueRedes(element[17], element[18], element[19], element[20]),
                    tipologiaDeLaOrganizacion: element[21],
                    territorioDeCobertura: revisarOpcionesTerritorio(element[22], element[23], element[24], element[25]),
                    sector: element[26],
                    queOdsDesarrollaLaOrganizacion: revisarOpcionesOds(element[27], element[28], element[29], element[30],
                        element[31], element[32], element[33], element[34],
                        element[35], element[36], element[37], element[38],
                        element[39], element[40], element[41], element[42],
                        element[43]),
                    poblacionObjetivoDeLaOrganizacion: revisarOpcionesPoblacion(element[44], element[45], element[46], element[47], element[48]),
                    comunidadesEnQueDesarrollaPrincipalmenteSuTrabajo: element[49],
                    totalDeIngresosDeLaOrganizacionEnElYear2018: element[50],                    
                    fuentesDeFinanciacionDeLaOrganizacion: revisarOpcionesFuentes(element[51], element[52], element[53], element[54], element[55]),
                    NumeroTotalDeEmpleadosConContratoLaboral: procesarValorEntero(element[56]),
                    NumeroTotalDeVoluntariosEnLaOrganizacion: procesarValorEntero(element[57]),
                    NumeroTotalDePracticantesEnLaOrganizacion: procesarValorEntero(element[58]),
                    territorioDeActividad: element[59],
                    numeroTotalDeEmpleadosConContratoDePrestacionDeServicios: element[60],
                    porcentajeDeFinanciacionPorRecursosPropios: element[61],
                    porcentajeDeFinanciacionPorRecursosPublicos: element[62],
                    porcentajeDeFinanciacionPorRecursosPrivados: element[63],
                    porcentajeDeFinanciacionPorDonaciones: element[64],
                    porcentajeDeFinanciacionPorCooperacionInternacional: element[65] == undefined ? '' : element[65]
                });
            }
        }
    }
    //console.log('emptyList ', emptyList);
    // console.log('contadorEncontrados ', contadorEncontrados);
    // console.log('contadorFiltrados ', contadorFiltrados);
    // console.log('contadorNoEncontrados ', contadorNoEncontrados);    
    // console.log('datosDeLosNoEncontrados ', datosDeLosNoEncontrados);
    
    // fs.writeFile('C:\\Users\\PC\\Documents\\empresasNoEncontradas.json', JSON.stringify(datosDeLosNoEncontrados), 'utf8', (error) => {
    //     if(error){
    //         console.log('Error', error);
    //         return;
    //     }
    //     console.log('Archivo grabado');
    // });
    //await insertNitsNofFoundedInDatabase(listaDeNitsNoEncontrados);
    return emptyList;
    //return listaDeNitsNoEncontrados;
};

const quitarTildes = (dato: any) => {
    if(dato.indexOf('??') != -1){
        dato = dato.replace('??', 'A');
    }

    if(dato.indexOf('??') != -1){
        dato = dato.replace('??', 'E');
    }

    if(dato.indexOf('??') != -1){
        dato = dato.replace('??', 'I');
    }
    if(dato.indexOf('??') != -1){
        dato = dato.replace('??', 'O');
    }
    if(dato.indexOf('??') != -1){
        dato = dato.replace('??', 'U');
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

    if (datoDeExcel50 == 'X' || datoDeExcel50 == undefined) { //Puede venir con X o vac??o (undefined)
        if (opcionMarcada(datoDeExcel50) == 'Si') {
            vector[posicion] = 'Recursos propios';
            posicion++;
        }
        if (opcionMarcada(datoDeExcel51) == 'Si') {
            vector[posicion] = 'Sector p??blico';
            posicion++;
        }
        if (opcionMarcada(datoDeExcel52) == 'Si') {
            vector[posicion] = 'Sector privado';
            posicion++;
        }
        if (opcionMarcada(datoDeExcel53) == 'Si') {
            vector[posicion] = 'Cooperaci??n internacional';
            posicion++;
        }
        if (opcionMarcada(datoDeExcel54) == 'Si') {
            vector[posicion] = 'Donaci??n';
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
        vector[posicion] = 'Ni??os(as)';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel44) == 'Si') {
        vector[posicion] = 'Adolescente';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel45) == 'Si') {
        vector[posicion] = 'J??venes';
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
    if (opcionMarcada(datoDeExcel27) == 'Si') {
        vector[posicion] = 'Hambre cero';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel28) == 'Si') {
        vector[posicion] = 'Salud y bienestar';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel29) == 'Si') {
        vector[posicion] = 'Educaci??n de calidad';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel30) == 'Si') {
        vector[posicion] = 'Igualdad de g??nero';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel31) == 'Si') {
        vector[posicion] = 'Agua limpia y saneamiento';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel32) == 'Si') {
        vector[posicion] = 'Energ??a asequible y no contaminante';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel33) == 'Si') {
        vector[posicion] = 'Trabajo decente y crecimiento econ??mico';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel34) == 'Si') {
        vector[posicion] = 'Industria, innovaci??n e infraestructura';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel35) == 'Si') {
        vector[posicion] = 'Reducci??n de las desigualdades';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel36) == 'Si') {
        vector[posicion] = 'Ciudades y comunidades sostenibles';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel37) == 'Si') {
        vector[posicion] = 'Producci??n y consumo responsable';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel38) == 'Si') {
        vector[posicion] = 'Acci??n por el clima';
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
        vector[posicion] = 'Paz, justicia e instituciones s??lidas';
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
        vector[posicion] = 'Local';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel22) == 'Si') {
        vector[posicion] = 'Regional';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel23) == 'Si') {
        vector[posicion] = 'Nacional';
        posicion++;
    }
    if (opcionMarcada(datoDeExcel24) == 'Si') {
        vector[posicion] = 'Internacional';
        posicion++;
    }
    return vector;
}

const revisarOpcionesTienRedesOMedios = (datoDeExcel13: any, datoDeExcel14: any, datoDeExcel15: any) => {
    //console.log('datos De Excel ', datoDeExcel13, datoDeExcel14, datoDeExcel15);
    if (opcionMarcada(datoDeExcel13) == 'Si') return 'S??';

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
        return 'P??gina web';
    }
}

const opcionMarcada = (datoDeExcel: any) => {
    //console.log('datoDeExcel == X ', datoDeExcel == 'X');
    if (datoDeExcel == 'X') return 'Si';
    return 'No';
}

const readCollection = async (nit: string, telefono: string, correoElectronico: string, razonSocial: string) => {
    const empresaData = mongoose.model('Empresa', EmpresaSchema, 'Empresa');
    var data = await empresaData.find({
        $or: [{ nit }, { telefono }, { correoElectronico }, { razonSocial }]
    });
    //console.table(data);
    //console.log('datos de mongo', data);
    return data;
}


const estaEnLiquidacionOEsPre = (data: string) => {
    var liquidacion = /LIQUIDACION/gi;

    if (data.search(liquidacion) != -1) {//No lo encontr?? == -1 negado, es lo encontr??, osea != -1
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
    const empresaData = mongoose.model('Caracterizacion', CaracterizacionSchema, 'Caracterizacion');
    await empresaData.create(data);
}

workSheetsFromFile("C://Users//PC//Documents//2019_12_19_Caracterizaci??n detallada (2).xlsx")
    .then(response => {
        insertDataInDatabase(response);
        console.log('***************           Datos guardados       *************************** ');
        //insertNitsNofFoundedInDatabase(response)        
    })
    .catch(error => {
        console.error(': ', error);
    })

const insertNitsNofFoundedInDatabase = async (data: any[]) => {
    //console.log('data ', data);
    const empresaData = mongoose.model('NitNoEncontrados', NitSchema, 'NitNoEncontrados');
    await empresaData.create(data);
    console.log('Nit no encontrados guardados en la colecci??n NitNoEncontrados');
}








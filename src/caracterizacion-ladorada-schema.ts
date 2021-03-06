import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CaracterizacionLaDoradaSchema = new Schema({        
    nit: {type: String},
    empresa: {type: String},        
    telefonoComercial1: {type: String},
    emailComercial: {type: String},        
    BaseDeDatosOrigen: {type: String},                                        
    matricula: {type: String},
    razonSocial: {type: String},                     
    fechaDeMatricula: {type: Number},
    fechaDeRenovacion: {type: Number},
    ultimoYearDeRenta: {type: Number},
    fechaDeConstitucion: {type: Number},                                            
    yearsDeFuncionamiento: {type: Number},
    fechaDeVigencia: {type: Number},
    direccionComercial: {type: String},
    numeroComercial: {type: String},                    
    telefonoComercial2: {type: Number},
    telefonoComercial3: {type: String},
    vigilancia: {type: String},                    
    ciiu1: {type: String},                        
    ciiu2: {type: String},
    ciiu3: {type: String},  
    ciiu4: {type: String},
    actividad: {type: String},
    claGenEsadl: {type: String},
    claEspecialEsadl: {type: String},
    claseDeEconomiaSoli: {type: String},        
    beneficioDeLaLey1780MAT: {type: Boolean},
    cumLey1780Ren: {type: Boolean},
    manLey1780REN: {type: Boolean},
    renLey1780REN: {type: Boolean},        
    tamanoDeLaEmpresa: {type: String},
    personal: {type: Number},
    activoCorriente: {type: Number},
    activoNoCorriente: {type: Number},                
    activoTotal: {type: Number},
    pasivoCorriente: {type: Number},
    pasivoALargoPlazo: {type: Number},
    pasivoTotal: {type: Number},
    patrimonio: {type: Number},
    pasivoMasPatrimonio: {type: Number},
    ingresosOperacionales: {type: Number},        
    ingresosNoOperacionales: {type: Number},
    gastosNoOperacionales: {type: Number},
    costoDeVentas: {type: Number},
    gastosImpuestos: {type: Number},
    utilidadOperacional: {type: Number},
    utilidadNeta: {type: Number},
    grupoNiif: {type: String},
    yearDatos: {type: Number},
    fechaDatos: {type: Number},
    patrimonioEsad: {type: Number},        
    porNalPri: {type: Number},        
    porNalTot: {type: Number},                
    fechaDePagoDeRenta2015: {type: Number},
    fechaDePagoDeRenta2016: {type: Number},
    fechaDePagoDeRenta2017: {type: Number},
    fechaDePagoDeRenta2018: {type: Number},
    fechaDePagoDeRenta2019: {type: Number},
    activosDel2015: {type: Number},
    activosDel2016: {type: Number},
    activosDel2017: {type: Number},
    activosDel2018: {type: Number},
    activosDel2019: {type: Number},                    
    tieneLibros: {type: Boolean},        
    representanteLegal1: {type: Number},
    nombreDelRepresentanteLegal1: {type: String},
    representanteLegal2: {type: Number},
    nombreDelRepresentanteLegal2: {type: String},        
    numeroIdeDelSuplente: {type: Number},
    nombreDelSuplente: {type: String},
    autEnv: {type: Boolean}
});
export const quitarTildes = (dato: any) => {
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
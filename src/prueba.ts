const estaEnLiquidacionOEsPre = (data: string) => {    
    var liquidacion = /LIQUIDACION/gi;    
     
    if(data.search(liquidacion) != -1) {
        return true;
    }else {
        return revisarSiEsPre(data);
    }
}

const revisarSiEsPre = (data: string) => {        
    var pre = /PRE/gi;        
    //console.log(data.search(pre));
    if(data.search(pre) != -1){
        return true;
    } else {
        return false;
    }    
}

console.log(estaEnLiquidacionOEsPre('LIQasb'));
//console.log(estaEnLiquidacionOEsPre('LIQUIDACION'));
//console.log(estaEnLiquidacionOEsPre('PRE'));
        function aleatorio(min, max){
            return Math.floor(Math.random() * (max-min+1)+1)
        }

        function eleccion(jugada){
            let resultado = ""
            if (jugada == 1){
            resultado = "Piedra = 🪨"
            } else  if (jugada == 2){
            resultado = "Papel = 🧻"
            } else if (jugada == 3){
            resultado = "Tijera = ✂️"
            } else {
            resultado = "Elegiste MAL"
            }   
            return resultado
        }
            //FUNCIÓN PARA DECIDIR EL GANADOR
           /* function ganador(pc, jugador){
                    if (pc == jugador){
                        alert("Empate 🤼")
                        empates = empates + 1
                    }else if (jugador == 1 && pc == 3){
                        alert("Ganaste 🥳")
                        triunfos = triunfos + 1
                    }else if (jugador == 2 && pc == 1){
                        alert("Ganaste 🥳") 
                        triunfos = triunfos + 1    
                    }else if (jugador == 3 && pc == 2){
                        alert("Ganaste 🥳")
                        triunfos = triunfos + 1     
                    }else{
                        alert("Perdiste...  😢")
                        perdidas = perdidas +1
                    }

            }
    //FUNCIÓN PARA NOMBRAR AL GANADOR FINAL
     function mostrarResultados(){
             alert("Ganaste " + triunfos + " veces. Perdiste " + perdidas + " veces. Y empataste " + empates);
                if ( triunfos == 2 ) {
                        alert( "TÚ eres el GANADOR" );
                        resetearVariables();
                } else if ( perdidas == 2 ) {
                        alert( "EL COMPUTADOR es el GANADOR" );
                        resetearVariables();
                } else {
                        alert( "Hubo un error... 🙃");
                        resetearVariables();
                }        
            }

            //FUNCIÓN PARA RESETEAR VARIABLES DE VICTORIAS
           function resetearVariables() {
                triunfos = 0;
                perdidas = 0;
                empates  = 0;
            }

            //DECIDIENDO EL GANADOR
            let triunfos = 0;
            let perdidas = 0;
            let empates  = 0;
            quienGanaEntre ( eleccionDelJugador , eleccionDelComputador );*/

        // 1 es piedra, 2 es papel, 3 es tijera 
        let jugador = 0
        let pc = 0
        let triunfos = 0
        let perdidas = 0
        let empates = 0 

        while ( triunfos < 3 && perdidas < 3) {
            pc = aleatorio(1,3)
            jugador = prompt("Elige 1 para piedra, 2 para papel y 3 para tijera")

            //alert("Elegiste " + jugador)
            alert("PC elige: " + eleccion(pc))
            alert("Tú eliges: " + eleccion(jugador))
        
            //COMBATE
                if (pc == jugador){
                    alert("Empate")
                    empates = empates + 1
                }else if (jugador == 1 && pc == 3){
                    alert("Ganaste")
                    triunfos = triunfos + 1
                }else if (jugador == 2 && pc == 1){
                    alert("Ganaste") 
                    triunfos = triunfos + 1    
                }else if (jugador == 3 && pc == 2){
                    alert("Ganaste")
                    triunfos = triunfos + 1     
                }else{
                    alert("Perdiste")
                    perdidas = perdidas +1
                }
                
            }     
            
    
            alert("Ganaste " + triunfos + " veces. Perdiste " + perdidas + " veces. Y empataste " + empates)
        
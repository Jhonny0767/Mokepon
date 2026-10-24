const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')

const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')

const spanMascotaJugador = document.getElementById("mascota-jugador")
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')
const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')

const sectionMensajes = document.getElementById('resultado')

const elementoAtaqueJugador = document.getElementById('ataque-Jugador') 
const elementoAtaqueEnemigo = document.getElementById('ataque-Enemigo') 

const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let mokepones = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMokepones
let inputHipodoge
let inputCapipepo
let inputRatigueya
let labelHipodoge = null;
let labelCapipepo = null;
let labelRatigueya = null;
let mascotaJugador
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego 
let botonAgua
let botonTierra 
let botones = []
let victoriasJugador = 0
let victoriasEnemigo = 0
let lienzo = mapa.getContext("2d")
let intervalo
let personajeActual = null
let combateEjecutado = false 
let fondoMapa = new Image()
let fondoCargado = false
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
let enemigosEnMapa = []
const anchoMaximoDelMapa = 500

if(anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class Mokepon{
    constructor(nombre, foto, vida, fotoMapa, id = null){
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto, 
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    } 
}

let Hipodoge = new Mokepon('Hipodoge', './assets/Hipodoge2.png', 5, './assets/hipodoge.png')    
let Capipepo = new Mokepon('Capipepo', './assets/Capipepo2.png', 5, './assets/capipepo.png')
let Ratigueya = new Mokepon('Ratigueya', './assets/Ratigueya2.png', 5, './assets/ratigueya.png')

const HIPODOGE_ATAQUES = [
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🌱', id: 'boton-tierra'},
]
Hipodoge.ataques.push(...HIPODOGE_ATAQUES)

const CAPIPEPO_ATAQUES = [
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🔥', id: 'boton-fuego'},
]
Capipepo.ataques.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES = [
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🌱', id: 'boton-tierra'},
]
Ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

mokepones.push(Hipodoge, Capipepo, Ratigueya)

function iniciarJuego() {
    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'
    
    contenedorTarjetas.innerHTML = ''
    
    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id="${mokepon.nombre.toLowerCase()}" />
        <label class="targeta-de-mokepon" for="${mokepon.nombre.toLowerCase()}">
        <p>${mokepon.nombre}</p>
        <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones
    })

    inputHipodoge = document.getElementById('hipodoge')
    if (inputHipodoge) inputHipodoge.addEventListener('change', manejarSeleccionVisual)
    
    inputCapipepo = document.getElementById('capipepo')
    if (inputCapipepo) inputCapipepo.addEventListener('change', manejarSeleccionVisual)
    
    inputRatigueya = document.getElementById('ratigueya')
    if (inputRatigueya) inputRatigueya.addEventListener('change', manejarSeleccionVisual)

    labelHipodoge = document.querySelector('label[for="hipodoge"]')
    labelCapipepo = document.querySelector('label[for="capipepo"]')
    labelRatigueya = document.querySelector('label[for="ratigueya"]')

    sectionReiniciar.style.display = 'none'
    
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    
    let botonReiniciar = document.getElementById('boton-reiniciar')
    if (botonReiniciar) {
        botonReiniciar.addEventListener('click', reiniciarJuego)
    }

    unirseAlJuego() 

    fondoMapa.src = './assets/mokemap.png'
    fondoMapa.onload = function() {
        fondoCargado = true
        console.log("Fondo del mapa cargado correctamente")
    }
}

function unirseAlJuego() {
    fetch("/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        jugadorId = respuesta
                    })
            }
        }) 
}

function seleccionarMascotaJugador() {
    sectionSeleccionarMascota.style.display = 'none'
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
    
    if(inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
        personajeActual = Hipodoge
    } else if(inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
        personajeActual = Capipepo
    } else if(inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
        personajeActual = Ratigueya
    } else {
        alert("Mala Selección")
        location.reload()
    }

    seleccionarMokepon(mascotaJugador)
    extraerAtaques(mascotaJugador)
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`/mokepon/${jugadorId}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mokepon: mascotaJugador })
    })
}

function extraerAtaques(mascotaJugador){
    let ataques 
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre.toLowerCase()) {
           ataques = mokepones[i].ataques
        }
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    if (!ataques || ataques.length === 0) return;
    
    contenedorAtaques.innerHTML = ''
    
    ataques.forEach((ataque) => {
        let ataquesMokepon = `<button id="${ataque.id}" class="boton-de-ataque BAtaque">${ataque.nombre}</button>`
        contenedorAtaques.innerHTML += ataquesMokepon 
    })

    botonFuego = document.getElementById('boton-fuego')
    botonAgua = document.getElementById('boton-agua')
    botonTierra = document.getElementById('boton-tierra')
    botones = document.querySelectorAll('.BAtaque')
}

function secuenciaAtaque(){
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (ataqueJugador.length >= 5) return 
            
            if(e.target.textContent === '🔥') ataqueJugador.push('FUEGO')
            else if(e.target.textContent === '💧') ataqueJugador.push('AGUA')
            else ataqueJugador.push('TIERRA')
            
            manejarSeleccionAtaque(e.target.id)
            boton.disabled = true

            if (ataqueJugador.length === 5) {
                botones.forEach((btn) => { btn.disabled = true })
                enviarAtaques() 
            }
        })
    })
}

function manejarSeleccionVisual() {
    if (labelHipodoge) labelHipodoge.classList.remove('seleccionada')
    if (labelCapipepo) labelCapipepo.classList.remove('seleccionada')
    if (labelRatigueya) labelRatigueya.classList.remove('seleccionada')

    if (inputHipodoge && inputHipodoge.checked) labelHipodoge.classList.add('seleccionada')
    else if (inputCapipepo && inputCapipepo.checked) labelCapipepo.classList.add('seleccionada')
    else if (inputRatigueya && inputRatigueya.checked) labelRatigueya.classList.add('seleccionada')
}

function manejarSeleccionAtaque(botonId) {
    if (botonFuego) botonFuego.classList.remove('seleccionada');
    if (botonAgua) botonAgua.classList.remove('seleccionada');
    if (botonTierra) botonTierra.classList.remove('seleccionada');
    
    const botonSeleccionado = document.getElementById(botonId);
    if (botonSeleccionado) botonSeleccionado.classList.add('seleccionada');
}

function seleccionarMascotaEnemigo(enemigoConcreto) {
    spanMascotaEnemigo.innerHTML = enemigoConcreto.nombre
    ataquesMokeponEnemigo = enemigoConcreto.ataques
    secuenciaAtaque()
}

function enviarAtaques() {
    fetch(`/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            ataques: ataqueJugador,
            enemigoId: enemigoId // <--- Enviamos el ID
        })
    })
    .then(function (res) {
        if (res.ok) return res.json()
    })
    .then(function (data) {
        if (data && data.ataquesEnemigo && data.ataquesEnemigo.length === 5) {
            ataqueEnemigo = data.ataquesEnemigo
            combate()
        } else {
            sectionMensajes.innerHTML = "Esperando a que el otro jugador elija sus ataques..."
            esperarAtaqueEnemigo()
        }
    })
}

function esperarAtaqueEnemigo() {
    const intervaloEspera = setInterval(() => {
        fetch(`/mokepon/${jugadorId}/ataques`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                ataques: ataqueJugador,
                enemigoId: enemigoId // <--- Enviamos el ID
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.ataquesEnemigo && data.ataquesEnemigo.length === 5) {
                clearInterval(intervaloEspera) 
                ataqueEnemigo = data.ataquesEnemigo
                combate() 
            }
        })
    }, 2000)
}

async function combate() {
    let victoriasJugadorFinal = 0
    let victoriasEnemigoFinal = 0
    
    elementoAtaqueJugador.innerHTML = ''
    elementoAtaqueEnemigo.innerHTML = ''
    
    // Reiniciamos los contadores visuales a 0
    spanVidasJugador.innerHTML = '0'
    spanVidasEnemigo.innerHTML = '0'

    for (let index = 0; index < ataqueJugador.length; index++) {
        let ataqueJ = ataqueJugador[index]
        let ataqueE = ataqueEnemigo[index]
        
        // Creamos los elementos <p> para mostrar el ataque
        const pJugador = document.createElement('p')
        const pEnemigo = document.createElement('p')
        pJugador.innerHTML = ataqueJ
        pEnemigo.innerHTML = ataqueE
        pJugador.style.fontSize = '16px'
        pEnemigo.style.margin = '3px'
        pJugador.style.margin = '3px'
        pEnemigo.style.fontSize = '16px'
        
        // Ponemos colores para distinguir los ataques
        if (ataqueJ === 'FUEGO') pJugador.style.color = '#ff4444'
        else if (ataqueJ === 'AGUA') pJugador.style.color = '#38bdf8'
        else pJugador.style.color = '#22c55e'

        if (ataqueE === 'FUEGO') pEnemigo.style.color = '#ff4444'
        else if (ataqueE === 'AGUA') pEnemigo.style.color = '#38bdf8'
        else pEnemigo.style.color = '#22c55e'

        elementoAtaqueJugador.appendChild(pJugador)
        elementoAtaqueEnemigo.appendChild(pEnemigo)

        // Lógica para sumar los puntos
        let mensajeTurno = ""
        if (ataqueJ === ataqueE){
            victoriasJugadorFinal += 0.5
            victoriasEnemigoFinal += 0.5
            mensajeTurno = "Empate en el turno"
        } else if ((ataqueJ === 'FUEGO' && ataqueE === 'TIERRA') ||
                   (ataqueJ === 'AGUA' && ataqueE === 'FUEGO') ||
                   (ataqueJ === 'TIERRA' && ataqueE === 'AGUA')){
            victoriasJugadorFinal++
            mensajeTurno = "Ganaste el turno"
        } else {
            victoriasEnemigoFinal++
            mensajeTurno = "Perdiste el turno"
        }
        
        // ¡AQUÍ ESTÁ LA MAGIA! Actualizamos los ceros en la pantalla
        spanVidasJugador.innerHTML = victoriasJugadorFinal
        spanVidasEnemigo.innerHTML = victoriasEnemigoFinal

        // Mostramos un mensaje de qué pasó en este turno específico
        sectionMensajes.innerHTML = `Turno ${index + 1}: ${mensajeTurno}`
        
        // Hacemos una pausa de 1 segundo (1000 ms) antes de calcular el siguiente ataque
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // Al terminar los 5 turnos, mostramos el resultado final
    if (victoriasJugadorFinal === victoriasEnemigoFinal) crearMensajeFinal('👾Esto fue Empate👾!!!')
    else if (victoriasJugadorFinal < victoriasEnemigoFinal) crearMensajeFinal('☹️ Lo siento perdiste ☹️:(')
    else crearMensajeFinal(' !Felicitaciones¡👍😁🥳 GANASTE 👍😁🥳 :)')
}

function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = resultadoFinal
    if (botonFuego) botonFuego.disabled = true
    if (botonAgua) botonAgua.disabled = true
    if (botonTierra) botonTierra.disabled = true
    sectionReiniciar.style.display = 'block'
}

function reiniciarJuego() {
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min +1) + min)
}

function pintarPersonaje() {
    if (!personajeActual) return
    
    personajeActual.x = personajeActual.x + personajeActual.velocidadX
    personajeActual.y = personajeActual.y + personajeActual.velocidadY
    
    personajeActual.x = Math.max(0, Math.min(personajeActual.x, mapa.width - personajeActual.ancho))
    personajeActual.y = Math.max(0, Math.min(personajeActual.y, mapa.height - personajeActual.alto))
    
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    
    if (fondoCargado && fondoMapa.complete) {
        lienzo.drawImage(fondoMapa, 0, 0, mapa.width, mapa.height)
    } else {
        lienzo.fillStyle = '#2e7d32'
        lienzo.fillRect(0, 0, mapa.width, mapa.height)
    }
    
    personajeActual.pintarMokepon()
    
    for (let i = 0; i < enemigosEnMapa.length; i++) {
        if (enemigosEnMapa[i] && enemigosEnMapa[i].mapaFoto) {
            enemigosEnMapa[i].pintarMokepon()
            
            lienzo.beginPath();
            lienzo.arc(enemigosEnMapa[i].x + 20, enemigosEnMapa[i].y + 20, 25, 0, 2 * Math.PI);
            lienzo.strokeStyle = 'red';
            lienzo.lineWidth = 3;
            lienzo.stroke();
        }
    }
    
    enviarPosicion(personajeActual.x, personajeActual.y)
    
    if(personajeActual.velocidadX !== 0 || personajeActual.velocidadY !== 0) {
        for (let i = 0; i < enemigosEnMapa.length; i++) {
            if (revisarColision(enemigosEnMapa[i])) break
        }
    }
}

function enviarPosicion(x, y) {
    if (!jugadorId) return
    
    fetch(`/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y })
    })
    .then(function(res) {
        if (!res.ok) return
        return res.json()
    })
    .then(function(data) {
        if (!data || !data.enemigos) return
        
        const enemigosFiltrados = data.enemigos.filter(enemigo => enemigo.mokepon && enemigo.id !== jugadorId)
        
        enemigosEnMapa = enemigosFiltrados.map(function(enemigoData) {
            const mokeponNombre = enemigoData.mokepon.nombre.toLowerCase()
            const posX = enemigoData.x
            const posY = enemigoData.y
            
            if (posX === undefined || posY === undefined) return null;

            let mokeponEnemigo = null
            if (mokeponNombre === "hipodoge") mokeponEnemigo = new Mokepon('Hipodoge', './assets/Hipodoge2.png', 5, './assets/hipodoge.png')
            else if (mokeponNombre === "capipepo") mokeponEnemigo = new Mokepon('Capipepo', './assets/Capipepo2.png', 5, './assets/capipepo.png')
            else if (mokeponNombre === "ratigueya") mokeponEnemigo = new Mokepon('Ratigueya', './assets/Ratigueya2.png', 5, './assets/ratigueya.png')
            
            if (mokeponEnemigo) {
                mokeponEnemigo.x = posX
                mokeponEnemigo.y = posY
                mokeponEnemigo.id = enemigoData.id
                return mokeponEnemigo 
            }
            return null 
        }).filter(enemigo => enemigo !== null) 
        
        if (data.huboColision && sectionVerMapa.style.display !== 'none') {
            for (let i = 0; i < enemigosEnMapa.length; i++) {
                if (revisarColision(enemigosEnMapa[i])) break;
            }
        }
    })
    .catch(function(error) {
        console.error("❌ Error en enviarPosicion:", error)
    })
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case 'ArrowUp': moverArriba(); break
        case 'ArrowDown': moverAbajo(); break
        case 'ArrowLeft': moverIzquierda(); break
        case 'ArrowRight': moverDerecha(); break
    }
}

function iniciarMapa() {
    intervalo = setInterval(pintarPersonaje, 50)
    window.addEventListener('keydown', sePresionoUnaTecla)
    window.addEventListener('keyup', seSoltoUnaTecla)
}

function seSoltoUnaTecla(event) {
    if (personajeActual && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        personajeActual.velocidadX = 0
        personajeActual.velocidadY = 0
    }
}

function moverDerecha() { if (personajeActual) personajeActual.velocidadX = 5 }
function moverIzquierda() { if (personajeActual) personajeActual.velocidadX = -5 }
function moverAbajo() { if (personajeActual) personajeActual.velocidadY = 5 }
function moverArriba() { if (personajeActual) personajeActual.velocidadY = -5 }

function detenerMovimiento() {
    if (personajeActual) {
        personajeActual.velocidadX = 0
        personajeActual.velocidadY = 0
    }
}

function revisarColision(enemigo) {
    if (!personajeActual || !enemigo) return false;
    
    if (enemigo.x === undefined || enemigo.y === undefined || isNaN(enemigo.x) || isNaN(enemigo.y)) return false;
    if (personajeActual.x === undefined || personajeActual.y === undefined || isNaN(personajeActual.x) || isNaN(personajeActual.y)) return false;

    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = personajeActual.y
    const abajoMascota = personajeActual.y + personajeActual.alto
    const derechaMascota = personajeActual.x + personajeActual.ancho
    const izquierdaMascota = personajeActual.x

    if(abajoMascota <= arribaEnemigo || 
       arribaMascota >= abajoEnemigo || 
       derechaMascota <= izquierdaEnemigo || 
       izquierdaMascota >= derechaEnemigo
    ) {
        return false
    }
    
    // --- ¡AQUÍ GUARDAMOS EL ID! ---
    enemigoId = enemigo.id 
    // ------------------------------

    detenerMovimiento()
    clearInterval(intervalo)
    
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    
    let enemigoOriginal = null
    if (enemigo.nombre === "Hipodoge") enemigoOriginal = Hipodoge
    else if (enemigo.nombre === "Capipepo") enemigoOriginal = Capipepo
    else if (enemigo.nombre === "Ratigueya") enemigoOriginal = Ratigueya
    
    if (enemigoOriginal) seleccionarMascotaEnemigo(enemigoOriginal)
    
    return true
}

window.addEventListener('load', iniciarJuego)
window.moverDerecha = moverDerecha
window.moverIzquierda = moverIzquierda
window.moverArriba = moverArriba
window.moverAbajo = moverAbajo
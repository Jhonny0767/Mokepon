const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const jugadores = []

class Jugador {
    constructor(id) {
        this.id = id
        this.ultimaVez = Date.now()
    }

    asignarMOkepon(mokepon) {
        this.mokepon = mokepon
        this.ultimaVez = Date.now()
    }

    actualizarPosicion(x, y) {
        this.x = x
        this.y = y
        this.ultimaVez = Date.now()
    }

    asignarAtaques(ataques) {
        this.ataques = ataques
        this.ultimaVez = Date.now()
    }
}

class Mokepon {
    constructor(nombre) {
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {
    const id = `${Math.random()}`
    const jugador = new Jugador(id)
    jugadores.push(jugador)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(id)
})

app.post("/mokepon/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.mokepon || ""
    const mokepon = new Mokepon(nombre)

    const jugadorIndex = jugadores.findIndex((jugador) => jugador.id === jugadorId)
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarMOkepon(mokepon)
    }
    
    res.end()      
})  

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0 
    const y = req.body.y || 0  

    const jugadorIndex = jugadores.findIndex((jugador) => jugador.id === jugadorId)

    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

    let huboColision = false
    const jugadorActual = jugadores[jugadorIndex]
    
    if (jugadorActual) {
        for (let i = 0; i < jugadores.length; i++) {
            const enemigo = jugadores[i]
            if (enemigo.id !== jugadorId && enemigo.x !== undefined && enemigo.y !== undefined) {
                if (jugadorActual.x < enemigo.x + 40 &&
                    jugadorActual.x + 40 > enemigo.x &&
                    jugadorActual.y < enemigo.y + 40 &&
                    jugadorActual.y + 40 > enemigo.y) {
                    huboColision = true
                    break
                }
            }
        }
    }

    const enemigos = jugadores.filter((jugador) => {
        const esEnemigo = jugador.id !== jugadorId
        const estaActivo = (Date.now() - jugador.ultimaVez) < 5000
        return esEnemigo && estaActivo
    })

    res.send({
        enemigos,
        huboColision
    })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []

    const jugadorIndex = jugadores.findIndex((jugador) => jugador.id === jugadorId)
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    // Si el jugador aún no envía sus 5 ataques, no devolvemos nada
    if (ataques.length < 5) {
        res.send({ ataquesEnemigo: [] })
        return
    }

    // Buscamos un enemigo que también haya enviado sus 5 ataques
    const enemigo = jugadores.find((jugador) => 
        jugador.id !== jugadorId && 
        jugador.ataques && 
        jugador.ataques.length === 5
    )

    if (enemigo) {
        res.send({ ataquesEnemigo: enemigo.ataques })
    } else {
        res.send({ ataquesEnemigo: [] })
    }
})
                
app.listen(8080, () => {
    console.log("Servidor funcionando")
})
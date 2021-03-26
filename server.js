//#region Constantes
const {Archivo} = require("./archivo");
const { Producto } = require("./producto");
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const socketPort = process.env.PORT || 8080;
//#endregion

//#region Configs
app.engine("hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: 'main.hbs',
        layoutsDir: path.join(__dirname, "/views/layouts"),
        partialsDir: path.join(__dirname, "/views/partials/")
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, '/public')));
//#endregion

//#region Logica
let dbMensajes = "dbMensajes.txt";
let archivo = new Archivo(dbMensajes);
let listaMensajes = [];

let listaProductos = [];
let cantidadClientes = 0;
function guardarProducto(title, price, thumbnail) {
    let producto = new Producto(title, price, thumbnail);
    producto.id = listaProductos.length;
    listaProductos.push(producto);
}
//#endregion

//#region Views

//Home
app.get('/', (req, res) => {
    let hayProductos = listaProductos.length > 0;
    res.render('index.hbs', { hayProductos: hayProductos, productos: listaProductos });
});

//#endregion Views

//#region Socket
io.on('connection', (socket) => {
    console.log("Cliente conectado: " + socket.id);
    console.log("Cantidad de clientes: " + ++cantidadClientes);
    //Mandar array con mensajes y precargarlos
    archivo.Leer().then(contenido => {
        socket.emit('nuevo-miembro-historial-mensajes',contenido);
    })    
    socket.on('productoCargado', data => {
        console.log("Producto cargado");
        guardarProducto(data.title,data.price,data.thumbnail);       
        //Cuando recibo un producto, envio a todos el array de productos para que se actualicen
        let hayProductos = listaProductos.length > 0;
        io.sockets.emit('nuevoProductoCargado',{hayProductos:hayProductos,productos:listaProductos});
    })

    socket.on('chat-mensaje-enviado', data =>{
        //Recibo objeto completo
        //Guardar mensaje
        archivo.Leer().then(contenido => {
            listaMensajes = contenido;
            listaMensajes.push(data);
            archivo.Guardar(listaMensajes);
        })        
        //Reenviar a todos
        io.emit('chat-nuevo-mensaje',data);
    });
});


//#endregion

//#region Servidores
//Iniciar servidor
app.listen(port, () => {
    console.log("Servidor iniciado en el puerto " + port);
}).on("error", (err) => {
    console.log("Hubo un error: " + err);
});
//Iniciar servidor socket
http.listen(socketPort, () => {
    console.log("Socket port iniciado en " + socketPort);
}).on("error", (err) => {
    console.log("Hubo un error: " + err);
});

//#endregion
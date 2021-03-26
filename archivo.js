const fs = require('fs');
module.exports = {
    Archivo: class {
        constructor(nombre) {
            this.nombre = nombre;
        }

        async Leer() {
            try {
                let mensajes = await fs.promises.readFile(this.nombre, "utf-8")
                return JSON.parse(mensajes);
            } catch (e) {
                console.log(e);
                let mensajes = [];
                try {
                    await fs.promises.writeFile(this.nombre, JSON.stringify(mensajes));
                    console.log("Creacion exitosa");
                    return mensajes;
                } catch (e) {
                    console.log(e);
                }
            }
        }

        async Guardar(data) {
            console.log("Guardar archivo");
            try {
                await fs.promises.writeFile(this.nombre, JSON.stringify(data));
            } catch (e) {
                console.log("Ocurrio un error al sobreescribir el archivo: " + e);
            }
        }
    }
}
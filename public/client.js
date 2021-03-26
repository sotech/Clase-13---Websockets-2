const socket = io();

//Lista de productos
var context = `
    <h2 class='text-primary text-center'>Lista de Productos</h2>
    <div class='container'>
        {{#if hayProductos}}
        <table class='table table-dark'>
            <thead>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Foto</th>
            </thead>
            <tbody>
                {{#each productos}}
                <tr>
                    <td>{{this.title}}</td>
                    <td>\${{this.price}}</td>
                    <td><img src='{{this.thumbnail}}' width='50px' height='50px'></td>
                </tr>
                {{/each}}
            </tbody>
        </table>
        {{else}}
        <div class='container-fluid'>
            <h2 class='alert alert-danger text-center'>No hay productos cargados</h2>
        </div>
        {{/if}}
    </div>`;

function productoCargadoExitosamente(title){
    document.getElementById('mensajeProducto').innerHTML = title + " fue cargado exitosamente";
}

function cargarProducto(){
    console.log("Cargar Producto");
    let title = document.getElementById('title').value;
    let price = document.getElementById('price').value;
    let thumbnail = document.getElementById('thumbnail').value;
    //Enviar data a la pagina
    socket.emit('productoCargado',{title:title,price:price,thumbnail:thumbnail});
    productoCargadoExitosamente(title);
}

socket.on('nuevoProductoCargado', data => {
    console.log("Nuevo Producto Cargado");    
    var template = Handlebars.compile(context);
    var html = template(data);
    console.log(html);
    document.getElementById('template').innerHTML = html;
})


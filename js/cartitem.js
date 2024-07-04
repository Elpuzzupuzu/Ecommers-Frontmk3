// Función para agregar productos al carrito
async function agregarAlCarrito(e) {
    const idBoton = parseInt(e.currentTarget.id, 10);
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productoAgregado) {
        const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idBoton);

        if (productoEnCarrito) {
            // Si el producto ya está en el carrito, aumentar la cantidad vendida
            productoEnCarrito.sold++;
        } else {
            // Si el producto no está en el carrito, agregarlo con la cantidad vendida inicial de 1
            productoAgregado.sold = 1;
            productosEnCarrito.push(productoAgregado);
            console.log(`Producto agregado al carrito:`, productoAgregado);

            // Guardar productos en el carrito en localStorage
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Envía el producto al carrito en el backend
            await agregarProductoAlCarrito(productoAgregado.id, 1); // Aquí 1 es la cantidad inicial
        }
    } else {
        console.error(`Producto con ID ${idBoton} no encontrado`);
    }

    actualizarCarrito();
}

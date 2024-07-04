// Función para agregar productos al carrito
async function agregarAlCarrito(e) {
    const idBoton = parseInt(e.currentTarget.id, 10);
    console.log(`ID del botón: ${idBoton}`);

    const productoAgregadoEnClick = productos.find(producto => producto.id === idBoton);
    if (productoAgregadoEnClick) {
        try {
            // Envía el producto al carrito en el backend
            await agregarProductoAlCarrito(productoAgregadoEnClick.id, 1); // Aquí 1 es la cantidad inicial

            // Si el producto no está en el carrito, agregarlo con la cantidad vendida inicial de 1
            const productoEnCarrito = productoAgregado.find(producto => producto.id === idBoton);
            if (productoEnCarrito) {
                // Si el producto ya está en el carrito, aumentar la cantidad vendida
                productoEnCarrito.sold++;
            } else {
                productoAgregadoEnClick.sold = 1;
                productoAgregado.push(productoAgregadoEnClick);
                console.log(`Producto agregado:`, productoAgregadoEnClick);
            }

            // Actualizar el carrito en localStorage
            localStorage.setItem("productos-en-carrito", JSON.stringify(productoAgregado));
            actualizarNumerito();
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            alert('Error al agregar producto al carrito');
        }
    } else {
        console.error(`Producto con ID ${idBoton} no encontrado`);
    }
}

// Función para enviar el producto al carrito en el backend
async function agregarProductoAlCarrito(productId, quantity) {
    try {
        const response = await fetch(`http://localhost:8080/cart/add?userId=1&productId=${productId}&quantity=${quantity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al agregar producto al carrito');
        }

        console.log('Producto agregado al carrito en el backend');
    } catch (error) {
        console.error('Error al agregar producto al carrito en el backend:', error);
        throw error; // Propagar el error para que sea capturado por la función agregarAlCarrito
    }
}

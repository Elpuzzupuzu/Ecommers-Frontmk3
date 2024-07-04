// Función para agregar productos al carrito
async function agregarAlCarrito(e) {
    const idBoton = parseInt(e.currentTarget.id, 10);
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    // Obtener userId desde localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo.userId : null;

    if (!userId) {
        console.error("User ID no encontrado en localStorage");
        return;
    }

    if (productoAgregado) {
        const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idBoton);

        if (productoEnCarrito) {
            // Si el producto ya está en el carrito, aumentar la cantidad vendida
            productoEnCarrito.sold++;
        } else {
            // Si el producto no está en el carrito, agregarlo con la cantidad vendida inicial de 1
            productoAgregado.sold = 1;
            productosEnCarrito.push(productoAgregado);
        }

        try {
            // Envía el producto al carrito en el backend
            await agregarProductoAlCarrito(userId, productoAgregado.id, productoAgregado.sold); // Aquí se envía la cantidad actual
            console.log(`Producto agregado al carrito:`, productoAgregado);

            // Guardar productos en el carrito en localStorage
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        } catch (error) {
            console.error('Error al agregar producto al carrito en el backend:', error);
            alert('Error al agregar producto al carrito');
        }

    } else {
        console.error(`Producto con ID ${idBoton} no encontrado`);
    }

    actualizarCarrito();
}

// Función para enviar el producto al carrito en el backend
async function agregarProductoAlCarrito(userId, productId, quantity) {
    try {
        const response = await fetch(`http://localhost:8080/cart/add?userId=${userId}&productId=${productId}&quantity=${quantity}`, {
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
        throw error; // Lanzar el error para que sea capturado en la función agregarAlCarrito
    }
}

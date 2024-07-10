document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://localhost:8080/products/page'; // Reemplaza con la URL de tu servidor Spring Boot
    let currentPage = 0;
    const pageSize = 5;

    function getAllProducts(page, size) {
        fetch(`${baseUrl}?page=${page}&size=${size}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts(productsPage) {
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = ''; // Limpiamos el contenedor

        if (!productsPage.content || productsPage.content.length === 0) {
            productsContainer.innerHTML = '<p>No products found.</p>';
            return;
        }

        productsPage.content.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = 
            `
           <div class="card-product">
                    <div class="container-img">
                        <img src="${product.img}" alt="illia">
                        <span class="discount">-13%</span>
                        <div class="button-group">
                            <span>
                                <i class="fa-solid fa-eye"></i>
                            </span>
                            <span>
                                <i class="fa-regular fa-heart"></i>
                            </span>
                            <span>
                                <i class="fa-solid fa-code-compare"></i>
                            </span>
                        </div>
                     </div>  <!--testing-->
                     <div class="content-card-product">
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <h3>${product.name}</h3>
                        <button class="add-cart" id=${product.id}>
                            <i class="fa-solid fa-basket-shopping"></i>
                        </button>
                        <p class="price">$${product.price}  <span></span></p>
                        <P class="price">${product.stock}<span></span></p>
                    </div>
                </div><!--fin card product-->
        `;
             
            productsContainer.appendChild(productCard);
        });

        // Información de paginación
        const pageInfo = document.getElementById('pageInfo');
        pageInfo.innerHTML = `Page ${productsPage.number + 1} of ${productsPage.totalPages}`;

        document.getElementById('prevPage').disabled = productsPage.number === 0;
        document.getElementById('nextPage').disabled = productsPage.number + 1 >= productsPage.totalPages;
    }///fin paginacion

    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage--;
            getAllProducts(currentPage, pageSize);
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        currentPage++;
        getAllProducts(currentPage, pageSize);
    });

    // Obtener la primera página con 5 productos
    getAllProducts(currentPage, pageSize);
});

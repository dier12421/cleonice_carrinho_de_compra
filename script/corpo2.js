document.addEventListener('DOMContentLoaded', function () {
    let currentProductIndex = 0;
    const productsPerPage = 5; // Número de produtos a serem exibidos por vez
    const products = document.querySelectorAll('.topproduct-card');

    // Função para mostrar os produtos
    function showProducts() {
        products.forEach((product, index) => {
            product.style.display = (index >= currentProductIndex && index < currentProductIndex + productsPerPage) ? 'block' : 'none';
        });
    }

    // Função para mostrar os próximos produtos
    function showNextProducts() {
        currentProductIndex += productsPerPage;
        if (currentProductIndex >= products.length) {
            currentProductIndex = 0; // Reinicia para o começo
        }
        showProducts();
    }

    // Função para mostrar os produtos anteriores
    function showPreviousProducts() {
        currentProductIndex -= productsPerPage;
        if (currentProductIndex < 0) {
            currentProductIndex = Math.max(products.length - productsPerPage, 0); // Impede que fique negativo
        }
        showProducts();
    }

    // Vincule as funções aos botões
    document.querySelector('.esquerdas').addEventListener('click', showPreviousProducts);
    document.querySelector('.direitas').addEventListener('click', showNextProducts);

    // Mostrar os produtos iniciais
    showProducts();
});

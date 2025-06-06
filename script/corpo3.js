document.addEventListener('DOMContentLoaded', () => {
    let currentProductIndex = 0;
    const productsPerPage = 5; // Número de produtos a serem exibidos por vez
    const products = document.querySelectorAll('.product-card');

    // Função para atualizar a exibição dos produtos
    const updateProductDisplay = () => {
        products.forEach((product, index) => {
            product.style.display = (index >= currentProductIndex && index < currentProductIndex + productsPerPage) ? 'block' : 'none';
        });

        // Desabilita os botões se não houver mais produtos a serem exibidos
        document.querySelector('.esquerdas').disabled = currentProductIndex === 0;
        document.querySelector('.direitas').disabled = currentProductIndex + productsPerPage >= products.length;
    };

    // Função para mostrar os próximos produtos
    const showNextProducts = () => {
        currentProductIndex += productsPerPage;
        if (currentProductIndex >= products.length) {
            currentProductIndex = products.length - productsPerPage; // Impede que passe do final
        }
        updateProductDisplay();
    };

    // Função para mostrar os produtos anteriores
    const showPreviousProducts = () => {
        currentProductIndex -= productsPerPage;
        if (currentProductIndex < 0) {
            currentProductIndex = 0; // Impede que fique negativo
        }
        updateProductDisplay();
    };

    // Adiciona os ouvintes de evento para os botões
    document.querySelector('.esquerdass').addEventListener('click', showPreviousProducts);
    document.querySelector('.direitass').addEventListener('click', showNextProducts);

    // Mostra os produtos iniciais
    updateProductDisplay();
});

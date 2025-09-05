// Variáveis globais
let cartItems = [
  {
    id: 1,
    name: "Grãos de Soja Premium",
    price: 120.00,
    quantity: 2,
    category: "Grãos e Cereais",
    image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=100&h=120&fit=crop",
    stock: "Em estoque"
  },
  {
    id: 2,
    name: "Feno de Qualidade",
    price: 89.00,
    quantity: 1,
    category: "Alimentos para Animais",
    image: "https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?w=100&h=120&fit=crop",
    stock: "Em estoque"
  },
  {
    id: 3,
    name: "Kit Ferramentas Agrícolas",
    price: 89.00,
    quantity: 1,
    category: "Ferramentas",
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=100&h=120&fit=crop",
    stock: "Últimas unidades!"
  }
];

let couponApplied = false;
let couponDiscount = 0;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeCart();
  setupEventListeners();
});

// Inicializar o carrinho
function initializeCart() {
  updateCartCount();
  updateCartSummary();
}

// Configurar event listeners
function setupEventListeners() {
  // Botões de quantidade
  document.querySelectorAll('.qty button').forEach(button => {
    button.addEventListener('click', handleQuantityChange);
  });
  
  // Botões de remover item
  document.querySelectorAll('.remove').forEach(button => {
    button.addEventListener('click', removeItem);
  });
  
  // Botão aplicar cupom
  document.querySelector('.btn-apply').addEventListener('click', applyCoupon);
  
  // Botão limpar carrinho
  document.querySelector('.btn-clear').addEventListener('click', clearCart);
  
  // Botão finalizar compra
  document.querySelector('.btn-checkout').addEventListener('click', checkout);
  
  // Botão continuar comprando
  document.querySelector('.btn-continue').addEventListener('click', continueShopping);
  
  // Adicionar cupom pelo resumo
  document.querySelector('.coupon button').addEventListener('click', focusCouponInput);
}

// Manipular mudança de quantidade
function handleQuantityChange(e) {
  const button = e.currentTarget;
  const row = button.closest('tr');
  const itemId = parseInt(row.dataset.id);
  const quantityElement = row.querySelector('.qty span');
  let quantity = parseInt(quantityElement.textContent);
  
  if (button.querySelector('.bx-minus')) {
    // Diminuir quantidade
    if (quantity > 1) {
      quantity--;
      updateItemQuantity(itemId, quantity);
    }
  } else {
    // Aumentar quantidade
    quantity++;
    updateItemQuantity(itemId, quantity);
  }
  
  quantityElement.textContent = quantity;
  updateItemTotal(row, quantity);
  updateCartCount();
  updateCartSummary();
}

// Atualizar quantidade do item no array
function updateItemQuantity(itemId, newQuantity) {
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    cartItems[itemIndex].quantity = newQuantity;
  }
}

// Atualizar total do item na linha
function updateItemTotal(row, quantity) {
  const price = parseFloat(row.querySelector('td:nth-child(2)').textContent.replace('R$ ', '').replace(',', '.'));
  const total = price * quantity;
  row.querySelector('td:nth-child(4)').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Remover item do carrinho
function removeItem(e) {
  const button = e.currentTarget;
  const row = button.closest('tr');
  const itemId = parseInt(row.dataset.id);
  
  // Animação de remoção
  row.classList.add('animate__animated', 'animate__fadeOutLeft');
  
  setTimeout(() => {
    // Remover do array
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    // Remover do DOM
    row.remove();
    
    // Atualizar contador e resumo
    updateCartCount();
    updateCartSummary();
    
    // Mostrar mensagem se carrinho estiver vazio
    if (cartItems.length === 0) {
      showEmptyCartMessage();
    }
  }, 500);
}

// Aplicar cupom de desconto
function applyCoupon() {
  const couponInput = document.querySelector('.coupon-input input');
  const couponCode = couponInput.value.trim();
  
  if (!couponCode) {
    showNotification('Por favor, insira um código de cupom.', 'error');
    return;
  }
  
  // Simulação de verificação de cupom
  if (couponCode.toUpperCase() === 'CELEIRO10') {
    couponApplied = true;
    couponDiscount = 0.1; // 10% de desconto
    
    // Atualizar UI
    document.querySelector('.discount span:last-child').textContent = `- R$ ${calculateDiscount().toFixed(2).replace('.', ',')}`;
    document.querySelector('.discount').style.display = 'flex';
    document.querySelector('.coupon').style.display = 'none';
    
    updateCartSummary();
    showNotification('Cupom aplicado com sucesso!', 'success');
  } else {
    showNotification('Cupom inválido ou expirado.', 'error');
  }
  
  couponInput.value = '';
}

// Calcular desconto
function calculateDiscount() {
  if (!couponApplied) return 0;
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  return subtotal * couponDiscount;
}

// Atualizar contador do carrinho
function updateCartCount() {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.cart-count').textContent = totalItems;
  document.querySelector('.cart-summary-mobile span:first-child').textContent = `${totalItems} itens`;
}

// Atualizar resumo do carrinho
function updateCartSummary() {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = calculateDiscount();
  const total = subtotal - discount;
  
  // Atualizar valores no resumo
  document.querySelector('.summary-box .info div:first-child span:last-child').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  document.querySelector('.summary-box footer span:last-child').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  
  // Atualizar resumo mobile
  document.querySelector('.cart-summary-mobile span:last-child').textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Limpar carrinho
function clearCart() {
  if (cartItems.length === 0) {
    showNotification('Seu carrinho já está vazio.', 'info');
    return;
  }
  
  if (confirm('Tem certeza que deseja limpar seu carrinho?')) {
    // Limpar array
    cartItems = [];
    
    // Limpar tabela com animação
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
      setTimeout(() => {
        row.classList.add('animate__animated', 'animate__fadeOutLeft');
        setTimeout(() => row.remove(), 500);
      }, index * 100);
    });
    
    // Atualizar contador e resumo após animação
    setTimeout(() => {
      updateCartCount();
      updateCartSummary();
      showEmptyCartMessage();
    }, rows.length * 100 + 500);
    
    showNotification('Carrinho limpo com sucesso.', 'success');
  }
}

// Finalizar compra
function checkout() {
  if (cartItems.length === 0) {
    showNotification('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.', 'error');
    return;
  }
  
  // Animação de loading no botão
  const checkoutBtn = document.querySelector('.btn-checkout');
  const originalText = checkoutBtn.innerHTML;
  checkoutBtn.innerHTML = '<i class="bx bx-loader bx-spin"></i> Processando...';
  checkoutBtn.disabled = true;
  
  // Simulação de processamento
  setTimeout(() => {
    showNotification('Compra realizada com sucesso! Redirecionando...', 'success');
    
    // Redirecionar após sucesso (simulado)
    setTimeout(() => {
      alert('Pedido finalizado com sucesso! Em breve você receberá um e-mail de confirmação.');
      // Aqui normalmente redirecionaríamos para uma página de confirmação
      checkoutBtn.innerHTML = originalText;
      checkoutBtn.disabled = false;
    }, 1500);
  }, 2000);
}

// Continuar comprando
function continueShopping() {
  // Simulação - normalmente redirecionaria para a página de produtos
  showNotification('Redirecionando para a página de produtos...', 'info');
  // window.location.href = 'produtos.html'; // Descomente quando tiver a URL real
}

// Focar no input de cupom
function focusCouponInput() {
  document.querySelector('.coupon-input input').focus();
}

// Mostrar mensagem de carrinho vazio
function showEmptyCartMessage() {
  const tbody = document.querySelector('tbody');
  if (cartItems.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-cart animate__animated animate__fadeIn">
        <td colspan="5" style="text-align: center; padding: 30px;">
          <i class='bx bxs-cart' style="font-size: 48px; color: #ccc; display: block; margin-bottom: 15px;"></i>
          <h3>Seu carrinho está vazio</h3>
          <p>Que tal dar uma olhada em nossos produtos?</p>
          <button class="btn-continue" style="margin: 20px auto;">
            <i class='bx bx-chevron-left'></i> Continuar Comprando
          </button>
        </td>
      </tr>
    `;
    
    // Reatachar event listener ao novo botão
    document.querySelector('.empty-cart .btn-continue').addEventListener('click', continueShopping);
  }
}

// Mostrar notificação
function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">
      <i class='bx bx-x'></i>
    </button>
  `;
  
  // Adicionar ao documento
  document.body.appendChild(notification);
  
  // Mostrar com animação
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
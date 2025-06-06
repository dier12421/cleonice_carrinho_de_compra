let indice = 0;

function atualizarCarrossel() {
    const grupos = document.querySelectorAll('.grupo');
    grupos.forEach((grupo, i) => {
        grupo.style.display = i === indice ? 'flex' : 'none';
    });
}

function moverDireita() {
    const grupos = document.querySelectorAll('.grupo');
    if (indice < grupos.length - 1) {
        indice++;
        atualizarCarrossel();
    }
}

function moverEsquerda() {
    if (indice > 0) {
        indice--;
        atualizarCarrossel();
    }
}

// Inicializa o carrossel
atualizarCarrossel();

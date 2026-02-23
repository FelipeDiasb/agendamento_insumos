



//Login fixo: admin@comercialesperanca.com / 123456

// Imagem de fundo com paletes
/*
// Cores amarelo suave e cinza profissional

Elementos decorativos (faixas e círculos)

Logo do Comercial Esperança

 Página de agendamento funcional - 22/02/2026 23:28*/

// LINHA 1: Elementos do DOM
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPassword = document.getElementById('forgotPassword');
const modal = document.getElementById('forgotModal');
const closeModal = document.querySelector('.close');

// LINHA 9: USUÁRIO FIXO PARA TESTE
const USUARIO_FIXO = {
    nome: "Administrador",
    email: "admin@comercialesperanca.com",
    senha: "123456"
};

// LINHA 16: Alternar entre Login e Cadastro
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

// LINHA 30: Mostrar/Esconder senha
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

// LINHA 44: Modal de esqueceu senha
forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('show');
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// LINHA 58: Sistema de armazenamento local
const users = JSON.parse(localStorage.getItem('users')) || [];

// LINHA 61: Função para mostrar mensagem
function showMessage(form, message, isSuccess = false) {
    const oldMessage = form.querySelector('.error-message, .success-message');
    if (oldMessage) oldMessage.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = isSuccess ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    form.insertBefore(messageDiv, form.firstChild);

    setTimeout(() => messageDiv.remove(), 3000);
}

// LINHA 73: Validação de email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// LINHA 77: LOGIN
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage(loginForm, 'Preencha todos os campos!');
        return;
    }

    // LINHA 88: Verifica se é o usuário fixo
    if (email === USUARIO_FIXO.email && password === USUARIO_FIXO.senha) {
        showMessage(loginForm, `Bem-vindo, ${USUARIO_FIXO.nome}!`, true);

        sessionStorage.setItem('currentUser', JSON.stringify(USUARIO_FIXO));

        setTimeout(() => {
            window.location.href = 'agendamento.html';
        }, 1500);
    } 
    else {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            showMessage(loginForm, `Bem-vindo, ${user.name}!`, true);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            setTimeout(() => {
                window.location.href = 'agendamento.html';
            }, 1500);
        } else {
            showMessage(loginForm, 'E-mail ou senha incorretos!');
        }
    }
});

// LINHA 115: CADASTRO
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showMessage(registerForm, 'Preencha todos os campos!');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(registerForm, 'E-mail inválido!');
        return;
    }

    if (password.length < 6) {
        showMessage(registerForm, 'A senha deve ter pelo menos 6 caracteres!');
        return;
    }

    if (password !== confirmPassword) {
        showMessage(registerForm, 'As senhas não coincidem!');
        return;
    }

    if (users.some(user => user.email === email)) {
        showMessage(registerForm, 'Este e-mail já está cadastrado!');
        return;
    }

    users.push({
        name,
        email,
        password
    });

    localStorage.setItem('users', JSON.stringify(users));

    showMessage(registerForm, 'Cadastro realizado com sucesso!', true);

    registerForm.reset();

    setTimeout(() => {
        loginTab.click();
    }, 2000);
});

// LINHA 159: Recuperar senha
document.getElementById('resetPassword').addEventListener('click', () => {
    const email = document.getElementById('resetEmail').value.trim();

    if (!email) {
        alert('Digite seu e-mail!');
        return;
    }

    if (email === USUARIO_FIXO.email) {
        alert(`A senha do administrador é: ${USUARIO_FIXO.senha}`);
    } else {
        const user = users.find(u => u.email === email);
        if (user) {
            alert(`A senha cadastrada é: ${user.password}`);
        } else {
            alert('E-mail não encontrado!');
        }
    }

    modal.classList.remove('show');
    document.getElementById('resetEmail').value = '';
});

// LINHA 180: Verifica se já está logado
window.addEventListener('load', () => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('index')) {
        window.location.href = 'agendamento.html';
    }
});
// Elementos do DOM
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPassword = document.getElementById('forgotPassword');
const modal = document.getElementById('forgotModal');
const closeModal = document.querySelector('.close');

// Alternar entre Login e Cadastro
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

// Mostrar/Esconder senha
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

// Modal de esqueceu senha
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

// Sistema de armazenamento local (simulando banco de dados)
const users = JSON.parse(localStorage.getItem('users')) || [];

// Função para mostrar mensagem
function showMessage(form, message, isSuccess = false) {
    // Remove mensagem anterior
    const oldMessage = form.querySelector('.error-message, .success-message');
    if (oldMessage) oldMessage.remove();

    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = isSuccess ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    form.insertBefore(messageDiv, form.firstChild);

    // Remove após 3 segundos
    setTimeout(() => messageDiv.remove(), 3000);
}

// Validação de email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// CADASTRO
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Validações
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

    // Verifica se usuário já existe
    if (users.some(user => user.email === email)) {
        showMessage(registerForm, 'Este e-mail já está cadastrado!');
        return;
    }

    // Salva usuário
    users.push({
        name,
        email,
        password // Em produção, isso deveria ser criptografado!
    });

    localStorage.setItem('users', JSON.stringify(users));

    showMessage(registerForm, 'Cadastro realizado com sucesso!', true);

    // Limpa formulário
    registerForm.reset();

    // Muda para a aba de login após 2 segundos
    setTimeout(() => {
        loginTab.click();
    }, 2000);
});

// LOGIN
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage(loginForm, 'Preencha todos os campos!');
        return;
    }

    // Busca usuário
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        showMessage(loginForm, `Bem-vindo, ${user.name}!`, true);

        // Salva sessão
        sessionStorage.setItem('currentUser', JSON.stringify(user));

        // Redireciona para página de agendamento após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'agendamento.html';
        }, 1500);
    } else {
        showMessage(loginForm, 'E-mail ou senha incorretos!');
    }
});

// Recuperar senha
document.getElementById('resetPassword').addEventListener('click', () => {
    const email = document.getElementById('resetEmail').value.trim();

    if (!email) {
        alert('Digite seu e-mail!');
        return;
    }

    const user = users.find(u => u.email === email);

    if (user) {
        alert(`Instruções enviadas para ${email} (simulação)`);
    } else {
        alert('E-mail não encontrado!');
    }

    modal.classList.remove('show');
    document.getElementById('resetEmail').value = '';
});

// Verifica se já está logado (para redirecionar)
window.addEventListener('load', () => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('index')) {
        // Se já estiver logado, vai direto pro agendamento
        window.location.href = 'agendamento.html';
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const loginDiv = document.getElementById('loginDiv');
    const cadastroDiv = document.getElementById('cadastroDiv');
    const showCadastro = document.getElementById('showCadastro');
    const showLogin = document.getElementById('showLogin');
    const cadastroSenha = document.getElementById('cadastroSenha');
    const passwordCriteria = {
        length: document.getElementById('length'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        number: document.getElementById('number'),
        special: document.getElementById('special')
    };

    showCadastro.addEventListener('click', (event) => {
        event.preventDefault();
        loginDiv.classList.add('escondido');
        cadastroDiv.classList.remove('escondido');
    });

    showLogin.addEventListener('click', (event) => {
        event.preventDefault();
        cadastroDiv.classList.add('escondido');
        loginDiv.classList.remove('escondido');
    });

    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('cadastroUsuario').value;
        const password = document.getElementById('cadastroSenha').value;

        if (!validateEmail(username)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        if (!validatePassword(password)) {
            alert('A senha deve conter no mínimo 8 caracteres, incluindo pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@$!%*?&).');
            return;
        }

        fetch('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.text())
            .then(data => alert(data))
            .catch(error => console.error('Erro: 100', error));
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsuario').value;
        const password = document.getElementById('loginSenha').value;
    
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password})
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'http://localhost:3000/dashboard'; // Redireciona para o dashboard após o login bem-sucedido
            } else {
                return response.text(); // Retorna uma mensagem de erro do servidor
            }
        })
        .then(data => alert(data)) // Exibe a mensagem de erro
        .catch(error => console.error('Erro: 200', error));
    });
    

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const valid = re.test(password);

        // Check length
        passwordCriteria.length.classList.toggle('valid', password.length >= 8);
        passwordCriteria.length.classList.toggle('invalid', password.length < 8);

        // Check for uppercase letter
        passwordCriteria.uppercase.classList.toggle('valid', /[A-Z]/.test(password));
        passwordCriteria.uppercase.classList.toggle('invalid', !/[A-Z]/.test(password));

        // Check for lowercase letter
        passwordCriteria.lowercase.classList.toggle('valid', /[a-z]/.test(password));
        passwordCriteria.lowercase.classList.toggle('invalid', !/[a-z]/.test(password));

        // Check for number
        passwordCriteria.number.classList.toggle('valid', /\d/.test(password));
        passwordCriteria.number.classList.toggle('invalid', !/\d/.test(password));

        // Check for special character
        passwordCriteria.special.classList.toggle('valid', /[@$!%*?&]/.test(password));
        passwordCriteria.special.classList.toggle('invalid', !/[@$!%*?&]/.test(password));

        return valid;
    }

    cadastroSenha.addEventListener('input', () => {
        const senha = cadastroSenha.value;
        validatePassword(senha);
    });
});

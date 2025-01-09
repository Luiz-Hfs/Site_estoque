document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Tentando fazer login com:', username, password);
    
    // Simulação de autenticação
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Usuários armazenados:', users);
    const user = users.find(user => {
        console.log('Verificando usuário:', user);
        return user.username === username && user.password === password;
    });
    
    if (user) {
        console.log('Usuário encontrado:', user);
        localStorage.setItem('userRole', user.role);
        window.location.href = 'products.html';
    } else {
        console.log('Usuário ou senha incorretos');
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorMessage').textContent = 'Usuário ou senha incorretos';
    }
});

// Inicializa os usuários no Local Storage
if (!localStorage.getItem('users')) {
    const users = [
        { username: 'luiz', password: '12345', role: 'admin' },
        { username: 'renan', password: '12345', role: 'viewer' }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}
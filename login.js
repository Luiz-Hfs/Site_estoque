// Limpa o Local Storage ao carregar a página de login
localStorage.clear();

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Tentando fazer login com:', username, password);
    
    // Simulação de autenticação
    const apiKey = '$2a$10$9VBIUCivrI51dU493dOL/uL9ykaLOrUYobdHgyGPq9Pgbxrsh1cVO';
    const binId = '6786567be41b4d34e477446e';
    fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        headers: {
            'X-Master-Key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao acessar o JSONBin');
        }
        return response.json();
    })
    .then(data => {
        const users = data.record.users || [];
        console.log('Usuários armazenados no JSONBin:', users);
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
    })
    .catch(error => {
        console.error('Erro ao acessar o JSONBin:', error);
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorMessage').textContent = 'Erro ao acessar o servidor. Tente novamente mais tarde.';
    });
});
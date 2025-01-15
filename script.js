document.addEventListener('DOMContentLoaded', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
        document.getElementById('productForm').style.display = 'none';
    }
    
    const apiKey = '$2a$10$9VBIUCivrI51dU493dOL/uL9ykaLOrUYobdHgyGPq9Pgbxrsh1cVO'; // X-Master-Key
    const binId = '67868953ad19ca34f8ed1621'; // Bin ID para produtos

    fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: {
            'X-Master-Key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao acessar o JSONBin: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const products = data.record.products || [];
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts(products);
    })
    .catch(error => {
        console.error('Erro ao acessar o JSONBin:', error);
        alert('Erro ao acessar o servidor. Tente novamente mais tarde.');
    });

    // Adiciona a funcionalidade do botão Home
    document.getElementById('homeButton').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Adiciona a funcionalidade do botão Sair
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    });
});

function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        const name = document.createElement('p');
        name.textContent = product.name;
        productItem.appendChild(name);
        
        const quantity = document.createElement('p');
        quantity.textContent = `Quantidade: ${product.quantity}`;
        productItem.appendChild(quantity);
        
        if (localStorage.getItem('userRole') === 'admin') {
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = product.name;
            nameInput.className = 'name-input';
            productItem.appendChild(nameInput);
            
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = product.quantity;
            quantityInput.className = 'quantity-input';
            productItem.appendChild(quantityInput);
            
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Alterar Produto';
            updateButton.className = 'update-button';
            updateButton.addEventListener('click', function() {
                const newName = nameInput.value;
                const newQuantity = quantityInput.value;

                products[index].name = newName;
                products[index].quantity = newQuantity;
                saveProducts(products);
            });
            productItem.appendChild(updateButton);
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir Produto';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function() {
                products.splice(index, 1);
                saveProducts(products);
            });
            productItem.appendChild(deleteButton);
        }
        
        productList.appendChild(productItem);
    });
}

document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productQuantity = document.getElementById('productQuantity').value;

    const productData = {
        name: productName,
        quantity: productQuantity
    };

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(productData);
    saveProducts(products);
    
    document.getElementById('productForm').reset();
});

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
    updateJsonBin(products);
}

function updateJsonBin(products) {
    const apiKeyProducts = '$2a$10$9VBIUCivrI51dU493dOL/uL9ykaLOrUYobdHgyGPq9Pgbxrsh1cVO'; // X-Master-Key
    const binIdProducts = '67868953ad19ca34f8ed1621'; // Bin ID para produtos
    
    const productsWithoutImages = products.map(product => {
        return { name: product.name, quantity: product.quantity }; // Remover imagens
    });

    const requestBody = {
        products: productsWithoutImages
    };

    fetch(`https://api.jsonbin.io/v3/b/${binIdProducts}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKeyProducts
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao salvar os produtos: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Produtos salvos no JSONBin:', data);
    })
    .catch(error => {
        console.error('Erro ao salvar os produtos no JSONBin:', error);
        alert('Erro ao salvar os produtos. Tente novamente mais tarde.');
    });
}

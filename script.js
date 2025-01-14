document.addEventListener('DOMContentLoaded', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
        document.getElementById('productForm').style.display = 'none';
    }
    
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
        const products = data.record.products || [];
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        
        products.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            
            const img = document.createElement('img');
            img.src = product.image;
            productItem.appendChild(img);
            
            const name = document.createElement('p');
            name.textContent = product.name;
            productItem.appendChild(name);
            
            const quantity = document.createElement('p');
            quantity.textContent = `Quantidade: ${product.quantity}`;
            productItem.appendChild(quantity);
            
            if (userRole === 'admin') {
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
                
                const imageInput = document.createElement('input');
                imageInput.type = 'file';
                imageInput.accept = 'image/*';
                imageInput.className = 'image-input';
                productItem.appendChild(imageInput);
                
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Alterar Produto';
                updateButton.className = 'update-button';
                updateButton.addEventListener('click', function() {
                    const newName = nameInput.value;
                    const newQuantity = quantityInput.value;
                    const newImageFile = imageInput.files[0];
                    
                    if (newImageFile) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            products[index].image = e.target.result;
                            products[index].name = newName;
                            products[index].quantity = newQuantity;
                            saveProducts(products);
                        };
                        reader.readAsDataURL(newImageFile);
                    } else {
                        products[index].name = newName;
                        products[index].quantity = newQuantity;
                        saveProducts(products);
                    }
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
    })
    .catch(error => {
        console.error('Erro ao acessar o JSONBin:', error);
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

document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productImage = document.getElementById('productImage').files[0];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const productData = {
            name: productName,
            quantity: productQuantity,
            image: e.target.result
        };
        
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
            const products = data.record.products || [];
            products.push(productData);
            saveProducts(products);
        })
        .catch(error => {
            console.error('Erro ao acessar o JSONBin:', error);
        });
    };
    
    reader.readAsDataURL(productImage);
    
    document.getElementById('productForm').reset();
});

function saveProducts(products) {
    const apiKey = '$2a$10$9VBIUCivrI51dU493dOL/uL9ykaLOrUYobdHgyGPq9Pgbxrsh1cVO';
    const binId = '6786567be41b4d34e477446e';
    fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey
        },
        body: JSON.stringify({ products })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar os produtos');
        }
        return response.json();
    })
    .then(data => {
        console.log('Produtos salvos:', data);
        location.reload();
    })
    .catch(error => {
        console.error('Erro ao salvar os produtos:', error);
    });
}
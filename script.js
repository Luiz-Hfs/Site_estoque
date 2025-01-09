document.addEventListener('DOMContentLoaded', function() {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
        document.getElementById('productForm').style.display = 'none';
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('productList');
    
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
                        localStorage.setItem('products', JSON.stringify(products));
                        location.reload();
                    };
                    reader.readAsDataURL(newImageFile);
                } else {
                    products[index].name = newName;
                    products[index].quantity = newQuantity;
                    localStorage.setItem('products', JSON.stringify(products));
                    location.reload();
                }
            });
            productItem.appendChild(updateButton);
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir Produto';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function() {
                products.splice(index, 1);
                localStorage.setItem('products', JSON.stringify(products));
                location.reload();
            });
            productItem.appendChild(deleteButton);
        }
        
        productList.appendChild(productItem);
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
        
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));
        
        location.reload();
    };
    
    reader.readAsDataURL(productImage);
    
    document.getElementById('productForm').reset();
});
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
	
	
	//show notifcation function
function showNotification(message, color = "#4caf50") {
  // Create the notification element
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "50%";
  notification.style.backgroundColor = color;
  notification.style.color = "white";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "5px";
  notification.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  notification.style.zIndex = "1000";

  // Append the notification to the document
  document.body.appendChild(notification);

  // Automatically remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

  // Fetch product details from the external JSON file
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      const product = products.find(p => p.id == productId);
      if (product) {
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `$${product.price}`;
        document.getElementById('product-sizes').textContent = `Available Sizes: ${product.sizes.join(', ')}`;
        document.getElementById('product-stock').textContent = product.inStock ? 'In Stock' : 'Out of Stock';

        // Disable "Add to Cart" button if the product is out of stock
        const addToCartButton = document.getElementById('add-to-cart');
        if (!product.inStock) {
          addToCartButton.disabled = true;
          addToCartButton.textContent = 'Out of Stock';
        }

        // Add size buttons
        const sizeButtonsContainer = document.createElement('div');
        sizeButtonsContainer.className = 'size-buttons';
        sizeButtonsContainer.innerHTML = `
          ${product.sizes.map(size => `
            <button class="size-button" data-size="${size}">${size}</button>
          `).join('')}
        `;
        document.querySelector('.product-detail').insertBefore(sizeButtonsContainer, addToCartButton);

        // Add event listeners to size buttons
        sizeButtonsContainer.querySelectorAll('.size-button').forEach(button => {
          button.addEventListener('click', (event) => {
            // Highlight the selected size
            sizeButtonsContainer.querySelectorAll('.size-button').forEach(btn => {
              btn.classList.remove('selected');
            });
            event.target.classList.add('selected');

            // Enable the "Add to Cart" button if product is in stock
            if (product.inStock) {
              addToCartButton.disabled = false;
              addToCartButton.textContent = 'Add to Cart';
            }
          });
        });

        // Add to cart functionality
        addToCartButton.addEventListener('click', () => {
          if (!product.inStock) {
            showNotification('This product is out of stock.');
            return;
          }

          const selectedSizeButton = sizeButtonsContainer.querySelector('.size-button.selected');
          if (!selectedSizeButton) {
            showNotification('Please select a size before adding to cart.');
            return;
          }

          const selectedSize = selectedSizeButton.getAttribute('data-size');
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          const existingProduct = cart.find(p => p.id == productId && p.size === selectedSize);
          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            cart.push({ ...product, size: selectedSize, quantity: 1 });
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          showNotification(`${product.name} (Size: ${selectedSize}) added to cart!`);
        });
      }
    })
    .catch(error => console.error('Error fetching product details:', error));
});

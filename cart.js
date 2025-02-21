document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    // Function to display cart items
    function displayCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear existing cart items
        let totalPrice = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {

            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>Size: ${item.size}</p>
          <p>$${item.price} x ${item.quantity}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
                cartItemsContainer.appendChild(itemElement);
                totalPrice += item.price * item.quantity;
            });

            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        }
    }

    // Function to remove an item from the cart
    window.removeFromCart = function (index) {
        cart.splice(index, 1); // Remove the item at the specified index
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        displayCartItems(); // Refresh the cart display
    };

    // Initial display of cart items
    displayCartItems();
});

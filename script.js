// Fetch products from the external JSON file
let products = [];

// Load products from JSON
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    displayProducts(products); // Display all products initially
  })
  .catch((error) => console.error("Error fetching products:", error));

// Cart array to store added products
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to display products
function displayProducts(filteredProducts) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Clear existing products

  filteredProducts.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product";
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <p>${product.inStock ? "In Stock" : "Out of Stock"}</p>
      <div class="size-buttons" id="size-buttons-${product.id}">
        ${product.sizes
          .map(
            (size) =>
              `<button class="size-button" data-product-id="${product.id}" data-size="${size}">${size}</button>`
          )
          .join("")}
      </div>
      <button class="add-to-cart" id="add-to-cart-${product.id}" disabled>Add to Cart</button>
      <a href="product_detail.html?id=${product.id}" style="color: blue;">View Details</a>
    `;
    productContainer.appendChild(productElement);

    // Add event listeners for size buttons (inside the loop to ensure proper binding)
    const sizeButtons = document.querySelectorAll(`#size-buttons-${product.id} .size-button`);
    sizeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-product-id");
        const selectedSize = event.target.getAttribute("data-size");

        // Highlight the selected size
        document
          .querySelectorAll(`#size-buttons-${productId} .size-button`)
          .forEach((btn) => btn.classList.remove("selected"));
        event.target.classList.add("selected");

        // Enable the "Add to Cart" button
        const addToCartButton = document.getElementById(`add-to-cart-${productId}`);
        if (addToCartButton) {
          addToCartButton.disabled = false;
        }
      });
    });

    // Add event listeners for "Add to Cart" button (inside the loop to ensure proper binding)
    const addToCartButton = document.getElementById(`add-to-cart-${product.id}`);
    addToCartButton.addEventListener("click", (event) => {
      const selectedSizeButton = document.querySelector(
        `#size-buttons-${product.id} .size-button.selected`
      );

      if (!selectedSizeButton) {
        alert("Please select a size before adding to cart.");
        return;
      }

      const selectedSize = selectedSizeButton.getAttribute("data-size");
      addToCart(product.id, selectedSize);
    });
  });
}
//----------------------------------------------------------show notifcation function
// Function to show a temporary message
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

// Function to add a product to the cart
function addToCart(productId, selectedSize) {
  const product = products.find((p) => p.id === parseInt(productId));
  if (product && product.inStock) {
    const existingProduct = cart.find(
      (p) => p.id === product.id && p.size === selectedSize
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, size: selectedSize, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    showNotification(`${product.name} (Size: ${selectedSize}) added to cart!`);//--------------------------------------------------------------------------

    // Update cart icon count
    updateCartCount();

    // Reset the size buttons to unselected after adding to cart
    const sizeButtons = document.querySelectorAll(`#size-buttons-${product.id} .size-button`);
    sizeButtons.forEach((btn) => {
      btn.classList.remove('selected'); // Remove the 'selected' class
    });

    // Disable the "Add to Cart" button again
    const addToCartButton = document.getElementById(`add-to-cart-${product.id}`);
    if (addToCartButton) {
      addToCartButton.disabled = true;
    }
  } else {
    showNotification("This product is out of stock.","#f44336");
   
// Reset the size buttons to unselected when out of stock
    const sizeButtons = document.querySelectorAll(`#size-buttons-${product.id} .size-button`);
    sizeButtons.forEach((btn) => {
      btn.classList.remove('selected'); // Remove the 'selected' class if out of stock
    });

    // Optionally, disable the "Add to Cart" button if the product is out of stock
    const addToCartButton = document.getElementById(`add-to-cart-${product.id}`);
    if (addToCartButton) {
      addToCartButton.disabled = true;
    }
  }
}

// Function to update the cart count
function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartIcon = document.getElementById("cart-icon"); // Make sure you have an element with this ID
  const cartCountDisplay = cartIcon.querySelector(".cart-count") || document.createElement("span");
  
  cartCountDisplay.classList.add("cart-count");
  cartCountDisplay.textContent = cartCount > 0 ? cartCount : '';
  cartIcon.appendChild(cartCountDisplay);
}

// Initial cart count update
updateCartCount();

// Redirect to the cart page (if necessary)
document.getElementById("view-cart")?.addEventListener("click", () => {
  window.location.href = "cart.html";
});

// Filter functionality--------------------------------------------------------------

// Ensure filter section is hidden initially or shown depending on your requirement
const filterSection = document.getElementById('filter-section');
filterSection.style.display = 'none';  // Initially hidden, or set to 'flex' if you want it shown by default

// Toggle filter section visibility when the filter button is clicked
document.getElementById('filter-toggle').addEventListener('click', () => {
  // Check if the filter section is currently visible or not
  if (filterSection.style.display === 'none' || filterSection.style.display === '') {
    filterSection.style.display = 'flex';  // Show the filter section
  } else {
    filterSection.style.display = 'none';  // Hide the filter section
  }

  // Toggle active state on the filter button to show it's clicked
  const filterButton = document.getElementById('filter-toggle');
  filterButton.classList.toggle('active');  // Adds/removes the active class for style changes
});


// Apply filters when any filter changes
document.getElementById('category').addEventListener('change', () => {
  applyFilters();
});

document.getElementById('size').addEventListener('change', () => {
  applyFilters();
});

document.getElementById('price').addEventListener('input', () => {
  applyFilters();
});

// Apply filters based on selected values
function applyFilters() {
  const category = document.getElementById('category').value;
  const size = document.getElementById('size').value;
  const price = parseFloat(document.getElementById('price').value);

  const filteredProducts = products.filter(product => {
    return (category === 'all' || product.category === category) &&
           (size === 'all' || product.sizes.includes(parseInt(size))) &&
           (isNaN(price) || product.price <= price);
  });

  displayProducts(filteredProducts);
}
//function to search roduct
// Search functionality
function searchProducts() {
  const query = document.getElementById("search-bar").value.toLowerCase();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query)
  );
  displayProducts(filteredProducts);
}

document.getElementById('search-bar').addEventListener('input', searchProducts);

// Filter functionality
function applyFiltersAndSearch() {
  const category = document.getElementById('category').value;
  const size = document.getElementById('size').value;
  const price = parseFloat(document.getElementById('price').value);
  const query = document.getElementById("search-bar").value.toLowerCase();

  const filteredProducts = products.filter(product => {
    return (category === 'all' || product.category === category) &&
           (size === 'all' || product.sizes.includes(parseInt(size))) &&
           (isNaN(price) || product.price <= price) &&
           (product.name.toLowerCase().includes(query));
  });

  displayProducts(filteredProducts);
}

document.getElementById('category').addEventListener('change', applyFiltersAndSearch);
document.getElementById('size').addEventListener('change', applyFiltersAndSearch);
document.getElementById('price').addEventListener('input', applyFiltersAndSearch);
document.getElementById('search-bar').addEventListener('input', applyFiltersAndSearch);


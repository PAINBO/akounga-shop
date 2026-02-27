// ===============================
// AKOUNGA SHOP - APP JS GLOBAL
// ===============================

// Charger le panier depuis sessionStorage
let cart = JSON.parse(sessionStorage.getItem("akg_cart")) || [];

// ===============================
// DOCUMENT READY
// ===============================
document.addEventListener("DOMContentLoaded", function(){

    // -------------------------------
    // NAVIGATION MOBILE (HAMBURGER)
    // -------------------------------
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if(hamburger && navLinks){
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Charger le panier dès le chargement de la page
    updateCart();
});


// ===============================
// SAUVEGARDE SESSION
// ===============================
function saveCart(){
    sessionStorage.setItem("akg_cart", JSON.stringify(cart));
}


// ===============================
// AJOUT DE PRODUIT AU PANIER
// ===============================
function addToCart(name, price, image, code){

    // Vérifier si le produit existe déjà dans le panier
    let existing = cart.find(item => item.code === code);

    if(existing){
        existing.quantity++;
    } else {
        cart.push({name, price, image, code, quantity:1});
    }

    saveCart();
    updateCart();
}


// ===============================
// MISE À JOUR DU PANIER ET NOTIFICATIONS
// ===============================
function updateCart(){

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const menuNotification = document.getElementById("menu-notification");
    const cartNotification = document.getElementById("cart-notification");

    if(!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;
        totalQuantity += item.quantity;

        // Création de l'élément <li> pour chaque produit
        let li = document.createElement("li");
        li.innerHTML = `
            <img src="${item.image}" width="50" style="vertical-align:middle;border-radius:5px;">
            <strong>${item.name}</strong> (${item.code})<br>
            ${item.price} FCFA x ${item.quantity}
            <button onclick="increase(${index})">+</button>
            <button onclick="decrease(${index})">-</button>
            <button onclick="removeItem(${index})">❌</button>
            <br><br>
        `;
        cartItems.appendChild(li);
    });

    if(cartTotal) cartTotal.textContent = total;

    // 🔔 Notifications
    if(totalQuantity > 0){
        if(menuNotification){
            menuNotification.style.display = "flex";
            menuNotification.textContent = totalQuantity;
        }
        if(cartNotification){
            cartNotification.style.display = "flex";
            cartNotification.textContent = totalQuantity;
        }
    } else {
        if(menuNotification) menuNotification.style.display = "none";
        if(cartNotification) cartNotification.style.display = "none";
    }
}


// ===============================
// QUANTITÉS
// ===============================
function increase(index){
    cart[index].quantity++;
    saveCart();
    updateCart();
}

function decrease(index){
    if(cart[index].quantity > 1){
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    updateCart();
}

function removeItem(index){
    cart.splice(index, 1);
    saveCart();
    updateCart();
}


// ===============================
// PANIER SLIDE
// ===============================
function toggleCart(){
    const cartBox = document.getElementById("cart");
    if(!cartBox) return;

    cartBox.classList.toggle("active");

    if(cartBox.classList.contains("active")){
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
}


// ===============================
// VIDER LE PANIER
// ===============================
function clearCart(){
    cart = [];
    saveCart();
    updateCart();
}


// ===============================
// COMMANDE VIA WHATSAPP
// ===============================
function orderWhatsApp(){

    if(cart.length === 0){
        alert("Votre panier est vide !");
        return;
    }

    let total = 0;
    let message = "Bonjour AKOUNGA Shop,%0A%0AJe souhaite commander les produits suivants :%0A%0A";

    cart.forEach(item => {
        total += item.price * item.quantity;
        message += `Produit : ${item.name}%0A`;
        message += `Code : ${item.code}%0A`;
        message += `Quantité : ${item.quantity}%0A`;
        message += `Prix total : ${item.price * item.quantity} FCFA%0A%0A`;
    });

    message += `TOTAL GENERAL : ${total} FCFA`;

    const phone = "24166595089";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}


// ===============================
// RECHERCHE DYNAMIQUE DE PRODUITS
// ===============================
const searchInput = document.getElementById("search-input");
const produits = document.querySelectorAll(".produit");

if(searchInput){
    searchInput.addEventListener("input", () => {

        let value = searchInput.value.toLowerCase();

        produits.forEach(produit => {
            let title = produit.querySelector("h3").textContent.toLowerCase();

            produit.style.display = title.includes(value) ? "block" : "none";
        });
    });
}
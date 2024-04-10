const socketClient = io();


document.getElementById("addproduct").addEventListener("click", async (event) => {

    if (event.target.classList.contains("Btn-addproduct")) {
        event.preventDefault();

        const productContainer = event.target.closest(".liHome");

        const cartID = req.user.cart
        const quantityInput = productContainer.querySelector(".quantity-input");
        const quantityValue = quantityInput.value;


        const productId = event.target.getAttribute('data-productId');


        socketClient.emit("addProductCart", productId, quantityValue ,cartID);
    }
});

document.querySelectorAll(".card-price").forEach(node => {
    node.textContent = new Intl.NumberFormat('us-US', {
        currency: "usd",
        style: "currency"
    }).format(node.textContent)
})

document.querySelectorAll(".js-targetLink").forEach(e => {
   e.addEventListener("click", function () {
        window.open(this.dataset.href, "_blank")
   })
});

const $cart = document.querySelector("#cart");

// if ($cart){
//     $cart.addEventListener("click", (e) => {
//         if(e.target.classList.contains('js-remove')){
//             const id = e.target.id;
//
//             fetch(`/cart/remove/${id}`, {method: 'delete'}).then(res => res.json()).then(cart =>{
//
//             })
//         }
//     });
// }

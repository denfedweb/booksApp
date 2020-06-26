document.querySelectorAll(".card-price").forEach(node => {
    node.textContent = new Intl.NumberFormat('us-US', {
        currency: "usd",
        style: "currency"
    }).format(node.textContent)
})

const toDate = date =>{
    return new Intl.DateTimeFormat('usd-USD', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date))
}

document.querySelectorAll('.order-date').forEach(d =>{
   d.textContent = toDate(d.textContent)
});

document.querySelectorAll(".js-targetLink").forEach(e => {
   e.addEventListener("click", function () {
        window.open(this.dataset.href, "_blank")
   })
});

const $cart = document.querySelector("#cart");
const $btnQnt = document.querySelectorAll(".cart-countToggle");
var timeoutBtn = null;
if ($cart){
    $btnQnt.forEach((e)=>{
       e.addEventListener("click", function () {
            let form = this.parentNode;
            let qnt = form.querySelector(".cart-count");
            let finalQnt = +this.dataset.qnt + +qnt.value;
            if(finalQnt >= 1){
                qnt.value = finalQnt;
                clearTimeout(timeoutBtn);
                timeoutBtn = setTimeout(function () {
                    form.submit();
                }, 800);
            }
       });
    });
}


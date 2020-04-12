const path = require("path");
const fs = require("fs");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "cart.json"
    )

class Cart {
    static async add(book){
        const cart = await Cart.fetch();
        const idx = cart.books.findIndex(b => b.id === book.id);
        const candidate = cart.books[idx];
        if(candidate){
           candidate.count++
           cart.books[idx] = candidate
        } else {
            book.count = 1;
            cart.books.push(book);
        }

        cart.price += +book.price

        return await Cart.writeFile(cart);
    }

    static async fetch(){
        return new Promise((resolve, reject)=>{
            fs.readFile(p, "utf-8", (err, data)=>{
               if (err){
                   reject(err)
               } else {
                   resolve(JSON.parse(data));
               }
            })
        });
    }

    static async remove(id){
        const cart = await Cart.fetch();
        const idx = cart.books.findIndex(c => c.id === id);
        const book = cart.books[idx];
        cart.price -= book.price * book.count;
        cart.books = cart.books.filter(c => c.id !== id);

        return await Cart.writeFile(cart);
    }

    static async toggle(id, count){
        const cart = await Cart.fetch();
        const idx = cart.books.findIndex(c => c.id === id);
        cart.books[idx].count = count;
        return await Cart.writeFile(cart);
    }

    static async fullPrice(){
        const cart = await Cart.fetch();
        let price = 0;
        cart.books.forEach(book => {
            price += book.price * book.count;
        });
        console.log(price)
        cart.price = price;
        return await Cart.writeFile(cart);
    }

    static async writeFile(cart){
        return new Promise((resolve, reject)=>{
            fs.writeFile(
                p,
                JSON.stringify(cart),
                (err) => {
                    if(err) {
                        reject(err)
                    } else {
                        resolve();
                    }
                }
            )
        })
    }
}

module.exports = Cart;

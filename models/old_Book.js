const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");

class Book {
    constructor(title, price, image) {
        this.title = title;
        this.price = price;
        this.image = image;
        this.id = uuidv4();
    }

    getBook(){
        return {
           title: this.title,
           price: this.price,
           image: this.image,
           id: this.id
        };
    }

    async save(){
        const books = await Book.getAll();
        books.push(this.getBook());
        return new Promise((resolve, reject)=> {
            fs.writeFile(
                path.join(__dirname, "..", "data", 'books.json'),
                JSON.stringify(books),
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

    static getAll(){
        return new Promise((resolve, reject)=>{
            fs.readFile(
                path.join(__dirname, "..", "data", 'books.json'),
                "utf-8",
                (err, data)=>{
                    if(err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(data))
                    }

                }
            )
        })
    }

    static async getById(id){
        const book = await Book.getAll()
        return  book.find(b=>b.id === id)
    }

    static async updateBook(book){
        const books = await Book.getAll();

        const idx = books.findIndex(b => b.id === book.id)
        books[idx] = book;
        return new Promise((resolve, reject)=> {
            fs.writeFile(
                path.join(__dirname, "..", "data", 'books.json'),
                JSON.stringify(books),
                (err, data) => {
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

module.exports = Book;

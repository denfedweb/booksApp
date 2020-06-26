const keys = require("../keys/index");

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: "Registration success",
        html: `  
        <h1>Welcome!</h1>
        <p>Account created!!!</p>
        <a href="${keys.BASE_URL}">Books shop</a>
        `
    }
}

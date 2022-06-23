const cart = []
retrieveItems()
cart.forEach(item => displayItem(item))

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

// altTxt: "Photo d'un canapé gris, deux places"
// color: "Navy"
// id: "77711f0e466b4ddf953f677d30b0efc9"
// imageUrl: "http://localhost:3000/images/kanap06.jpeg"
// price: 999
// quantity: 2
// title: "Kanap Hélicé"

function retrieveItems() {
    const numberOfItems = localStorage.length
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || ""
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

function displayItem(item) {
    const article = makeArticle(item)
    const imageDiv = makeImage(item)
    article.appendChild(imageDiv)

    const cartItemContent = makeCartItemContent(item)
    article.appendChild(cartItemContent)
    displayArticle(article)

    displayTotalQuantity()
    displayTotalPrice()
}

function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

function displayArticle(article) {
    document.getElementById("cart__items").appendChild(article)
}

function makeImage(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    return div
}

function makeCartItemContent(item) {
    const cartItemContent = document.createElement("div")
    cartItemContent.classList.add("cart__item__content")

    const description = makeDescription(item)
    const settings = makeSettings(item)

    cartItemContent.appendChild(description)
    cartItemContent.appendChild(settings)
    return cartItemContent
}

function makeDescription(item) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.title
    const p = document.createElement("p")
    p.textContent = item.color
    const p2 = document.createElement("p")
    p2.textContent = item.price + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    return description
}

function makeSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings, item)
    return settings
}

function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")

    const p = document.createElement("p")
    p.textContent = "Qté : "
    quantity.appendChild(p)

    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("input", () => updatePriceAndQuantity(item.id, input.value, item))

    quantity.appendChild(input)
    settings.appendChild(quantity)

}

function updatePriceAndQuantity(id, newValue, item) {
    const itemUpdate = cart.find(item => item.id === id)
    itemUpdate.quantity = Number(newValue)
    item.quantity = itemUpdate.quantity // pb //
    displayTotalQuantity()
    displayTotalPrice()
    saveNewDataToLocalStorage(item)
}

function saveNewDataToLocalStorage(item) {
    const dataSave = JSON.stringify(item)
    localStorage.setItem(`${item.id}-${item.color}`, dataSave) // pb //
}

function addDeleteToSettings(settings, item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    
    div.addEventListener("click", () => deleteItem(item))

    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

function deleteItem(item) {
    const itemToDelete = cart.findIndex((product) => product.id === item.id && product.color === item.color)
    cart.splice(itemToDelete, 1)
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataToLocalStorage(item)
    deleteArticleFromPage(item)
}

function deleteDataToLocalStorage(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    )
    articleToDelete.remove()
}

function displayTotalQuantity() {
    let total = 0
    const totalQuantity = document.getElementById("totalQuantity")
    cart.forEach(item => total = total + item.quantity)
    totalQuantity.textContent = total
}

function displayTotalPrice() {
    let total = 0
    const totalPrice = document.getElementById("totalPrice")
    cart.forEach(item => {
        const totalItemPrice = item.price * item.quantity
        total = total + totalItemPrice
    })
    totalPrice.textContent = total
}

function submitForm(e) {
    e.preventDefault()
    if (cart.length === 0) {
        alert("Veuillez remplir le panier.")
        return
    }

    if (validateForm()) return
    if (validateEmail()) return

    const body = makeRequestBody()
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId
            window.location.href = "confirmation.html" + "?orderId=" + orderId
            return console.log(data)
        })
        .catch((err) => console.log(err))
}

function validateForm() {
    const form = document.querySelector(".cart__order__form")
    const inputs = document.querySelectorAll("input")
    inputs.forEach((input) => {
        if (input.value === "") {
            alert("Veuillez remplir tous les champs demandé.")
            return true
        }
        return false
    })
}

function validateEmail() {
    const email = document.querySelector("#email").value
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
    if (regex.test(email) === false) {
        alert("Veuillez rensseigner un email valide.")
        return true
    }
    return false
}

function makeRequestBody() {
    const form = document.querySelector(".cart__order__form")
    const firstName = form.elements.firstName.value
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value
    
    const body = { 
      contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
        },
        products: getIdFromLocalStorage()
    }
    return body
}

function getIdFromLocalStorage() {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; i++) {
        const key = localStorage.key(i)
        const id = key.split("-")[0]
        ids.push(id)
    }
    return ids
}
const cart = []
retrieveItems()
cart.forEach(item => displayItem(item)) // Pour chaque éléments dans le cart, displayItem

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

// loop qui recupere les éléments dans le localstorage
function retrieveItems() {
    const numberOfItems = localStorage.length
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || ""
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

// Fabrication global pour chaque item
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

// fabrication article
function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

// affichage article dans l'id cart__items
function displayArticle(article) {
    document.getElementById("cart__items").appendChild(article)
}

// fabrication image
function makeImage(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    return div
}

// fabrication global item content
function makeCartItemContent(item) {
    const cartItemContent = document.createElement("div")
    cartItemContent.classList.add("cart__item__content")

    const description = makeDescription(item)
    const settings = makeSettings(item)

    cartItemContent.appendChild(description)
    cartItemContent.appendChild(settings)
    return cartItemContent
}

// fabrication description
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

// fabrication global content settings
function makeSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings, item)
    return settings
}

// fabrication de l'input ou l'on pourra modifier la quantitée
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

// update du prix selon la quantitée
function updatePriceAndQuantity(id, newValue, item) {
    const itemUpdate = cart.find(item => item.id === id)
    itemUpdate.quantity = Number(newValue)
    item.quantity = itemUpdate.quantity
    displayTotalQuantity()
    displayTotalPrice()
    saveNewDataToLocalStorage(item)
}

// Sauvegarde des nouvelles données dans le local storage
function saveNewDataToLocalStorage(item) {
    const dataSave = JSON.stringify(item)
    localStorage.setItem(`${item.id}-${item.color}`, dataSave)
}

// fabrication du p "Supprimer" avec ecoute lors d'un clic
function addDeleteToSettings(settings, item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    
    div.addEventListener("click", () => deleteItem(item))

    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

// Suppression global lors du clic 
function deleteItem(item) {
    const itemToDelete = cart.findIndex((product) => product.id === item.id && product.color === item.color)
    cart.splice(itemToDelete, 1)
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataToLocalStorage(item)
    deleteArticleFromPage(item)
}

// Supprime du localstorage
function deleteDataToLocalStorage(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

// Supprime de la page
function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    )
    articleToDelete.remove()
}

// Affichage de la quantitée global
function displayTotalQuantity() {
    let total = 0
    const totalQuantity = document.getElementById("totalQuantity")
    cart.forEach(item => total = total + item.quantity)
    totalQuantity.textContent = total
}

// Affichage du prix global
function displayTotalPrice() {
    let total = 0
    const totalPrice = document.getElementById("totalPrice")
    cart.forEach(item => {
        const totalItemPrice = item.price * item.quantity
        total = total + totalItemPrice
    })
    totalPrice.textContent = total
}

// fonction pour soumettre le formulaire
function submitForm(e) {
    e.preventDefault()
    if (cart.length === 0) {
        alert("Veuillez remplir le panier.") // Si le panier est vide pop up d'alerte
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
        })
        .catch((err) => console.error(err))
}

// fonction de validation du formulaire
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

// fonction de validation de l'email
function validateEmail() {
    const email = document.querySelector("#email").value
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
    if (regex.test(email) === false) {
        alert("Veuillez rensseigner un email valide.")
        return true
    }
    return false
}

// Récupère les éléments renseigné
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

// récupère l'id du localStorage
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
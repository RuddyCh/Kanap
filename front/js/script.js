// Récupération des données global
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then((data) => addProducts(data))

// Function récupération des données et creation article
function addProducts(canaps) {
    canaps.forEach((canap) => {
        //const _id = canap._id
        //const imageUrl = canap.imageUrl
        //const altTxt = canap.altTxt
        //const name = canap.name
        //const description = canap.description
        const {_id, imageUrl, altTxt, name, description} = canap
        const anchor = makeAnchor(_id)
        const article = document.createElement("article")
        const image = makeImage(imageUrl, altTxt)
        const h3 = makeH3(name)
        const p = makeP(description)

        appendElementsToArticle(article, image, h3, p)
        appendArticleToAnchor(anchor, article)
    })
}

// installation des éléments dans l'article
function appendElementsToArticle(article, image, h3, p) {
    article.appendChild(image)
    article.appendChild(h3)
    article.appendChild(p)
}

// creation du lien de redirection vers product + id
function makeAnchor(id) {
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id
    return anchor
}

// insertion de l'article dans le a
function appendArticleToAnchor(anchor, article) {
    const items = document.getElementById("items")
    if (items != null) {
        items.appendChild(anchor)
        anchor.appendChild(article)
    }
}

// creation de l'élément img
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

// création du H3
function makeH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3
}

// creation du paragraphe
function makeP(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p
}
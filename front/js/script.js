fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then((data) => addProducts(data))

function addProducts(data) {
    const imageUrl = data[0].imageUrl

    let anchor = document.createElement("a")
    anchor.href = imageUrl
    anchor.text = "Test"

    const items = document.getElementById("items")
    items.appendChild(anchor)
}
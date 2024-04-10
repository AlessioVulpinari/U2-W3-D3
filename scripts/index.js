let shop = []

const fetchBooks = () => {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((response) => {
      console.log(response)

      if (response.ok) {
        return response.json()
      } else {
        if (response.status === 400) {
          throw new Error("Bad Request")
        }
        if (response.status === 401) {
          throw new Error("Unauthorized")
        }
        if (response.status === 403) {
          throw new Error("Forbidden")
        }
        if (response.status === 404) {
          throw new Error("Not Found")
        }
        if (response.status === 500) {
          throw new Error("Server Error")
        }

        throw new Error("Generic Fetch Error")
      }
    })
    .then((booksData) => {
      console.log(booksData)

      const row = document.getElementById("cardContainer")

      booksData.forEach((book) => {
        const col = document.createElement("col")
        col.classList.add("col")

        const card = document.createElement("div")
        card.classList.add("card")

        const imgContainer = document.createElement("div")

        const img = document.createElement("img")
        img.src = book.img
        img.classList.add("card-img-top")

        const cardBody = document.createElement("div")
        cardBody.classList.add(
          "card-body",
          "d-flex",
          "flex-column",
          "justify-content-between"
        )

        const title = document.createElement("p")
        title.classList.add("card-text")
        title.innerText = "Titolo: " + book.title

        const price = document.createElement("p")
        price.classList.add("card-text")
        price.innerText = "Prezzo:" + book.price

        const btnContainer = document.createElement("div")
        btnContainer.classList.add("d-flex", "justify-content-between")

        const btnBuy = document.createElement("button")
        btnBuy.classList.add("btn", "btn-success", "btn-sm")
        btnBuy.addEventListener("click", () =>
          handleBuyBtn(book.title, book.price, book.asin)
        )
        btnBuy.innerText = "Compra Ora"

        const btnDiscard = document.createElement("button")
        btnDiscard.classList.add("btn", "btn-danger", "btn-sm")
        btnDiscard.addEventListener("click", handleDiscardBtn)
        btnDiscard.innerText = "Scarta"

        imgContainer.appendChild(img)
        card.appendChild(imgContainer)
        cardBody.appendChild(title)
        cardBody.appendChild(price)
        btnContainer.appendChild(btnBuy)
        btnContainer.appendChild(btnDiscard)
        cardBody.appendChild(btnContainer)
        card.appendChild(cardBody)
        col.appendChild(card)
        row.appendChild(col)
      })
    })
    .catch((error) => console.log(error))
}

const handleDiscardBtn = function (event) {
  event.target.closest(".col").remove()
}

const removeItems = function (event, asin) {
  const index = shop.findIndex((obj) => obj.asin === asin)

  if (index != -1) {
    shop.splice(index, 1)
    window.localStorage.setItem("shop-memory", JSON.stringify(shop))
  }

  event.target.closest(".itemContainer").remove()
}

const handleBuyBtn = function (title, price, asin) {
  const product = { title, price, asin }

  shop.push(product)

  window.localStorage.setItem("shop-memory", JSON.stringify(shop))

  addToCart(product)
}

const addToCart = function (obj) {
  const cart = document.getElementById("cartContainer")
  const itemContainer = document.createElement("div")
  itemContainer.classList.add("itemContainer")
  const item = document.createElement("p")

  const btnDiscard = document.createElement("button")
  btnDiscard.classList.add("btn", "btn-danger", "btn-sm")
  btnDiscard.addEventListener("click", (event) => removeItems(event, obj.asin))
  btnDiscard.innerText = "Scarta"

  item.innerText = obj.title + " " + obj.price

  itemContainer.appendChild(item)
  itemContainer.appendChild(btnDiscard)
  cart.appendChild(itemContainer)
}

window.onload = () => {
  fetchBooks()

  if (window.localStorage.getItem("shop-memory")) {
    shop = JSON.parse(window.localStorage.getItem("shop-memory"))
    shop.forEach((item) => addToCart(item))
  }
}

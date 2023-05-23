import { nanoid } from 'nanoid';

/* модалка basket */
const modal = document.querySelector('#modal-basket'); // получение доступа к модалке
const openModal = document.querySelector('#open-basket'); // доступ к кнопке
const closeModal = document.querySelector('.close-button'); // доступ к кнопке Close Modal внутри модалки


openModal.addEventListener("click", () => {
  modal.showModal();
})

closeModal.addEventListener("click", () => {
  modal.close();
});


/* basket */
const productList = document.querySelector('.products-list'); // контейнер для отрисовки товаров
const basketContainer = document.querySelector('.basket-container'); // родитель добавленных товаров
const basketList = document.querySelector('.basket-container__list'); // вставка добавленных в корзину эл-тов
const basketTotalValue = document.querySelector('.basket__total-value'); // итоговое значение в корзине
const basketCountInfo = document.querySelector('#basket-count__info'); // кол-во товаров (в кнопке basket)

let PRODUCT_ID = 1; // глобальный id товара

init();


// инициализация функций при загрузке страницы
function init() {

  // подгрузка данных при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    loadJSON();
    loadCart();
  })

  productList.addEventListener('click', purchaseProduct); // добавление товара в корзину

  basketList.addEventListener('click', deleteProduct); // удаление товара из корзины
}


// функция подгрузки данных
function loadJSON() {
  fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(data => {
      let html = ``;
      data.forEach(product => {
        html += `
          <div class="main-card">
            <div class="card-image">
              <img src="${product?.imgSrc}" alt="image">
      
              <div class="card-wishlist">
                <div class="wishlist-rating">
        
                  <div class="rating-img">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16 6.12414H9.89333L8 0L6.10667 6.12414H0L4.93333 9.90345L3.06667 16L8 12.2207L12.9333 16L11.04 9.87586L16 6.12414Z"
                        fill="#FFCE31" />
                    </svg>
                  </div>
        
                  <span class="rating-amount">${product?.rating}</span>
                </div>
        
                <svg class="whishlist-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                  </path>
                </svg>
              </div>
            </div>
      
            <h3 class="card-name">${product?.name}</h3>
      
            <p class="card-category">${product?.category}</p>

            <p class="card-price">${product?.price}</p>
      
            <button class="btn btn-primary">Add to cart</button>
          </div>
        `
      })
      productList.innerHTML = html;
    })
    .catch(error => {
      console.log(error);
    })
}


// функция добавления товара
function purchaseProduct(e) {
  if (e.target.classList.contains('btn-primary')) {
    const product = e.target.parentElement; // получаем доступ к родительскому тегу карточки

    geProductInfo(product); // извлечение данных отдельной карточки
  }
}

// функция извлечения данных отдельной карточки
function geProductInfo(product) {
  const productInfo = {
    id: PRODUCT_ID,
    imgSrc: product.querySelector('.card-image img').src,
    name: product.querySelector('.card-name').textContent,
    category: product.querySelector('.card-category').textContent,
    price: product.querySelector('.card-price').textContent,
  }

  console.log(productInfo);

  addToBasketList(productInfo); // передача данных в корзину товара
  saveProductInStorage(productInfo);
}


// добавление товара в DOM корзины
function addToBasketList(product) {
  const basketItem = document.createElement('div');

  basketItem.classList.add('basket-item');

  basketItem.setAttribute('data-id', `${product.id}`);

  basketItem.innerHTML = `
    <div class="item-card">
      <div class="item-image">
        <img src="${product?.imgSrc}" alt="product image">
      </div>
      <div class="inline-flex flex-column"> 
        <h3 class="item-name">${product?.name}</h3>
        <p class="item-category">${product?.category}</p>
        <div class="counter">
          <label class="counter__field">
            <input id="counter__input" type="text" value="1" maxlength="3" readonly>
            <span class="counter__text">шт</span>
          </label>
          <div class="counter__btns">
            <button class="counter__btn counter__btn--up" aria-label="Увеличить количество">
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5">
                <g>
                  <g>
                    <path d="M3.904-.035L-.003 3.151 1.02 5.03l2.988-2.387 2.988 2.387 1.022-1.88-3.89-3.186z"></path>
                  </g>
                </g>
              </svg>
            </button>
            <button disabled class="counter__btn counter__btn--down" aria-label="Уменьшить количество">
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5">
                <g>
                  <g>
                    <path d="M3.904 5.003L-.003 1.818 1.02-.062l2.988 2.386L6.995-.063l1.022 1.88-3.89 3.186z"></path>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
        <button id="close-button" class="button close-button">
          Remove
          <img src="images/delete-icon.svg" alt="delete-icon">
        </button>
      </div>
      <div class="inline-flex">
        <p class="item-price">${product?.price}</p>
      </div>
    </div>
  `;

  basketList.appendChild(basketItem); // вставляем отдельную карточку в узел родителя
}


// удаление товара из DOM корзины
function deleteProduct(e) {
  let basketItem;
  console.dir(e.target);
  if (e.target.tagName === "BUTTON") {
    basketItem = e.target.parentElement.parentElement.parentElement; // получение доступа к родителю всей карточки
    basketItem.remove();
  } else if (e.target.tagName === "IMG") {
    basketItem = e.target.parentElement.parentElement.parentElement; // получение доступа к родителю всей карточки
    basketItem.remove();
  }
}


// сохранение товара в localStorage
function saveProductInStorage(item) {
  let products = getProductFromStorage(); // получение данных из хранилища
  products.push(item);
  localStorage.setItem('products', JSON.stringify(products));

  updateCartInfo(); // обновление информации в корзине
}


// получение товара из хранилища
function getProductFromStorage() {
  return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : []; // показываем [], если ничего нет
}


// загрузка данных товара 
function loadCart() {
  let products = getProductFromStorage();
  if (products.length < 1) {
    PRODUCT_ID = 1; // если ничего нет в хранилище
  } else {
    PRODUCT_ID = products[products.length - 1].id;
    PRODUCT_ID++;
  }

  products.forEach(product => addToBasketList(product));

  updateCartInfo(); // счетчик в корзине
}


// счетчик в корзине
function updateCartInfo() {
  let cartInfo = findcartInfo(); // получение данных из модалки о кол-ве и итоговой цене товаров

  console.log(cartInfo);

  basketCountInfo.textContent = cartInfo.productCount;
  basketTotalValue.textContent = cartInfo.total; // передаем данные в модалку (заголовок total)
}


// итоговая функция (total) и кол-во товаров (в модалке)
function findcartInfo() {
  let products = getProductFromStorage();

  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.price.substring(1));
    return acc += price;
  }, 0);

  return {
    total: total.toFixed(2),
    productCount: products.length,
  }

}




// /* skeleton */
// const allSkeletons = document.querySelectorAll('.skeleton');

// window.addEventListener('load', () => {
//   allSkeletons.forEach(element => {
//     element.classList.remove('skeleton');
//   })
// })
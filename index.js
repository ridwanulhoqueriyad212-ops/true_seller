import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    push,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyCq2a6RHcI9EU4xA-j-nHwUVsUkqnRb06E",

    authDomain:
        "true-seller-5f0e7.firebaseapp.com",

    databaseURL:
        "https://true-seller-5f0e7-default-rtdb.firebaseio.com",

    projectId:
        "true-seller-5f0e7",

    storageBucket:
        "true-seller-5f0e7.firebasestorage.app",

    messagingSenderId:
        "160519174020",

    appId:
        "1:160519174020:web:078802af43a697f2604fd1"

};


/* =========================================
   INITIALIZE
========================================= */

const app =
    initializeApp(firebaseConfig);

const db =
    getDatabase(app);


/* =========================================
   PAYMENT SETTINGS
========================================= */

const BKASH_NUMBER =
    "8801774187877";

const NAGAD_NUMBER =
    "8801717257131";

const WHATSAPP_NUMBER =
    "8801890355650";


/* =========================================
   DOM
========================================= */

const productGrid =
    document.getElementById(
        "productGrid"
    );

const productCount =
    document.getElementById(
        "productCount"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );


/* SEARCH */

const productSearch =
    document.getElementById(
        "productSearch"
    );

const clearSearch =
    document.getElementById(
        "clearSearch"
    );


/* ORDER */

const orderModal =
    document.getElementById(
        "orderModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const orderForm =
    document.getElementById(
        "orderForm"
    );


/* SUCCESS */

const successBox =
    document.getElementById(
        "successBox"
    );

const successClose =
    document.getElementById(
        "successClose"
    );


/* WHATSAPP */

const whatsappBtn =
    document.getElementById(
        "whatsappBtn"
    );


/* PAYMENT */

const bkashPaymentBox =
    document.getElementById(
        "bkashPaymentBox"
    );

const nagadPaymentBox =
    document.getElementById(
        "nagadPaymentBox"
    );

const bkashNumber =
    document.getElementById(
        "bkashNumber"
    );

const nagadNumber =
    document.getElementById(
        "nagadNumber"
    );

const bkashTrxId =
    document.getElementById(
        "bkashTrxId"
    );

const nagadTrxId =
    document.getElementById(
        "nagadTrxId"
    );


/* SELECTED PRODUCT */

const selectedProductId =
    document.getElementById(
        "selectedProductId"
    );

const selectedProductName =
    document.getElementById(
        "selectedProductName"
    );

const selectedProductPrice =
    document.getElementById(
        "selectedProductPrice"
    );

const selectedProductImage =
    document.getElementById(
        "selectedProductImage"
    );


/* =========================================
   HYBRID CHAT DOM
========================================= */

const hybridChatButton =
    document.getElementById(
        "hybridChatButton"
    );

const hybridChatModal =
    document.getElementById(
        "hybridChatModal"
    );

const hybridChatClose =
    document.getElementById(
        "hybridChatClose"
    );

const chatChoiceScreen =
    document.getElementById(
        "chatChoiceScreen"
    );

const aiAssistantScreen =
    document.getElementById(
        "aiAssistantScreen"
    );

const adminHelpScreen =
    document.getElementById(
        "adminHelpScreen"
    );

const openAiAssistant =
    document.getElementById(
        "openAiAssistant"
    );

const openAdminHelp =
    document.getElementById(
        "openAdminHelp"
    );

const aiMessages =
    document.getElementById(
        "aiMessages"
    );

const aiChatForm =
    document.getElementById(
        "aiChatForm"
    );

const aiChatInput =
    document.getElementById(
        "aiChatInput"
    );


/* =========================================
   DATA
========================================= */

let products = {};

let searchTerm = "";


/* =========================================
   PAYMENT NUMBERS
========================================= */

if (bkashNumber) {

    bkashNumber.textContent =
        BKASH_NUMBER;

}


if (nagadNumber) {

    nagadNumber.textContent =
        NAGAD_NUMBER;

}


/* =========================================
   WHATSAPP
========================================= */

if (whatsappBtn) {

    whatsappBtn.href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${
            encodeURIComponent(
                "Assalamu Alaikum, I need support from True Seller."
            )
        }`;

}


/* =========================================
   LOAD PRODUCTS
========================================= */

const productsRef =
    ref(
        db,
        "products"
    );


onValue(
    productsRef,
    (snapshot) => {

        products =
            snapshot.val() || {};

        renderProducts();

    },

    (error) => {

        console.error(
            "Products loading error:",
            error
        );


        if (productGrid) {

            productGrid.innerHTML = `
                <div class="empty-state"
                     style="display:block">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to Load Products
                    </h3>

                    <p>
                        Please try again later.
                    </p>

                </div>
            `;

        }

    }
);


/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts() {

    if (!productGrid) return;


    productGrid.innerHTML =
        "";


    const productEntries =
        Object.entries(
            products
        );


    const search =
        searchTerm
            .trim()
            .toLowerCase();


    /* SEARCH FILTER */

    const filteredProducts =
        productEntries.filter(
            ([id, product]) => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                return name.includes(
                    search
                );

            }
        );


    /* COUNT */

    if (productCount) {

        productCount.textContent =
            filteredProducts.length;

    }


    /* EMPTY */

    if (
        filteredProducts.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";


            const title =
                emptyState.querySelector(
                    "h3"
                );


            const text =
                emptyState.querySelector(
                    "p"
                );


            if (search) {

                if (title) {

                    title.textContent =
                        "No Products Found";

                }


                if (text) {

                    text.textContent =
                        `No product matches "${searchTerm}".`;

                }

            } else {

                if (title) {

                    title.textContent =
                        "No Products Found";

                }


                if (text) {

                    text.textContent =
                        "We couldn't find any product here.";

                }

            }

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    /* PRODUCT CARDS */

    filteredProducts.forEach(
        ([id, product]) => {

            const stock =
                Number(
                    product.stock || 0
                );


            const price =
                Number(
                    product.price || 0
                );


            const image =
                product.imageUrl ||
                product.image ||
                "";


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            const imageHTML =
                image
                    ? `
                        <img
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(
                                product.name ||
                                "Product"
                            )}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div
                            style="
                                width:100%;
                                height:100%;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                color:#667085;
                                font-size:35px;
                            "
                        >
                            🛍️
                        </div>
                    `;


            card.innerHTML = `

                <div class="product-image">

                    ${imageHTML}

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeHtml(
                            product.name ||
                            "Unnamed Product"
                        )}
                    </h3>


                    <div class="product-price">

                        ৳${price.toLocaleString()}

                    </div>


                    <div class="product-stock">

                        ${
                            stock > 0
                                ? `${stock} available`
                                : "Out of stock"
                        }

                    </div>


                    <button
                        class="order-button"
                        data-product-id="${escapeHtml(id)}"
                        ${stock <= 0 ? "disabled" : ""}
                    >

                        ${
                            stock > 0
                                ? "Order Now"
                                : "Out of Stock"
                        }

                    </button>

                </div>

            `;


            const orderButton =
                card.querySelector(
                    ".order-button"
                );


            if (
                orderButton &&
                stock > 0
            ) {

                orderButton.addEventListener(
                    "click",
                    () => {

                        openOrderModal(
                            id,
                            product
                        );

                    }
                );

            }


            productGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================
   SEARCH
========================================= */

if (productSearch) {

    productSearch.addEventListener(
        "input",
        () => {

            searchTerm =
                productSearch.value;


            if (clearSearch) {

                clearSearch.style.display =
                    searchTerm.trim()
                        ? "flex"
                        : "none";

            }


            renderProducts();

        }
    );

}


/* =========================================
   CLEAR SEARCH
========================================= */

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            if (productSearch) {

                productSearch.value =
                    "";

                productSearch.focus();

            }


            searchTerm =
                "";


            clearSearch.style.display =
                "none";


            renderProducts();

        }
    );

}


/* =========================================
   OPEN ORDER MODAL
========================================= */

function openOrderModal(
    productId,
    product
) {

    const stock =
        Number(
            product.stock || 0
        );


    if (stock <= 0) {

        alert(
            "Sorry, this product is out of stock."
        );

        return;

    }


    if (orderForm) {

        orderForm.reset();

    }


    if (selectedProductId) {

        selectedProductId.value =
            productId;

    }


    if (selectedProductName) {

        selectedProductName.textContent =
            product.name ||
            "Product";

    }


    if (selectedProductPrice) {

        selectedProductPrice.textContent =
            Number(
                product.price || 0
            ).toLocaleString();

    }


    if (selectedProductImage) {

        selectedProductImage.src =
            product.imageUrl ||
            product.image ||
            "";

        selectedProductImage.alt =
            product.name ||
            "Product";

    }


    const codRadio =
        document.querySelector(
            'input[name="paymentMethod"][value="COD"]'
        );


    if (codRadio) {

        codRadio.checked =
            true;

    }


    hidePaymentBoxes();


    if (orderModal) {

        orderModal.classList.add(
            "active"
        );

    }


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeOrderModal() {

    if (orderModal) {

        orderModal.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeOrderModal
    );

}


if (orderModal) {

    orderModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                orderModal
            ) {

                closeOrderModal();

            }

        }
    );

}


/* =========================================
   PAYMENT CHANGE
========================================= */

document
    .querySelectorAll(
        'input[name="paymentMethod"]'
    )
    .forEach(
        (radio) => {

            radio.addEventListener(
                "change",
                () => {

                    updatePaymentBoxes(
                        radio.value
                    );

                }
            );

        }
    );


function updatePaymentBoxes(
    method
) {

    hidePaymentBoxes();


    if (
        method === "bKash" &&
        bkashPaymentBox
    ) {

        bkashPaymentBox.style.display =
            "block";

    }


    if (
        method === "Nagad" &&
        nagadPaymentBox
    ) {

        nagadPaymentBox.style.display =
            "block";

    }

}


function hidePaymentBoxes() {

    if (bkashPaymentBox) {

        bkashPaymentBox.style.display =
            "none";

    }


    if (nagadPaymentBox) {

        nagadPaymentBox.style.display =
            "none";

    }

}


/* =========================================
   ORDER SUBMIT
========================================= */

if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const productId =
                selectedProductId
                    ? selectedProductId.value
                    : "";


            const product =
                products[productId];


            if (!product) {

                alert(
                    "Product not found. Please refresh the page."
                );

                return;

            }


            const stock =
                Number(
                    product.stock || 0
                );


            if (stock <= 0) {

                alert(
                    "Sorry, this product is out of stock."
                );

                closeOrderModal();

                return;

            }


            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "customerAddress"
                    )
                    .value
                    .trim();


            const paymentMethod =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                )?.value;


            if (
                !customerName ||
                !phone ||
                !address ||
                !paymentMethod
            ) {

                alert(
                    "Please fill in all required information."
                );

                return;

            }


            let paymentNumber =
                "";

            let trxId =
                "";


            if (
                paymentMethod ===
                "bKash"
            ) {

                paymentNumber =
                    BKASH_NUMBER;


                trxId =
                    bkashTrxId
                        ? bkashTrxId.value.trim()
                        : "";


                if (!trxId) {

                    alert(
                        "Please enter your bKash TrxID."
                    );

                    if (bkashTrxId) {

                        bkashTrxId.focus();

                    }

                    return;

                }

            }


            if (
                paymentMethod ===
                "Nagad"
            ) {

                paymentNumber =
                    NAGAD_NUMBER;


                trxId =
                    nagadTrxId
                        ? nagadTrxId.value.trim()
                        : "";


                if (!trxId) {

                    alert(
                        "Please enter your Nagad TrxID."
                    );

                    if (nagadTrxId) {

                        nagadTrxId.focus();

                    }

                    return;

                }

            }


            const orderButton =
                orderForm.querySelector(
                    ".place-order-button"
                );


            const originalHTML =
                orderButton
                    ? orderButton.innerHTML
                    : "";


            if (orderButton) {

                orderButton.disabled =
                    true;

                orderButton.innerHTML =
                    "Placing Order... ⏳";

            }


            try {

                const ordersRef =
                    ref(
                        db,
                        "orders"
                    );


                const newOrderRef =
                    push(
                        ordersRef
                    );


                const orderData = {

                    id:
                        newOrderRef.key,

                    productId:
                        productId,

                    productName:
                        product.name ||
                        "Product",

                    price:
                        Number(
                            product.price ||
                            0
                        ),

                    customerName:
                        customerName,

                    phone:
                        phone,

                    address:
                        address,

                    paymentMethod:
                        paymentMethod,

                    paymentNumber:
                        paymentNumber,

                    trxId:
                        trxId,

                    status:
                        "Pending",

                    createdAt:
                        Date.now()

                };


                await update(
                    newOrderRef,
                    orderData
                );


                closeOrderModal();


                if (successBox) {

                    successBox.classList.add(
                        "active"
                    );

                }


                orderForm.reset();

                hidePaymentBoxes();


            } catch (error) {

                console.error(
                    "Order error:",
                    error
                );


                alert(
                    "Order could not be placed. Please try again."
                );


            } finally {

                if (orderButton) {

                    orderButton.disabled =
                        false;

                    orderButton.innerHTML =
                        originalHTML;

                }

            }

        }
    );

}


/* =========================================
   SUCCESS CLOSE
========================================= */

if (successClose) {

    successClose.addEventListener(
        "click",
        () => {

            if (successBox) {

                successBox.classList.remove(
                    "active"
                );

            }

        }
    );

}


if (successBox) {

    successBox.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                successBox
            ) {

                successBox.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================
   TRUE SELLER HYBRID CHAT
========================================= */


/* -----------------------------------------
   OPEN / CLOSE CHAT
----------------------------------------- */

function openHybridChat() {

    if (!hybridChatModal) return;

    hybridChatModal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


function closeHybridChat() {

    if (!hybridChatModal) return;

    hybridChatModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


if (hybridChatButton) {

    hybridChatButton.addEventListener(
        "click",
        openHybridChat
    );

}


if (hybridChatClose) {

    hybridChatClose.addEventListener(
        "click",
        closeHybridChat
    );

}


if (hybridChatModal) {

    hybridChatModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                hybridChatModal
            ) {

                closeHybridChat();

            }

        }
    );

}


/* -----------------------------------------
   CHAT SCREEN SWITCHING
----------------------------------------- */

function showChatScreen(
    screen
) {

    if (chatChoiceScreen) {

        chatChoiceScreen.classList.remove(
            "active"
        );

    }


    if (aiAssistantScreen) {

        aiAssistantScreen.classList.remove(
            "active"
        );

    }


    if (adminHelpScreen) {

        adminHelpScreen.classList.remove(
            "active"
        );

    }


    if (screen === "choice") {

        if (chatChoiceScreen) {

            chatChoiceScreen.classList.add(
                "active"
            );

        }

    }


    if (screen === "ai") {

        if (aiAssistantScreen) {

            aiAssistantScreen.classList.add(
                "active"
            );

        }

    }


    if (screen === "admin") {

        if (adminHelpScreen) {

            adminHelpScreen.classList.add(
                "active"
            );

        }

    }

}


/* -----------------------------------------
   AI BUTTON
----------------------------------------- */

if (openAiAssistant) {

    openAiAssistant.addEventListener(
        "click",
        () => {

            showChatScreen(
                "ai"
            );


            setTimeout(
                () => {

                    if (aiChatInput) {

                        aiChatInput.focus();

                    }

                },
                100
            );

        }
    );

}


/* -----------------------------------------
   ADMIN BUTTON
----------------------------------------- */

if (openAdminHelp) {

    openAdminHelp.addEventListener(
        "click",
        () => {

            showChatScreen(
                "admin"
            );

        }
    );

}


/* -----------------------------------------
   BACK BUTTONS
----------------------------------------- */

document
    .querySelectorAll(
        ".chat-back-button"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    showChatScreen(
                        "choice"
                    );

                }
            );

        }
    );


/* -----------------------------------------
   AI MESSAGE
----------------------------------------- */

function addAiMessage(
    text,
    type
) {

    if (!aiMessages) return;


    const message =
        document.createElement(
            "div"
        );


    message.className =
        `ai-message ${
            type === "user"
                ? "user-message"
                : "bot-message"
        }`;


    message.textContent =
        text;


    aiMessages.appendChild(
        message
    );


    aiMessages.scrollTop =
        aiMessages.scrollHeight;

}


/* -----------------------------------------
   LANGUAGE DETECTION
----------------------------------------- */

function detectChatLanguage(
    text
) {

    const value =
        String(text || "").trim();


    if (/[\u0980-\u09FF]/.test(value)) {

        return "bangla";

    }


    const lower =
        value.toLowerCase();


    const banglishWords = [
        "ki",
        "koto",
        "ase",
        "ache",
        "nai",
        "daam",
        "dam",
        "price",
        "stock",
        "pabo",
        "nibo",
        "niben",
        "chai",
        "lagbe",
        "apnader",
        "product",
        "kemon"
    ];


    const hasBanglish =
        banglishWords.some(
            (word) =>
                lower.includes(
                    word
                )
        );


    if (hasBanglish) {

        return "banglish";

    }


    return "english";

}


/* -----------------------------------------
   FIND PRODUCT
----------------------------------------- */

function findChatProduct(
    text
) {

    const value =
        String(text || "")
            .toLowerCase()
            .trim();


    const entries =
        Object.entries(
            products || {}
        );


    if (!entries.length) {

        return null;

    }


    /* EXACT / PARTIAL NAME */

    let match =
        entries.find(
            ([id, product]) => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                return (
                    value.includes(name) ||
                    name.includes(value)
                );

            }
        );


    if (match) {

        return match;

    }


    /* WORD MATCH */

    const words =
        value
            .split(
                /\s+/
            )
            .filter(
                (word) =>
                    word.length >= 3
            );


    let bestProduct =
        null;

    let bestScore =
        0;


    entries.forEach(
        ([id, product]) => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();


            let score =
                0;


            words.forEach(
                (word) => {

                    if (
                        name.includes(
                            word
                        )
                    ) {

                        score++;

                    }

                }
            );


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                bestProduct =
                    [id, product];

            }

        }
    );


    return bestProduct;

}


/* -----------------------------------------
   PRODUCT RESPONSE
----------------------------------------- */

function createProductResponse(
    productEntry,
    language
) {

    if (!productEntry) {

        if (
            language ===
            "bangla"
        ) {

            return "🤖 দুঃখিত, এই নামে কোনো product খুঁজে পেলাম না। 🛍️";

        }


        if (
            language ===
            "banglish"
        ) {

            return "🤖 Sorry vai, ei name kono product khuje pelam na. 🛍️";

        }


        return "🤖 Sorry, I couldn't find that product. 🛍️";

    }


    const product =
        productEntry[1];


    const name =
        String(
            product.name ||
            "Product"
        );


    const price =
        Number(
            product.price || 0
        );


    const stock =
        Number(
            product.stock || 0
        );


    if (
        language ===
        "bangla"
    ) {

        if (stock > 0) {

            return (
                `🛍️ ${name} 🔥\n` +
                `💰 দাম: ${price.toLocaleString()}৳ 🙃\n` +
                `📦 স্টক: ${stock} pcs ✅`
            );

        }


        return (
            `🛍️ ${name} 🔥\n` +
            `💰 দাম: ${price.toLocaleString()}৳ 🙃\n` +
            `📦 স্টক: বর্তমানে শেষ 😔`
        );

    }


    if (
        language ===
        "banglish"
    ) {

        if (stock > 0) {

            return (
                `🛍️ ${name} 🔥\n` +
                `💰 Price: ${price.toLocaleString()}৳ 🙃\n` +
                `📦 Stock: ${stock} pcs ache ✅`
            );

        }


        return (
            `🛍️ ${name} 🔥\n` +
            `💰 Price: ${price.toLocaleString()}৳ 🙃\n` +
            `📦 Stock: ekhon shesh 😔`
        );

    }


    if (stock > 0) {

        return (
            `🛍️ ${name} 🔥\n` +
            `💰 Price: ${price.toLocaleString()}৳ 🙃\n` +
            `📦 Stock: ${stock} pcs available ✅`
        );

    }


    return (
        `🛍️ ${name} 🔥\n` +
        `💰 Price: ${price.toLocaleString()}৳ 🙃\n` +
        `📦 Stock: Currently out of stock 😔`
    );

}


/* -----------------------------------------
   GENERAL AI RESPONSE
----------------------------------------- */

function getAiResponse(
    userText
) {

    const language =
        detectChatLanguage(
            userText
        );


    const lower =
        String(userText || "")
            .toLowerCase();


    const product =
        findChatProduct(
            userText
        );


    /* PRODUCT QUERY */

    const productKeywords = [
        "product",
        "price",
        "stock",
        "available",
        "available?",
        "dam",
        "daam",
        "koto",
        "ache",
        "ase",
        "nai",
        "pabo",
        "product ki",
        "product name"
    ];


    const asksAboutProduct =
        productKeywords.some(
            (keyword) =>
                lower.includes(
                    keyword
                )
        );


    if (
        product ||
        asksAboutProduct
    ) {

        if (product) {

            return createProductResponse(
                product,
                language
            );

        }


        if (
            language ===
            "bangla"
        ) {

            return "🤖 অবশ্যই! কোন product-এর নাম বলুন, আমি তার price ও stock জানিয়ে দিচ্ছি। 🛍️";

        }


        if (
            language ===
            "banglish"
        ) {

            return "🤖 Obosshoi! Product-er name bolen, ami price ar stock bole dibo. 🛍️";

        }


        return "🤖 Sure! Tell me the product name and I can show you its price and stock. 🛍️";

    }


    /* GREETING */

    const greetingWords = [
        "hi",
        "hello",
        "hey",
        "salam",
        "assalamu",
        "আসসালামু",
        "হাই",
        "হ্যালো"
    ];


    const isGreeting =
        greetingWords.some(
            (word) =>
                lower.includes(
                    word
                )
        );


    if (isGreeting) {

        if (
            language ===
            "bangla"
        ) {

            return "🤖 আসসালামু আলাইকুম! True Seller-এ স্বাগতম। 🛍️ কোন product সম্পর্কে জানতে চান?";

        }


        if (
            language ===
            "banglish"
        ) {

            return "🤖 Assalamu Alaikum! True Seller-e welcome. 🛍️ Kon product somporke jante chan?";

        }


        return "🤖 Hello! Welcome to True Seller. 🛍️ Which product would you like to know about?";

    }


    /* THANK YOU */

    if (
        lower.includes("thanks") ||
        lower.includes("thank you") ||
        lower.includes("ধন্যবাদ")
    ) {

        if (
            language ===
            "bangla"
        ) {

            return "🤖 আপনাকেও ধন্যবাদ! True Seller-এর সাথে থাকার জন্য। ❤️";

        }


        if (
            language ===
            "banglish"
        ) {

            return "🤖 Apnakeo thanks! True Seller-er sathe thakar jonno. ❤️";

        }


        return "🤖 You're welcome! Thanks for choosing True Seller. ❤️";

    }


    /* FALLBACK */

    if (
        language ===
        "bangla"
    ) {

        return "🤖 আপনার প্রশ্নটা হয়তো আমি বুঝিনি। 🛍️ Product-এর নাম, price বা stock সম্পর্কে জিজ্ঞেস করতে পারেন।";

    }


    if (
        language ===
        "banglish"
    ) {

        return "🤖 Apnar question-ta hoyto bujhte pari nai. 🛍️ Product-er name, price ba stock niye jiggesh korte paren.";

    }


    return "🤖 I may not have understood your question. 🛍️ You can ask me about a product, price, or stock.";

}


/* -----------------------------------------
   AI CHAT SUBMIT
----------------------------------------- */

if (aiChatForm) {

    aiChatForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const text =
                aiChatInput
                    ? aiChatInput.value.trim()
                    : "";


            if (!text) return;


            addAiMessage(
                text,
                "user"
            );


            if (aiChatInput) {

                aiChatInput.value =
                    "";

            }


            setTimeout(
                () => {

                    const response =
                        getAiResponse(
                            text
                        );


                    addAiMessage(
                        response,
                        "bot"
                    );

                },
                250
            );

        }
    );

}


/* =========================================
   DRAGGABLE ROBOT BUTTON
========================================= */

let chatDragging =
    false;

let chatMoved =
    false;

let chatStartX =
    0;

let chatStartY =
    0;

let chatOriginalX =
    0;

let chatOriginalY =
    0;


if (hybridChatButton) {

    hybridChatButton.addEventListener(
        "pointerdown",
        (event) => {

            chatDragging =
                true;

            chatMoved =
                false;


            const rect =
                hybridChatButton.getBoundingClientRect();


            chatStartX =
                event.clientX;

            chatStartY =
                event.clientY;


            chatOriginalX =
                rect.left;

            chatOriginalY =
                rect.top;


            hybridChatButton.style.left =
                `${chatOriginalX}px`;

            hybridChatButton.style.top =
                `${chatOriginalY}px`;

            hybridChatButton.style.right =
                "auto";

            hybridChatButton.style.bottom =
                "auto";


            try {

                hybridChatButton.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {

                console.log(
                    "Pointer capture unavailable."
                );

            }

        }
    );


    hybridChatButton.addEventListener(
        "pointermove",
        (event) => {

            if (!chatDragging) return;


            const deltaX =
                event.clientX -
                chatStartX;


            const deltaY =
                event.clientY -
                chatStartY;


            if (
                Math.abs(deltaX) > 5 ||
                Math.abs(deltaY) > 5
            ) {

                chatMoved =
                    true;

            }


            let newX =
                chatOriginalX +
                deltaX;


            let newY =
                chatOriginalY +
                deltaY;


            const maxX =
                window.innerWidth -
                hybridChatButton.offsetWidth -
                5;


            const maxY =
                window.innerHeight -
                hybridChatButton.offsetHeight -
                5;


            newX =
                Math.max(
                    5,
                    Math.min(
                        newX,
                        maxX
                    )
                );


            newY =
                Math.max(
                    5,
                    Math.min(
                        newY,
                        maxY
                    )
                );


            hybridChatButton.style.left =
                `${newX}px`;

            hybridChatButton.style.top =
                `${newY}px`;

        }
    );


    hybridChatButton.addEventListener(
        "pointerup",
        (event) => {

            if (!chatDragging) return;


            chatDragging =
                false;


            try {

                hybridChatButton.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {

                console.log(
                    "Pointer release unavailable."
                );

            }


            if (!chatMoved) {

                openHybridChat();

            }

        }
    );


    hybridChatButton.addEventListener(
        "pointercancel",
        () => {

            chatDragging =
                false;

        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }

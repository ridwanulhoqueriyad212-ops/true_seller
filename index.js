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


/* =========================================================
   TRUE SELLER
   FIREBASE + PRODUCTS + ORDERS + HYBRID CHAT
========================================================= */


/* =========================================================
   FIREBASE CONFIG
========================================================= */

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


const app =
    initializeApp(firebaseConfig);

const db =
    getDatabase(app);


/* =========================================================
   PAYMENT SETTINGS
========================================================= */

const BKASH_NUMBER =
    "8801774187877";

const NAGAD_NUMBER =
    "8801717257131";

const WHATSAPP_NUMBER =
    "8801774187877";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productGrid =
    document.getElementById("productGrid");

const productCount =
    document.getElementById("productCount");

const emptyState =
    document.getElementById("emptyState");

const productSearch =
    document.getElementById("productSearch");

const clearSearch =
    document.getElementById("clearSearch");

const orderModal =
    document.getElementById("orderModal");

const closeModal =
    document.getElementById("closeModal");

const orderForm =
    document.getElementById("orderForm");

const successBox =
    document.getElementById("successBox");

const successClose =
    document.getElementById("successClose");

const whatsappBtn =
    document.getElementById("whatsappBtn");

const bkashPaymentBox =
    document.getElementById("bkashPaymentBox");

const nagadPaymentBox =
    document.getElementById("nagadPaymentBox");

const bkashNumber =
    document.getElementById("bkashNumber");

const nagadNumber =
    document.getElementById("nagadNumber");

const bkashTrxId =
    document.getElementById("bkashTrxId");

const nagadTrxId =
    document.getElementById("nagadTrxId");

const selectedProductId =
    document.getElementById("selectedProductId");

const selectedProductName =
    document.getElementById("selectedProductName");

const selectedProductPrice =
    document.getElementById("selectedProductPrice");

const selectedProductImage =
    document.getElementById("selectedProductImage");


/* =========================================================
   DATA
========================================================= */

let products = {};

let searchTerm = "";


/* =========================================================
   PAYMENT NUMBERS
========================================================= */

if (bkashNumber) {

    bkashNumber.textContent =
        BKASH_NUMBER;

}


if (nagadNumber) {

    nagadNumber.textContent =
        NAGAD_NUMBER;

}


/* =========================================================
   WHATSAPP BUTTON
========================================================= */

if (whatsappBtn) {

    whatsappBtn.href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${
            encodeURIComponent(
                "Assalamu Alaikum, I need support from True Seller."
            )
        }`;

}


/* =========================================================
   LOAD PRODUCTS FROM FIREBASE
========================================================= */

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

                <div
                    class="empty-state"
                    style="display:block"
                >

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


/* =========================================================
   RENDER PRODUCTS
========================================================= */

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


    const filteredProducts =
        productEntries.filter(
            ([id, product]) => {

                const name =
                    String(
                        product?.name || ""
                    ).toLowerCase();

                return name.includes(
                    search
                );

            }
        );


    if (productCount) {

        productCount.textContent =
            filteredProducts.length;

    }


    if (
        filteredProducts.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";


            const title =
                emptyState.querySelector("h3");

            const text =
                emptyState.querySelector("p");


            if (title) {

                title.textContent =
                    "No Products Found";

            }


            if (text) {

                text.textContent =
                    search
                        ? `No product matches "${searchTerm}".`
                        : "We couldn't find any product here.";

            }

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    filteredProducts.forEach(
        ([id, product]) => {

            const stock =
                Number(
                    product?.stock || 0
                );


            const price =
                Number(
                    product?.price || 0
                );


            const image =
                product?.imageUrl ||
                product?.image ||
                "";


            const name =
                product?.name ||
                "Unnamed Product";


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
                            alt="${escapeHtml(name)}"
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
                        ${escapeHtml(name)}
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


/* =========================================================
   SEARCH
========================================================= */

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


/* =========================================================
   CLEAR SEARCH
========================================================= */

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


/* =========================================================
   OPEN ORDER MODAL
========================================================= */

function openOrderModal(
    productId,
    product
) {

    const stock =
        Number(
            product?.stock || 0
        );


    if (stock <= 0) {

        alert(
            "Sorry, this product is out of stock."
        );

        return;

    }


    /*
       IMPORTANT:
       Reset first.
       Then set product ID.
       Otherwise reset() removes the hidden product ID.
    */

    if (orderForm) {

        orderForm.reset();

    }


    if (selectedProductId) {

        selectedProductId.value =
            productId;

    }


    if (selectedProductName) {

        selectedProductName.textContent =
            product?.name ||
            "Product";

    }


    if (selectedProductPrice) {

        selectedProductPrice.textContent =
            Number(
                product?.price || 0
            ).toLocaleString();

    }


    if (selectedProductImage) {

        selectedProductImage.src =
            product?.imageUrl ||
            product?.image ||
            "";

        selectedProductImage.alt =
            product?.name ||
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


/* =========================================================
   CLOSE ORDER MODAL
========================================================= */

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


/* =========================================================
   PAYMENT METHOD
========================================================= */

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


/* =========================================================
   ORDER SUBMIT
========================================================= */

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


            const nameElement =
                document.getElementById(
                    "customerName"
                );


            const phoneElement =
                document.getElementById(
                    "customerPhone"
                );


            const addressElement =
                document.getElementById(
                    "customerAddress"
                );


            const customerName =
                nameElement
                    ? nameElement.value.trim()
                    : "";


            const phone =
                phoneElement
                    ? phoneElement.value.trim()
                    : "";


            const address =
                addressElement
                    ? addressElement.value.trim()
                    : "";


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
                            product.price || 0
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


/* =========================================================
   SUCCESS CLOSE
========================================================= */

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


/* =========================================================
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   HYBRID CHAT
========================================================= */

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


let lastChatProductId =
    null;

let lastChatProduct =
    null;


/* =========================================================
   BUSINESS KNOWLEDGE
========================================================= */

const TRUE_SELLER_KNOWLEDGE = {

    owner: {

        bn:
            "👤 True Seller-এর owner হলেন Touhid Shawon এবং Ridwanul Hoque Riyad। 🤝",

        en:
            "👤 The owners of True Seller are Touhid Shawon and Ridwanul Hoque Riyad. 🤝",

        bi:
            "👤 True Seller-er owner holen Touhid Shawon ebong Ridwanul Hoque Riyad. 🤝"

    },


    developer: {

        bn:
            "💻 True Seller website-এর developer হলেন Ridwanul Hoque Riyad। 🤝",

        en:
            "💻 The developer of the True Seller website is Ridwanul Hoque Riyad. 🤝",

        bi:
            "💻 True Seller website-er developer holen Ridwanul Hoque Riyad. 🤝"

    },


    facebook: {

        bn:
            "📘 আমাদের Facebook Page-এর নাম True Seller। 😊",

        en:
            "📘 Our Facebook Page name is True Seller. 😊",

        bi:
            "📘 Amader Facebook Page-er naam True Seller. 😊"

    },


    whatsapp: {

        bn:
            "📱 Website-এর WhatsApp button-এ click করলেই WhatsApp-এ যোগাযোগ করতে পারবেন। 😊",

        en:
            "📱 You can contact us by clicking the WhatsApp button on the website. 😊",

        bi:
            "📱 Website-er WhatsApp button-e click korlei WhatsApp-e jogajog korte parben. 😊"

    },


    delivery: {

        bn:
            "🚚 True Seller-এর delivery সাধারণত 3 দিনের মধ্যে হয়। 😊",

        en:
            "🚚 True Seller delivery usually takes 3 days. 😊",

        bi:
            "🚚 True Seller-er delivery usually 3 diner moddhe hoy. 😊"

    },


    payment: {

        bn:
            "💳 আমরা bKash, Nagad এবং Cash on Delivery (COD) payment গ্রহণ করি। 😊",

        en:
            "💳 We accept bKash, Nagad, and Cash on Delivery (COD). 😊",

        bi:
            "💳 Amra bKash, Nagad ebong Cash on Delivery (COD) payment nei. 😊"

    },


    identity: {

        bn:
            "🤖 আমি True Seller-এর AI Assistant। Product, price, stock, order এবং True Seller সম্পর্কে তথ্য দিতে পারি। 😊",

        en:
            "🤖 I am the True Seller AI Assistant. I can help with products, prices, stock, orders, and True Seller information. 😊",

        bi:
            "🤖 Ami True Seller-er AI Assistant. Product, price, stock, order ebong True Seller-er information dite pari. 😊"

    },


    thanks: {

        bn:
            "😊 আপনাকেও ধন্যবাদ! True Seller-এ আপনাকে সাহায্য করতে পেরে ভালো লাগছে। 🤝",

        en:
            "😊 You're welcome! I'm happy to help you at True Seller. 🤝",

        bi:
            "😊 Apnakeo dhonnobad! True Seller-e apnake help korte pere valo lagche. 🤝"

    },


    fallback: {

        bn:
            "🤖 দুঃখিত, প্রশ্নটি পুরোপুরি বুঝতে পারিনি। একটু অন্যভাবে লিখুন অথবা Admin Help ব্যবহার করুন। 😊",

        en:
            "🤖 Sorry, I couldn't fully understand your question. Please try another way or use Admin Help. 😊",

        bi:
            "🤖 Sorry, apnar question-ta puro bujhte parini. Ektu onno vabe likhun ba Admin Help use korun. 😊"

    }

};


/* =========================================================
   FAQ INTENTS
========================================================= */

const FAQ_INTENTS = [

    {
        id: "owner",

        words: [
            "owner",
            "owners",
            "owener",
            "onwer",
            "ownr",
            "owner ke",
            "owners ke",
            "malik",
            "malik ke",
            "proprietor",
            "propritor",
            "proprietar",
            "boss",
            "boss ke",
            "main owner",
            "main malik",
            "true seller owner",
            "true seller er owner",
            "trueseller owner",
            "মালিক",
            "মালিক কে",
            "ওনার",
            "ওনার কে",
            "স্বত্বাধিকারী",
            "স্বত্বাধিকারী কে"
        ],

        answer:
            "owner"
    },


    {
        id: "developer",

        words: [
            "developer",
            "developar",
            "devoloper",
            "devloper",
            "developper",
            "developr",
            "dev",
            "devloper ke",
            "developer ke",
            "website developer",
            "site developer",
            "web developer",
            "website ke banay",
            "website banay ke",
            "site ke banay",
            "website maker",
            "site maker",
            "website banaise ke",
            "website banayse ke",
            "web banaise ke",
            "ডেভেলপার",
            "ডেভেলপার কে",
            "ওয়েব ডেভেলপার",
            "সাইট কে বানিয়েছে"
        ],

        answer:
            "developer"
    },


    {
        id: "facebook",

        words: [
            "facebook",
            "facebok",
            "facbook",
            "facbok",
            "facebook page",
            "facebook name",
            "page name",
            "fb",
            "fb page",
            "fbook",
            "face book",
            "facebook link",
            "fb link",
            "page",
            "page ta ki",
            "page nam",
            "page naam",
            "true seller facebook",
            "trueseller facebook",
            "ফেসবুক",
            "ফেসবুক পেজ",
            "ফেসবুক পেজের নাম",
            "পেজ",
            "পেজের নাম"
        ],

        answer:
            "facebook"
    },


    {
        id: "whatsapp",

        words: [
            "whatsapp",
            "whatsap",
            "watsapp",
            "whtsapp",
            "whatsupp",
            "whats app",
            "whatsappp",
            "whtsap",
            "whatapp",
            "whatsap link",
            "whatsapp link",
            "whatsapp number",
            "whats number",
            "whatsapp contact",
            "whats contact",
            "whatsap contact",
            "whatsapp e jogajog",
            "whatsapp jogajog",
            "whatsapp e kotha",
            "whatsapp e kivabe",
            "whatsapp kivabe",
            "whatsapp kothay",
            "হোয়াটসঅ্যাপ",
            "হোয়াটসাপ",
            "হোয়াটসঅ্যাপ নাম্বার",
            "হোয়াটসঅ্যাপে যোগাযোগ"
        ],

        answer:
            "whatsapp"
    },


    {
        id: "delivery",

        words: [
            "delivery",
            "delivary",
            "delivry",
            "delvery",
            "delevary",
            "delivri",
            "delivrey",
            "deliveri",
            "delivaryy",
            "delivryy",
            "delivary charge",
            "delivery charge",
            "delivery fee",
            "delivary fee",
            "delivery time",
            "delivary time",
            "deliveri time",
            "delivery koydin",
            "delivary koydin",
            "delivry koydin",
            "delivery koto din",
            "delivary koto din",
            "delivery kotodin",
            "delivery how many days",
            "delivery how long",
            "delivery kobe",
            "ডেলিভারি",
            "ডেলিভারি চার্জ",
            "ডেলিভারি কতদিন",
            "ডেলিভারি কবে"
        ],

        answer:
            "delivery"
    },


    {
        id: "payment",

        words: [
            "payment",
            "pament",
            "paymant",
            "paymnt",
            "payement",
            "paymet",
            "paymen",
            "payment method",
            "pament method",
            "payment kibhabe",
            "payment kivabe",
            "payment ki ki",
            "payment option",
            "pay option",
            "pay kibhabe",
            "pay kivabe",
            "bkash",
            "bkas",
            "bkashh",
            "b kash",
            "bkash payment",
            "nagad",
            "nagod",
            "nagadd",
            "nagad payment",
            "cod",
            "c o d",
            "cash on delivery",
            "cash delivery",
            "পেমেন্ট",
            "পেমেন্ট কিভাবে",
            "বিকাশ",
            "নগদ",
            "ক্যাশ অন ডেলিভারি"
        ],

        answer:
            "payment"
    },


    {
        id: "identity",

        words: [
            "who are you",
            "who r you",
            "who r u",
            "what are you",
            "what r you",
            "what r u",
            "tomar nam",
            "tumar nam",
            "tomar naam",
            "tumar naam",
            "tomar name",
            "tumar name",
            "ke tumi",
            "k tumi",
            "tumi ke",
            "apni ke",
            "who you",
            "your name",
            "ur name",
            "name ki",
            "name bolo",
            "bot name",
            "ai name",
            "আপনি কে",
            "তুমি কে",
            "তোমার নাম",
            "তোমার নাম কি",
            "নাম কি",
            "নাম বলো"
        ],

        answer:
            "identity"
    },


    {
        id: "thanks",

        words: [
            "thanks",
            "thank you",
            "thnx",
            "thanx",
            "tanks",
            "thankyou",
            "thank u",
            "thnku",
            "thnks",
            "thankss",
            "thanks bro",
            "thanks vai",
            "tnx",
            "tnks",
            "dhonnobad",
            "donnobad",
            "dhonnobad vai",
            "অনেক ধন্যবাদ",
            "ধন্যবাদ",
            "থ্যাংকস"
        ],

        answer:
            "thanks"
    }

];


/* =========================================================
   GREETING
========================================================= */

const GREETING_INTENTS = [

    "hi",
    "hii",
    "hiii",
    "hiiii",
    "hello",
    "helo",
    "hellow",
    "heello",
    "hey",
    "heyy",
    "hy",
    "hyy",
    "salam",
    "slm",
    "salamualaikum",
    "assalamualaikum",
    "assalamu alaikum",
    "asalamualaikum",
    "aslamualaikum",
    "assalamu alaykum",
    "আসসালামু আলাইকুম",
    "সালাম",
    "হাই",
    "হ্যালো",
    "হ্যালো ভাই"
];


const HOW_ARE_YOU_INTENTS = [

    "kemon aso",
    "kemon acho",
    "kmn aso",
    "kmn acho",
    "kmon aso",
    "kmon acho",
    "kemon asen",
    "kemon achen",
    "kmn achen",
    "kemon as",
    "kmon as",
    "how are you",
    "how r you",
    "how are u",
    "how r u",
    "hows you",
    "are you good",
    "you good",
    "valo acho",
    "bhalo acho",
    "ভালো আছো",
    "কেমন আছো",
    "কেমন আছেন",
    "কেমন আছ",
    "কেমন আছিস"
];


const WHAT_DO_YOU_DO_INTENTS = [

    "ki koro",
    "ki koros",
    "ki koren",
    "tumi ki koro",
    "apni ki koren",
    "what do you do",
    "what u do",
    "wht do u do",
    "ki kaj koro",
    "ki kaj koren",
    "tumar kaj ki",
    "tomar kaj ki",
    "bot ki kore",
    "ai ki kore",
    "কি করো",
    "কি করেন",
    "কি কাজ করো",
    "তুমি কি করো"
];


/* =========================================================
   NORMALIZE
========================================================= */

function normalizeChatText(
    value
) {

    return String(
        value || ""
    )
        .toLowerCase()
        .normalize("NFKC")
        .replace(
            /[؟?!.。,،;:|/\\()[\]{}<>_+=*#@%$^&~`'"“”‘’]/g,
            " "
        )
        .replace(
            /[০-৯]/g,
            (digit) =>
                String(
                    "০১২৩৪৫৬৭৮৯"
                        .indexOf(digit)
                )
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


function compactChatText(
    value
) {

    return normalizeChatText(
        value
    ).replace(
        /\s+/g,
        ""
    );

}


/* =========================================================
   LEVENSHTEIN FUZZY MATCH
========================================================= */

function levenshtein(
    a,
    b
) {

    if (a === b) return 0;

    if (!a) return b.length;

    if (!b) return a.length;


    const previous =
        Array.from(
            {
                length:
                    b.length + 1
            },
            (_, i) => i
        );


    for (
        let i = 1;
        i <= a.length;
        i++
    ) {

        const current =
            [i];


        for (
            let j = 1;
            j <= b.length;
            j++
        ) {

            current[j] =
                Math.min(

                    current[j - 1] + 1,

                    previous[j] + 1,

                    previous[j - 1] +
                    (
                        a[i - 1] ===
                        b[j - 1]
                            ? 0
                            : 1
                    )

                );

        }


        for (
            let j = 0;
            j < current.length;
            j++
        ) {

            previous[j] =
                current[j];

        }

    }


    return previous[b.length];

}


/* =========================================================
   FUZZY TOKEN
========================================================= */

function fuzzyTokenMatch(
    inputToken,
    alias
) {

    const a =
        compactChatText(
            inputToken
        );

    const b =
        compactChatText(
            alias
        );


    if (!a || !b) {

        return false;

    }


    if (a === b) {

        return true;

    }


    if (
        a.includes(b) ||
        b.includes(a)
    ) {

        return true;

    }


    const maxLength =
        Math.max(
            a.length,
            b.length
        );


    if (maxLength <= 4) {

        return levenshtein(
            a,
            b
        ) <= 1;

    }


    if (maxLength <= 7) {

        return levenshtein(
            a,
            b
        ) <= 2;

    }


    return levenshtein(
        a,
        b
    ) <= 3;

}


/* =========================================================
   INTENT MATCH
========================================================= */

function textHasIntent(
    text,
    aliases
) {

    const normalized =
        normalizeChatText(
            text
        );


    const tokens =
        normalized
            .split(" ")
            .filter(Boolean);


    for (
        const alias of aliases
    ) {

        const a =
            normalizeChatText(
                alias
            );


        if (!a) continue;


        if (
            normalized.includes(a)
        ) {

            return true;

        }


        const aliasTokens =
            a
                .split(" ")
                .filter(Boolean);


        if (
            aliasTokens.length === 1
        ) {

            if (
                tokens.some(
                    token =>
                        fuzzyTokenMatch(
                            token,
                            aliasTokens[0]
                        )
                )
            ) {

                return true;

            }

        }


        if (
            aliasTokens.length > 1
        ) {

            for (
                let i = 0;
                i <=
                tokens.length -
                aliasTokens.length;
                i++
            ) {

                let matched =
                    true;


                for (
                    let j = 0;
                    j <
                    aliasTokens.length;
                    j++
                ) {

                    if (
                        !fuzzyTokenMatch(
                            tokens[i + j],
                            aliasTokens[j]
                        )
                    ) {

                        matched =
                            false;

                        break;

                    }

                }


                if (matched) {

                    return true;

                }

            }

        }

    }


    return false;

}


/* =========================================================
   LANGUAGE DETECTION
========================================================= */

function detectChatLanguage(
    text
) {

    if (
        /[\u0980-\u09FF]/.test(
            text
        )
    ) {

        return "bn";

    }


    const normalized =
        normalizeChatText(
            text
        );


    const banglishWords = [

        "ami",
        "apni",
        "tumi",
        "vai",
        "bhai",
        "kemon",
        "kivabe",
        "kibhabe",
        "koto",
        "koy",
        "ase",
        "ache",
        "achen",
        "aso",
        "acho",
        "chai",
        "lagbe",
        "hobe",
        "korbo",
        "korben",
        "den",
        "dao",
        "dekhaw",
        "dekhabo",
        "amar",
        "tomar",
        "ekhane",
        "ki",
        "ke",
        "nai",
        "nei",
        "dam",
        "stock",
        "order"
    ];


    if (
        normalized
            .split(" ")
            .some(
                word =>
                    banglishWords
                        .includes(word)
            )
    ) {

        return "bi";

    }


    return "en";

}


/* =========================================================
   KNOWLEDGE REPLY
========================================================= */

function chatReply(
    key,
    lang
) {

    const item =
        TRUE_SELLER_KNOWLEDGE[key] ||
        TRUE_SELLER_KNOWLEDGE.fallback;


    return (
        item[lang] ||
        item.en
    );

}


/* =========================================================
   APPEND CHAT MESSAGE
========================================================= */

function appendAiMessage(
    text,
    type = "bot",
    product = null
) {

    if (!aiMessages) return;


    const bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        `ai-message ${type}`;


    bubble.textContent =
        text;


    if (product) {

        const productCard =
            document.createElement(
                "div"
            );


        productCard.className =
            "ai-product";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            product.image ||
            product.imageUrl ||
            "";


        image.alt =
            product.name ||
            "Product";


        const info =
            document.createElement(
                "div"
            );


        const strong =
            document.createElement(
                "strong"
            );


        strong.textContent =
            product.name ||
            "Product";


        const details =
            document.createElement(
                "span"
            );


        details.textContent =
            `💰 ৳${Number(
                product.price || 0
            ).toLocaleString()} • 📦 ${Number(
                product.stock || 0
            )} pcs`;


        info.append(
            strong,
            details
        );


        productCard.append(
            image,
            info
        );


        bubble.append(
            productCard
        );

    }


    aiMessages.appendChild(
        bubble
    );


    aiMessages.scrollTop =
        aiMessages.scrollHeight;

}


/* =========================================================
   FIND PRODUCT
========================================================= */

function findChatProduct(
    text
) {

    const entries =
        Object.entries(
            products || {}
        );


    if (!entries.length) {

        return null;

    }


    const normalized =
        normalizeChatText(
            text
        );


    const contextWords =
        [
            "this",
            "that",
            "it",
            "eta",
            "ota",
            "etar",
            "otar",
            "eita",
            "oita",
            "eitaar",
            "etar",
            "ওই",
            "এই",
            "এটার",
            "ওটার",
            "এইটা",
            "ওইটা",
            "এটি",
            "ওটি"
        ];


    if (
        lastChatProductId &&
        lastChatProduct &&
        contextWords.some(
            word =>
                normalized.includes(
                    word
                )
        )
    ) {

        return lastChatProduct;

    }


    let best =
        null;

    let bestScore =
        0;


    for (
        const [id, product]
        of entries
    ) {

        const name =
            normalizeChatText(
                product?.name || ""
            );


        if (!name) continue;


        let score =
            0;


        if (
            normalized.includes(
                name
            )
        ) {

            score += 10;

        }


        const nameTokens =
            name
                .split(" ")
                .filter(
                    token =>
                        token.length >= 2
                );


        for (
            const token
            of nameTokens
        ) {

            if (
                normalized.includes(
                    token
                )
            ) {

                score += 3;

            } else if (
                normalized
                    .split(" ")
                    .some(
                        inputToken =>
                            fuzzyTokenMatch(
                                inputToken,
                                token
                            )
                    )
            ) {

                score += 2;

            }

        }


        if (
            score > bestScore
        ) {

            bestScore =
                score;

            best = {

                id:
                    id,

                product:
                    product

            };

        }

    }


    if (
        best &&
        bestScore >= 3
    ) {

        lastChatProductId =
            best.id;

        lastChatProduct =
            best.product;


        return best.product;

    }


    return null;

}


/* =========================================================
   PRODUCT INTENT
========================================================= */

function productIntent(
    text
) {

    const t =
        normalizeChatText(
            text
        );


    return {

        price:
            /\b(price|prce|prise|prize|dam|damm|koto|koy|how much|kototuku)\b|দাম|মূল্য|কত/.test(t),

        stock:
            /\b(stock|stok|stck|stoke|available|avai|ase|ache|availble|availablee)\b|আছে|স্টক|অ্যাভেইলেবল/.test(t),

        show:
            /\b(show|see|dekh|dekhao|dekhaw|product|prodcut|pruduct|item|items|dekhi)\b|দেখাও|দেখি|পণ্য|প্রোডাক্ট/.test(t)

    };

}


/* =========================================================
   GREETING REPLY
========================================================= */

function getGreetingReply(
    text,
    lang
) {

    if (
        textHasIntent(
            text,
            HOW_ARE_YOU_INTENTS
        )
    ) {

        if (lang === "bn") {

            return
                "Alhamdulillah, আমি ভালো আছি। আপনি কেমন আছেন? 😊🤝";

        }


        if (lang === "bi") {

            return
                "Alhamdulillah, ami valo achi. Apni kemon achen? 😊🤝";

        }


        return
            "Alhamdulillah, I am doing well. How are you? 😊🤝";

    }


    if (
        textHasIntent(
            text,
            WHAT_DO_YOU_DO_INTENTS
        )
    ) {

        if (lang === "bn") {

            return
                "🤖 আমি True Seller-এর AI Assistant। Product, price, stock, order এবং store information নিয়ে সাহায্য করি। 😊";

        }


        if (lang === "bi") {

            return
                "🤖 Ami True Seller-er AI Assistant. Product, price, stock, order ebong store information niye help kori. 😊";

        }


        return
            "🤖 I am the True Seller AI Assistant. I help with products, prices, stock, orders, and store information. 😊";

    }


    if (
        textHasIntent(
            text,
            GREETING_INTENTS
        )
    ) {

        if (lang === "bn") {

            return
                "ওয়ালাইকুমুস সালাম! 😊 True Seller-এ আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি? 🤝";

        }


        if (lang === "bi") {

            return
                "Walaikumussalam! 😊 True Seller-e apnake welcome. Kivabe help korte pari? 🤝";

        }


        return
            "Hello! 😊 Welcome to True Seller. How can I help you? 🤝";

    }


    return null;

}


/* =========================================================
   FAQ REPLY
========================================================= */

function getFaqReply(
    text,
    lang
) {

    for (
        const intent
        of FAQ_INTENTS
    ) {

        if (
            textHasIntent(
                text,
                intent.words
            )
        ) {

            return chatReply(
                intent.answer,
                lang
            );

        }

    }


    return null;

}


/* =========================================================
   PRODUCT REPLY
========================================================= */

function getProductReply(
    text,
    lang
) {

    const product =
        findChatProduct(
            text
        );


    if (!product) {

        return null;

    }


    const intent =
        productIntent(
            text
        );


    const name =
        product.name ||
        "Product";


    const price =
        Number(
            product.price || 0
        ).toLocaleString();


    const stock =
        Number(
            product.stock || 0
        );


    if (
        intent.price
    ) {

        if (lang === "bn") {

            return
                `🛍️ ${name} এর দাম ৳${price}। 😊`;

        }


        if (lang === "bi") {

            return
                `🛍️ ${name}-er dam ৳${price}. 😊`;

        }


        return
            `🛍️ ${name} costs ৳${price}. 😊`;

    }


    if (
        intent.stock
    ) {

        if (
            stock > 0
        ) {

            if (lang === "bn") {

                return
                    `📦 ${name}-এর ${stock} pcs stock আছে। ✅😊`;

            }


            if (lang === "bi") {

                return
                    `📦 ${name}-er ${stock} pcs stock ache. ✅😊`;

            }


            return
                `📦 ${name} has ${stock} pcs in stock. ✅😊`;

        }


        if (lang === "bn") {

            return
                `📦 দুঃখিত, ${name} এখন Out of Stock। 😔`;

        }


        if (lang === "bi") {

            return
                `📦 Sorry, ${name} ekhon out of stock. 😔`;

        }


        return
            `📦 Sorry, ${name} is currently out of stock. 😔`;

    }


    if (
        intent.show ||
        product
    ) {

        return
            `🛍️ ${name} 🔥
💰 Price: ৳${price}
📦 Stock: ${stock} pcs ${
                stock > 0
                    ? "✅"
                    : "❌"
            }`;

    }


    return null;

}


/* =========================================================
   ADMIN NAME ALIASES
========================================================= */

const RIYAD_ALIASES = [

    "riyad",
    "ridwan",
    "tiswan",
    "munn",
    "dionsur",
    "riyyad",
    "riyad bhai",
    "ridwan bhai",
    "riyad vai",
    "ridwan vai",
    "রিয়াদ",
    "রিদওয়ান",
    "তিসওয়ান",
    "মুন্ন",
    "রিয়াদ ভাই"

];


const SHAWON_ALIASES = [

    "shawon",
    "sagwon",
    "abu touhid",
    "abu towhid",
    "touhid shawon",
    "touhid",
    "shawn",
    "shawon bhai",
    "shawon vai",
    "sawon",
    "শাওন",
    "আবু তৌহিদ",
    "তৌহিদ",
    "শাওন ভাই"

];


/* =========================================================
   ADMIN REPLY
========================================================= */

function getAdminReply(
    text,
    lang
) {

    const riyad =
        textHasIntent(
            text,
            RIYAD_ALIASES
        );


    const shawon =
        textHasIntent(
            text,
            SHAWON_ALIASES
        );


    if (
        riyad &&
        !shawon
    ) {

        if (lang === "bn") {

            return
                "👨‍💼 Riyad Ahmed (Ridwanul Hoque Riyad) True Seller-এর একজন admin এবং website developer। 💻😊";

        }


        if (lang === "bi") {

            return
                "👨‍💼 Riyad Ahmed (Ridwanul Hoque Riyad) True Seller-er ekjon admin ebong website developer. 💻😊";

        }


        return
            "👨‍💼 Riyad Ahmed (Ridwanul Hoque Riyad) is an admin of True Seller and the website developer. 💻😊";

    }


    if (
        shawon &&
        !riyad
    ) {

        if (lang === "bn") {

            return
                "👨‍💼 Touhid Shawon True Seller-এর একজন admin। 😊";

        }


        if (lang === "bi") {

            return
                "👨‍💼 Touhid Shawon True Seller-er ekjon admin. 😊";

        }


        return
            "👨‍💼 Touhid Shawon is an admin of True Seller. 😊";

    }


    return null;

}


/* =========================================================
   MAIN AI RESPONSE
========================================================= */

function getHybridAiResponse(
    text
) {

    const lang =
        detectChatLanguage(
            text
        );


    const adminReply =
        getAdminReply(
            text,
            lang
        );


    if (adminReply) {

        return adminReply;

    }


    const greeting =
        getGreetingReply(
            text,
            lang
        );


    if (greeting) {

        return greeting;

    }


    const faq =
        getFaqReply(
            text,
            lang
        );


    if (faq) {

        return faq;

    }


    const product =
        getProductReply(
            text,
            lang
        );


    if (product) {

        return product;

    }


    const normalized =
        normalizeChatText(
            text
        );


    if (
        /\b(order|ordar|oder|odr|buy|purchase|order kor|order kivabe|how to order)\b/.test(
            normalized
        ) ||
        /অর্ডার|কিভাবে অর্ডার/.test(
            text
        )
    ) {

        if (lang === "bn") {

            return
                "🛒 Product-এর Order button-এ click করে আপনার নাম, phone number, address এবং payment method দিয়ে order করতে পারবেন। 😊";

        }


        if (lang === "bi") {

            return
                "🛒 Product-er Order button-e click kore apnar naam, phone number, address ebong payment method diye order korte parben. 😊";

        }


        return
            "🛒 Click the Order button on a product, then provide your name, phone number, address, and payment method. 😊";

    }


    if (
        /\b(cool|nice|wow|great|good|valo|bhalo|darun)\b/.test(
            normalized
        ) ||
        /ভালো|দারুণ/.test(
            text
        )
    ) {

        if (lang === "bn") {

            return
                "😊 ধন্যবাদ! আরও কিছু জানতে চাইলে বলুন। 🤝";

        }


        if (lang === "bi") {

            return
                "😊 Dhonnobad! Aro kichu jante chaile bolun. 🤝";

        }


        return
            "😊 Thank you! Feel free to ask anything else. 🤝";

    }


    return chatReply(
        "fallback",
        lang
    );

}


/* =========================================================
   HYBRID CHAT INITIALIZE
========================================================= */

function initializeHybridChat() {

    if (
        !hybridChatButton ||
        !hybridChatModal
    ) {

        return;

    }


    const openChatModal =
        () => {

            hybridChatModal.classList.add(
                "active"
            );

            hybridChatModal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow =
                "hidden";

        };


    const closeChatModal =
        () => {

            hybridChatModal.classList.remove(
                "active"
            );

            hybridChatModal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.style.overflow =
                "";

        };


    const showScreen =
        (screen) => {

            [
                chatChoiceScreen,
                aiAssistantScreen,
                adminHelpScreen
            ]
                .forEach(
                    item => {

                        if (item) {

                            item.classList.remove(
                                "active"
                            );

                        }

                    }
                );


            if (screen) {

                screen.classList.add(
                    "active"
                );

            }

        };


    /* =====================================================
       DRAG BUTTON
    ===================================================== */

    let startX =
        0;

    let startY =
        0;

    let moved =
        false;

    let dragging =
        false;


    hybridChatButton.addEventListener(
        "pointerdown",
        event => {

            dragging =
                true;

            moved =
                false;

            startX =
                event.clientX;

            startY =
                event.clientY;


            if (
                hybridChatButton.setPointerCapture
            ) {

                hybridChatButton.setPointerCapture(
                    event.pointerId
                );

            }

        }
    );


    hybridChatButton.addEventListener(
        "pointermove",
        event => {

            if (!dragging) return;


            const distance =
                Math.hypot(
                    event.clientX -
                    startX,

                    event.clientY -
                    startY
                );


            if (
                distance > 8
            ) {

                moved =
                    true;

            }


            if (moved) {

                const x =
                    Math.max(
                        8,
                        Math.min(
                            window.innerWidth -
                            70,

                            event.clientX -
                            31
                        )
                    );


                const y =
                    Math.max(
                        8,
                        Math.min(
                            window.innerHeight -
                            70,

                            event.clientY -
                            31
                        )
                    );


                hybridChatButton.style.left =
                    `${x}px`;

                hybridChatButton.style.top =
                    `${y}px`;

                hybridChatButton.style.right =
                    "auto";

                hybridChatButton.style.bottom =
                    "auto";

            }

        }
    );


    hybridChatButton.addEventListener(
        "pointerup",
        () => {

            if (
                dragging &&
                !moved
            ) {

                openChatModal();

            }


            dragging =
                false;

        }
    );


    hybridChatButton.addEventListener(
        "pointercancel",
        () => {

            dragging =
                false;

        }
    );


    /* =====================================================
       CLOSE CHAT
    ===================================================== */

    if (hybridChatClose) {

        hybridChatClose.addEventListener(
            "click",
            closeChatModal
        );

    }


    hybridChatModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                hybridChatModal
            ) {

                closeChatModal();

            }

        }
    );


    /* =====================================================
       AI ASSISTANT
    ===================================================== */

    if (openAiAssistant) {

        openAiAssistant.addEventListener(
            "click",
            () => {

                showScreen(
                    aiAssistantScreen
                );


                if (
                    aiMessages &&
                    !aiMessages.children.length
                ) {

                    appendAiMessage(
                        "🤖 Assalamu Alaikum! I’m the True Seller AI Assistant. How can I help you? 😊"
                    );

                }


                setTimeout(
                    () => {

                        if (aiChatInput) {

                            aiChatInput.focus();

                        }

                    },
                    0
                );

            }
        );

    }


    /* =====================================================
       ADMIN HELP
    ===================================================== */

    if (openAdminHelp) {

        openAdminHelp.addEventListener(
            "click",
            () => {

                showScreen(
                    adminHelpScreen
                );

            }
        );

    }


    /* =====================================================
       BACK BUTTONS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-chat-back]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showScreen(
                            chatChoiceScreen
                        );

                    }
                );

            }
        );


    /* =====================================================
       AI CHAT FORM
    ===================================================== */

    if (aiChatForm) {

        aiChatForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const text =
                    aiChatInput
                        ? aiChatInput.value.trim()
                        : "";


                if (!text) return;


                appendAiMessage(
                    text,
                    "user"
                );


                if (aiChatInput) {

                    aiChatInput.value =
                        "";

                }


                /*
                   NO ARTIFICIAL DELAY.
                   Reply appears immediately.
                */

                const answer =
                    getHybridAiResponse(
                        text
                    );


                appendAiMessage(
                    answer,
                    "bot"
                );

            }
        );

    }

}


/* =========================================================
   START HYBRID CHAT
========================================================= */

initializeHybridChat();


/* =========================================================
   END
========================================================= */

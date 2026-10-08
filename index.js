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
    "8801774187877";


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


    /*
       Reset first.
       Then set product ID so reset does not erase it.
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
/* =========================================
   TRUE SELLER AI ASSISTANT
   OpenRouter + Firebase Products
========================================= */

const OPENROUTER_API_KEY =
    "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";

const OPENROUTER_MODEL =
    "nvidia/nemotron-3.5-lightning:free";
const OPENROUTER_URL =
    "https://openrouter.ai/api/v1/chat/completions";


/* =========================================
   CHAT DOM
========================================= */

const hybridChatButton =
    document.getElementById("hybridChatButton");

const hybridChatModal =
    document.getElementById("hybridChatModal");

const hybridChatClose =
    document.getElementById("hybridChatClose");

const chatChoiceScreen =
    document.getElementById("chatChoiceScreen");

const aiAssistantScreen =
    document.getElementById("aiAssistantScreen");

const adminHelpScreen =
    document.getElementById("adminHelpScreen");

const openAiAssistant =
    document.getElementById("openAiAssistant");

const openAdminHelp =
    document.getElementById("openAdminHelp");

const aiMessages =
    document.getElementById("aiMessages");

const aiChatForm =
    document.getElementById("aiChatForm");

const aiChatInput =
    document.getElementById("aiChatInput");


/* =========================================
   CHAT STATE
========================================= */

let hybridChatInitialized = false;

let geminiHistory = [];


/* =========================================
   TRUE SELLER AI PERSONALITY
========================================= */

const TRUE_SELLER_AI_PROMPT = `
You are the official AI assistant of True Seller.

Your name:
True Seller AI Assistant.

PERSONALITY:
- Friendly
- Helpful
- Natural
- Warm
- Conversational
- Sometimes light and funny
- Never robotic
- Never overly formal
- You may use "vai" naturally in casual Bangla or Banglish.

LANGUAGE RULE:
- Bangla user = Bangla reply.
- English user = English reply.
- Banglish user = Banglish reply.
- Mixed language = naturally match the user's style.

EMOJI RULE:
Every reply must contain at least one suitable emoji.

TRUE SELLER INFORMATION:

Shop name:
True Seller

Owners:
Touhid Shawon
Ridwanul Hoque Riyad

Website developer:
Ridwanul Hoque Riyad

Facebook Page:
True Seller

Delivery:
Usually around 3 days.

Payment methods:
- bKash
- Nagad
- Cash on Delivery (COD)

WhatsApp:
The website WhatsApp button can be used to contact support.

PRODUCT RULE:
The CURRENT PRODUCT DATA supplied with the request is the ONLY source of truth for product information.

When answering about:
- product name
- price
- stock
- availability

ONLY use CURRENT PRODUCT DATA.

NEVER invent:
- prices
- stock
- product names
- discounts
- delivery charges
- specifications

If the requested product is not in the product data, say you cannot confirm it from the current product list.

NORMAL CONVERSATION:
You can naturally answer casual questions.

Example:
User: kemon acho
Answer:
Alhamdulillah vai, ami valo achi 😊 apni kemon achen?

User: ki koro
Answer:
Boshe achi vai, apnar message-er reply dicchi 😄 bolen ki lagbe?

Do not pretend to be a human.
You are an AI assistant.

Do not claim that an order has been placed unless the website actually confirms it.

If the user asks how to order:
Tell them to choose a product and press Order Now, then complete the order form.

Keep answers reasonably short and useful.
`;


/* =========================================
   PRODUCT DATA FOR AI
========================================= */

function getProductDataForAI() {

    const entries =
        Object.entries(products || {});

    if (!entries.length) {

        return "No product data is currently available.";

    }

    return entries.map(([id, product]) => {

        const name =
            product?.name ||
            "Unnamed Product";

        const price =
            Number(product?.price || 0);

        const stock =
            Number(product?.stock || 0);

        return `
Product ID: ${id}
Name: ${name}
Price: ৳${price}
Stock: ${stock} pcs
Availability: ${
            stock > 0
                ? "Available"
                : "Out of Stock"
        }
`;

    }).join("\n");
}


/* =========================================
   LANGUAGE DETECTION
========================================= */

function detectChatLanguage(text) {

    if (
        /[\u0980-\u09FF]/.test(
            text
        )
    ) {

        return "Bangla";

    }

    const banglishWords = [

        "ami",
        "amr",
        "amar",
        "apni",
        "tumi",
        "tomar",
        "vai",
        "bhai",
        "kemon",
        "kivabe",
        "kibhabe",
        "koto",
        "koy",
        "ache",
        "ase",
        "achen",
        "acho",
        "aso",
        "chai",
        "lagbe",
        "hobe",
        "korbo",
        "korben",
        "den",
        "dao",
        "daw",
        "dekhaw",
        "dekhai",
        "ekhane",
        "ki",
        "ke",
        "nai",
        "nei",
        "valo",
        "bhalo",
        "dhonnobad",
        "salam",
        "keno",
        "karon",
        "price",
        "dam",
        "stock",
        "order",
        "nibo",
        "nite",
        "dib",
        "dibo"

    ];

    const words =
        String(text || "")
            .toLowerCase()
            .split(/\s+/);

    if (
        words.some(
            word =>
                banglishWords.includes(
                    word
                )
        )
    ) {

        return "Banglish";

    }

    return "English";
}


/* =========================================
   APPEND CHAT MESSAGE
========================================= */

function appendAiMessage(
    text,
    type = "bot"
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

    aiMessages.appendChild(
        bubble
    );

    aiMessages.scrollTop =
        aiMessages.scrollHeight;
}


/* =========================================
   OPENROUTER REQUEST
========================================= */

async function getOpenRouterResponse(
    userText
) {

    const language =
        detectChatLanguage(
            userText
        );

    const productData =
        getProductDataForAI();


    const systemPrompt = `
${TRUE_SELLER_AI_PROMPT}

CURRENT USER LANGUAGE:
${language}

CURRENT PRODUCT DATA:
${productData}

IMPORTANT:
Use the product data above as the source of truth.
Never invent product information.
`;


    const recentHistory =
        geminiHistory.slice(-10);


    const messages = [

        {
            role: "system",
            content: systemPrompt
        },

        ...recentHistory,

        {
            role: "user",
            content: userText
        }

    ];


    const response =
        await fetch(
            OPENROUTER_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${OPENROUTER_API_KEY}`,

                    "HTTP-Referer":
                        window.location.origin,

                    "X-Title":
                        "True Seller AI Assistant"

                },

                body:
                    JSON.stringify({

                        model:
                            OPENROUTER_MODEL,

                        messages:
                            messages,

                        temperature:
                            0.7,

                        max_tokens:
                            500

                    })

            }
        );


    /* =====================================
       IMPORTANT ERROR CHECK
    ===================================== */

    if (!response.ok) {

        let errorText =
            "";

        try {

            errorText =
                await response.text();

        } catch (error) {

            errorText =
                "Could not read server error.";

        }


        console.error(
            "OPENROUTER STATUS:",
            response.status
        );

        console.error(
            "OPENROUTER ERROR:",
            errorText
        );


        throw new Error(
            `HTTP ${response.status}: ${errorText}`
        );

    }


    const data =
        await response.json();


    console.log(
        "OPENROUTER SUCCESS:",
        data
    );


    const answer =
        data?.choices?.[0]?.message?.content;


    if (
        !answer ||
        !String(answer).trim()
    ) {

        throw new Error(
            "OpenRouter returned an empty response."
        );

    }


    return String(
        answer
    ).trim();

}


/* =========================================
   AI CHAT
========================================= */

async function handleAiChat(
    userText
) {

    if (!userText) return;


    appendAiMessage(
        userText,
        "user"
    );


    if (aiChatInput) {

        aiChatInput.value = "";

    }


    const thinkingMessage =
        document.createElement(
            "div"
        );

    thinkingMessage.className =
        "ai-message bot";

    thinkingMessage.textContent =
        "🤖 Thinking... 😊";


    if (aiMessages) {

        aiMessages.appendChild(
            thinkingMessage
        );

        aiMessages.scrollTop =
            aiMessages.scrollHeight;

    }


    try {

        const answer =
            await getOpenRouterResponse(
                userText
            );


        thinkingMessage.remove();


        appendAiMessage(
            answer,
            "bot"
        );


        geminiHistory.push({

            role: "user",

            content:
                userText

        });


        geminiHistory.push({

            role: "assistant",

            content:
                answer

        });


        if (
            geminiHistory.length >
            20
        ) {

            geminiHistory =
                geminiHistory.slice(
                    -20
                );

        }


    } catch (error) {

        console.error(
            "TRUE SELLER AI ERROR:",
            error
        );


        thinkingMessage.remove();


        /*
           এবার generic message না দেখিয়ে
           আসল error দেখাবে
        */

        appendAiMessage(

            `🤖 AI connection error 😔

${error?.message || "Unknown error"}`,

            "bot"

        );

    }

}


/* =========================================
   INITIALIZE CHAT
========================================= */

function initializeHybridChat() {

    if (
        hybridChatInitialized
    ) {

        return;

    }


    hybridChatInitialized =
        true;


    if (
        !hybridChatButton ||
        !hybridChatModal
    ) {

        return;

    }


    /* =====================================
       OPEN MODAL
    ===================================== */

    const openModal =
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


    /* =====================================
       CLOSE MODAL
    ===================================== */

    const closeModal =
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


    /* =====================================
       SCREEN SWITCH
    ===================================== */

    const showScreen =
        (screen) => {

            [
                chatChoiceScreen,
                aiAssistantScreen,
                adminHelpScreen

            ].forEach(
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


    /* =====================================
       ROBOT DRAG
    ===================================== */

    let pointerStartX = 0;

    let pointerStartY = 0;

    let moved = false;

    let dragging = false;


    hybridChatButton.addEventListener(
        "pointerdown",
        event => {

            dragging = true;

            moved = false;

            pointerStartX =
                event.clientX;

            pointerStartY =
                event.clientY;


            hybridChatButton
                .setPointerCapture?.(
                    event.pointerId
                );

        }
    );


    hybridChatButton.addEventListener(
        "pointermove",
        event => {

            if (!dragging) return;


            if (
                Math.hypot(

                    event.clientX -
                    pointerStartX,

                    event.clientY -
                    pointerStartY

                ) > 8
            ) {

                moved = true;

            }


            if (moved) {

                const x =
                    Math.max(
                        8,
                        Math.min(
                            window.innerWidth - 70,
                            event.clientX - 31
                        )
                    );


                const y =
                    Math.max(
                        8,
                        Math.min(
                            window.innerHeight - 70,
                            event.clientY - 31
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

                openModal();

            }

            dragging = false;

        }
    );


    hybridChatButton.addEventListener(
        "pointercancel",
        () => {

            dragging = false;

        }
    );


    /* =====================================
       CLOSE BUTTON
    ===================================== */

    if (hybridChatClose) {

        hybridChatClose.addEventListener(
            "click",
            closeModal
        );

    }


    hybridChatModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                hybridChatModal
            ) {

                closeModal();

            }

        }
    );


    /* =====================================
       OPEN AI ASSISTANT
    ===================================== */

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

                        "🤖 Assalamu Alaikum! I’m the True Seller AI Assistant. বলুন ভাই, কী জানতে চান? 😊",

                        "bot"

                    );

                }


                setTimeout(
                    () => {

                        aiChatInput?.focus();

                    },
                    100
                );

            }
        );

    }


    /* =====================================
       ADMIN HELP
    ===================================== */

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


    /* =====================================
       BACK BUTTONS
    ===================================== */

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


    /* =====================================
       CHAT FORM
    ===================================== */

    if (aiChatForm) {

        aiChatForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const text =
                    aiChatInput
                        ? aiChatInput.value.trim()
                        : "";


                if (!text) {

                    return;

                }


                await handleAiChat(
                    text
                );

            }
        );

    }

}


/* =========================================
   START
========================================= */

initializeHybridChat();

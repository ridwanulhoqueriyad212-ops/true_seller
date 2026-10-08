import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getDatabase,ref,onValue,push,update}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* ================= FIREBASE ================= */

const firebaseConfig={
 apiKey:"AIzaSyCq2a6RHcI9EU4xA-j-nHwUVsUkqnRb06E",
 authDomain:"true-seller-5f0e7.firebaseapp.com",
 databaseURL:"https://true-seller-5f0e7-default-rtdb.firebaseio.com",
 projectId:"true-seller-5f0e7",
 storageBucket:"true-seller-5f0e7.firebasestorage.app",
 messagingSenderId:"160519174020",
 appId:"1:160519174020:web:078802af43a697f2604fd1"
};

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);

/* ================= SETTINGS ================= */

const BKASH_NUMBER="8801774187877";
const NAGAD_NUMBER="8801717257131";
const WHATSAPP_NUMBER="8801774187877";

/* ================= DOM ================= */

const $=id=>document.getElementById(id);

const productGrid=$("productGrid");
const productCount=$("productCount");
const emptyState=$("emptyState");
const productSearch=$("productSearch");
const clearSearch=$("clearSearch");

const orderModal=$("orderModal");
const closeModal=$("closeModal");
const orderForm=$("orderForm");

const successBox=$("successBox");
const successClose=$("successClose");

const whatsappBtn=$("whatsappBtn");

const bkashPaymentBox=$("bkashPaymentBox");
const nagadPaymentBox=$("nagadPaymentBox");
const bkashNumber=$("bkashNumber");
const nagadNumber=$("nagadNumber");
const bkashTrxId=$("bkashTrxId");
const nagadTrxId=$("nagadTrxId");

const selectedProductId=$("selectedProductId");
const selectedProductName=$("selectedProductName");
const selectedProductPrice=$("selectedProductPrice");
const selectedProductImage=$("selectedProductImage");

let products={};
let searchTerm="";

/* ================= PAYMENT ================= */

if(bkashNumber)bkashNumber.textContent=BKASH_NUMBER;
if(nagadNumber)nagadNumber.textContent=NAGAD_NUMBER;

if(whatsappBtn){
 whatsappBtn.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalamu Alaikum, I need support from True Seller.")}`;
}

/* ================= PRODUCTS ================= */

onValue(ref(db,"products"),snap=>{
 products=snap.val()||{};
 renderProducts();
},err=>console.error("Products error:",err));

function escapeHtml(value){
 return String(value??"")
 .replace(/&/g,"&amp;")
 .replace(/</g,"&lt;")
 .replace(/>/g,"&gt;")
 .replace(/"/g,"&quot;")
 .replace(/'/g,"&#039;");
}

function renderProducts(){

 if(!productGrid)return;

 productGrid.innerHTML="";

 const list=Object.entries(products).filter(([id,p])=>{
  return String(p?.name||"").toLowerCase()
   .includes(searchTerm.trim().toLowerCase());
 });

 if(productCount)productCount.textContent=list.length;

 if(!list.length){
  if(emptyState){
   emptyState.style.display="block";
   const h=emptyState.querySelector("h3");
   const p=emptyState.querySelector("p");
   if(h)h.textContent="No Products Found";
   if(p)p.textContent=searchTerm?
    `No product matches "${searchTerm}".`:
    "We couldn't find any product here.";
  }
  return;
 }

 if(emptyState)emptyState.style.display="none";

 list.forEach(([id,p])=>{

  const stock=Number(p?.stock||0);
  const price=Number(p?.price||0);
  const image=p?.imageUrl||p?.image||"";
  const name=p?.name||"Unnamed Product";

  const card=document.createElement("article");
  card.className="product-card";

  card.innerHTML=`
   <div class="product-image">
    ${
     image
     ?`<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="lazy">`
     :`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:35px">🛍️</div>`
    }
   </div>

   <div class="product-info">

    <h3>${escapeHtml(name)}</h3>

    <div class="product-price">
     ৳${price.toLocaleString()}
    </div>

    <div class="product-stock">
     ${stock>0?`${stock} available`:"Out of stock"}
    </div>

    <button
     class="order-button"
     data-product-id="${escapeHtml(id)}"
     ${stock<=0?"disabled":""}
    >
     ${stock>0?"Order Now":"Out of Stock"}
    </button>

   </div>
  `;

  const btn=card.querySelector(".order-button");

  if(btn&&stock>0){
   btn.addEventListener("click",()=>{
    openOrderModal(id,p);
   });
  }

  productGrid.appendChild(card);
 });
}

/* ================= SEARCH ================= */

productSearch?.addEventListener("input",()=>{
 searchTerm=productSearch.value;
 if(clearSearch)clearSearch.style.display=searchTerm.trim()?"flex":"none";
 renderProducts();
});

clearSearch?.addEventListener("click",()=>{
 searchTerm="";
 if(productSearch){
  productSearch.value="";
  productSearch.focus();
 }
 clearSearch.style.display="none";
 renderProducts();
});

/* ================= ORDER ================= */

function openOrderModal(productId,product){

 const stock=Number(product?.stock||0);

 if(stock<=0){
  alert("Sorry, this product is out of stock.");
  return;
 }

 /*
  IMPORTANT:
  reset first, then set product ID.
  Otherwise reset() clears hidden product ID.
 */

 orderForm?.reset();

 if(selectedProductId)selectedProductId.value=productId;

 if(selectedProductName)
  selectedProductName.textContent=product?.name||"Product";

 if(selectedProductPrice)
  selectedProductPrice.textContent=
   Number(product?.price||0).toLocaleString();

 if(selectedProductImage){
  selectedProductImage.src=product?.imageUrl||product?.image||"";
  selectedProductImage.alt=product?.name||"Product";
 }

 const cod=document.querySelector(
  'input[name="paymentMethod"][value="COD"]'
 );

 if(cod)cod.checked=true;

 hidePaymentBoxes();

 orderModal?.classList.add("active");
 document.body.style.overflow="hidden";
}

function closeOrderModal(){
 orderModal?.classList.remove("active");
 document.body.style.overflow="";
}

closeModal?.addEventListener("click",closeOrderModal);

orderModal?.addEventListener("click",e=>{
 if(e.target===orderModal)closeOrderModal();
});

document.querySelectorAll(
 'input[name="paymentMethod"]'
).forEach(radio=>{
 radio.addEventListener("change",()=>{
  updatePaymentBoxes(radio.value);
 });
});

function updatePaymentBoxes(method){

 hidePaymentBoxes();

 if(method==="bKash"&&bkashPaymentBox)
  bkashPaymentBox.style.display="block";

 if(method==="Nagad"&&nagadPaymentBox)
  nagadPaymentBox.style.display="block";
}

function hidePaymentBoxes(){
 if(bkashPaymentBox)bkashPaymentBox.style.display="none";
 if(nagadPaymentBox)nagadPaymentBox.style.display="none";
}

/* ================= ORDER SUBMIT ================= */

orderForm?.addEventListener("submit",async e=>{

 e.preventDefault();

 const productId=selectedProductId?.value||"";
 const product=products[productId];

 if(!product){
  alert("Product not found. Please refresh the page.");
  return;
 }

 if(Number(product.stock||0)<=0){
  alert("Sorry, this product is out of stock.");
  closeOrderModal();
  return;
 }

 const customerName=$("customerName")?.value.trim()||"";
 const phone=$("customerPhone")?.value.trim()||"";
 const address=$("customerAddress")?.value.trim()||"";

 const paymentMethod=
  document.querySelector(
   'input[name="paymentMethod"]:checked'
  )?.value;

 if(!customerName||!phone||!address||!paymentMethod){
  alert("Please fill in all required information.");
  return;
 }

 let paymentNumber="";
 let trxId="";

 if(paymentMethod==="bKash"){
  paymentNumber=BKASH_NUMBER;
  trxId=bkashTrxId?.value.trim()||"";

  if(!trxId){
   alert("Please enter your bKash TrxID.");
   bkashTrxId?.focus();
   return;
  }
 }

 if(paymentMethod==="Nagad"){
  paymentNumber=NAGAD_NUMBER;
  trxId=nagadTrxId?.value.trim()||"";

  if(!trxId){
   alert("Please enter your Nagad TrxID.");
   nagadTrxId?.focus();
   return;
  }
 }

 const orderButton=
  orderForm.querySelector(".place-order-button");

 const oldHTML=orderButton?.innerHTML||"";

 if(orderButton){
  orderButton.disabled=true;
  orderButton.innerHTML="Placing Order... ⏳";
 }

 try{

  const newOrderRef=push(ref(db,"orders"));

  await update(newOrderRef,{
   id:newOrderRef.key,
   productId,
   productName:product.name||"Product",
   price:Number(product.price||0),
   customerName,
   phone,
   address,
   paymentMethod,
   paymentNumber,
   trxId,
   status:"Pending",
   createdAt:Date.now()
  });

  closeOrderModal();

  successBox?.classList.add("active");

  orderForm.reset();
  hidePaymentBoxes();

 }catch(error){

  console.error("Order error:",error);

  alert("Order could not be placed. Please try again.");

 }finally{

  if(orderButton){
   orderButton.disabled=false;
   orderButton.innerHTML=oldHTML;
  }
 }
});

/* ================= SUCCESS ================= */

successClose?.addEventListener("click",()=>{
 successBox?.classList.remove("active");
});

successBox?.addEventListener("click",e=>{
 if(e.target===successBox)
  successBox.classList.remove("active");
});

/* =========================================================
   TRUE SELLER HYBRID AI ASSISTANT
========================================================= */

const hybridChatButton=$("hybridChatButton");
const hybridChatModal=$("hybridChatModal");
const hybridChatClose=$("hybridChatClose");

const chatChoiceScreen=$("chatChoiceScreen");
const aiAssistantScreen=$("aiAssistantScreen");
const adminHelpScreen=$("adminHelpScreen");

const openAiAssistant=$("openAiAssistant");
const openAdminHelp=$("openAdminHelp");

const aiMessages=$("aiMessages");
const aiChatForm=$("aiChatForm");
const aiChatInput=$("aiChatInput");

let lastChatProductId=null;
let lastChatProduct=null;

/* ================= KNOWLEDGE ================= */

const TRUE_SELLER_KNOWLEDGE={

 owner:{
  bn:"👤 True Seller-এর owner হলেন Touhid Shawon এবং Ridwanul Hoque Riyad। 🤝",
  en:"👤 The owners of True Seller are Touhid Shawon and Ridwanul Hoque Riyad. 🤝",
  bi:"👤 True Seller-er owner holen Touhid Shawon ebong Ridwanul Hoque Riyad. 🤝"
 },

 admin:{
  bn:"👨‍💼 True Seller-এর Admin হলেন Touhid Shawon এবং Riyad Ahmed। 🤝",
  en:"👨‍💼 The admins of True Seller are Touhid Shawon and Riyad Ahmed. 🤝",
  bi:"👨‍💼 True Seller-er admin holen Touhid Shawon ebong Riyad Ahmed. 🤝"
 },

 developer:{
  bn:"💻 True Seller website-এর developer হলেন Ridwanul Hoque Riyad। 🤝",
  en:"💻 The developer of the True Seller website is Ridwanul Hoque Riyad. 🤝",
  bi:"💻 True Seller website-er developer holen Ridwanul Hoque Riyad. 🤝"
 },

 facebook:{
  bn:"📘 আমাদের Facebook Page-এর নাম True Seller। 😊",
  en:"📘 Our Facebook Page name is True Seller. 😊",
  bi:"📘 Amader Facebook Page-er naam True Seller. 😊"
 },

 whatsapp:{
  bn:"📱 Website-এর WhatsApp button-এ click করলেই WhatsApp-এ যোগাযোগ করতে পারবেন। 😊",
  en:"📱 You can contact us by clicking the WhatsApp button on the website. 😊",
  bi:"📱 Website-er WhatsApp button-e click korlei WhatsApp-e jogajog korte parben. 😊"
 },

 delivery:{
  bn:"🚚 True Seller-এর delivery সাধারণত 3 দিনের মধ্যে হয়। 😊",
  en:"🚚 True Seller delivery usually takes 3 days. 😊",
  bi:"🚚 True Seller-er delivery usually 3 diner moddhe hoy. 😊"
 },

 payment:{
  bn:"💳 আমরা bKash, Nagad এবং Cash on Delivery (COD) payment গ্রহণ করি। 😊",
  en:"💳 We accept bKash, Nagad, and Cash on Delivery (COD). 😊",
  bi:"💳 Amra bKash, Nagad ebong Cash on Delivery (COD) payment nei. 😊"
 },

 identity:{
  bn:"🤖 আমি True Seller-এর AI Assistant। Product, price, stock, order এবং True Seller সম্পর্কে তথ্য দিতে পারি। 😊",
  en:"🤖 I am the True Seller AI Assistant. I can help with products, prices, stock, orders, and True Seller information. 😊",
  bi:"🤖 Ami True Seller-er AI Assistant. Product, price, stock, order ebong True Seller-er information dite pari. 😊"
 },

 thanks:{
  bn:"😊 আপনাকেও ধন্যবাদ! True Seller-এ আপনাকে সাহায্য করতে পেরে ভালো লাগছে। 🤝",
  en:"😊 You're welcome! I'm happy to help you at True Seller. 🤝",
  bi:"😊 Apnakeo dhonnobad! True Seller-e apnake help korte pere valo lagche. 🤝"
 },

 fallback:{
  bn:"🤖 দুঃখিত, প্রশ্নটি পুরোপুরি বুঝতে পারিনি। একটু অন্যভাবে লিখুন অথবা Admin Help ব্যবহার করুন। 😊",
  en:"🤖 Sorry, I couldn't fully understand your question. Please try another way or use Admin Help. 😊",
  bi:"🤖 Sorry, apnar question-ta puro bujhte parini. Ektu onno vabe likhun ba Admin Help use korun. 😊"
 }

};

/* ================= ALIASES ================= */

const INTENTS={

 admin:[
  "admin","admn","adminn","admmin","admin ke",
  "admin kara","admins ke","who is admin","who are admin",
  "true seller admin","true seller er admin",
  "trueseller admin","admin name","admin names",
  "admin list","admin der naam","admin der nam",
  "admin er naam","admin er nam","ke admin",
  "kara admin","admin ke ke","admin kara kara",
  "এডমিন","এডমিন কে","এডমিন কারা","এডমিনের নাম",
  "এডমিনদের নাম","এডমিন কে কে","অ্যাডমিন","অ্যাডমিন কে"
 ],

 owner:[
  "owner","owners","owener","onwer","ownr",
  "malik","malik ke","main owner","main malik",
  "proprietor","boss","boss ke","true seller owner",
  "true seller er owner","মালিক","মালিক কে","ওনার"
 ],

 developer:[
  "developer","developar","devoloper","devloper",
  "developper","developr","dev","developer ke",
  "website developer","site developer","web developer",
  "website maker","site maker","ডেভেলপার","ডেভেলপার কে",
  "ওয়েব ডেভেলপার","সাইট কে বানিয়েছে"
 ],

 facebook:[
  "facebook","facebok","facbook","facbok","fb",
  "fb page","facebook page","facebook name","page name",
  "fbook","face book","facebook link","fb link",
  "true seller facebook","trueseller facebook",
  "ফেসবুক","ফেসবুক পেজ","ফেসবুক পেজের নাম","পেজ"
 ],

 whatsapp:[
  "whatsapp","whatsap","watsapp","whtsapp","whatsupp",
  "whats app","whatsappp","whtsap","whatapp",
  "whatsapp link","whatsapp number","whatsapp contact",
  "whats contact","whatsap contact","whatsapp jogajog",
  "whatsapp kothay","হোয়াটসঅ্যাপ","হোয়াটসাপ",
  "হোয়াটসঅ্যাপ নাম্বার"
 ],

 delivery:[
  "delivery","delivary","delivry","delvery","delevary",
  "delivri","delivrey","deliveri","delivaryy","delivryy",
  "delivery charge","delivary charge","delivery fee",
  "delivary fee","delivery time","delivary time",
  "delivery koydin","delivary koydin","delivery koto din",
  "delivary koto din","delivery kotodin","delivery kobe",
  "ডেলিভারি","ডেলিভারি চার্জ","ডেলিভারি কতদিন","ডেলিভারি কবে"
 ],

 payment:[
  "payment","pament","paymant","paymnt","payement","paymet",
  "payment method","pament method","payment kibhabe",
  "payment kivabe","payment ki ki","payment option",
  "pay option","pay kibhabe","pay kivabe","bkash","bkas",
  "bkashh","b kash","bkash payment","nagad","nagod","nagadd",
  "nagad payment","cod","c o d","cash on delivery",
  "পেমেন্ট","পেমেন্ট কিভাবে","বিকাশ","নগদ","ক্যাশ অন ডেলিভারি"
 ],

 identity:[
  "who are you","who r you","who r u","what are you",
  "what r you","what r u","tomar nam","tumar nam",
  "tomar naam","tumar naam","your name","ur name",
  "name ki","name bolo","bot name","ai name","ke tumi",
  "k tumi","tumi ke","apni ke","আপনি কে","তুমি কে",
  "তোমার নাম","তোমার নাম কি","নাম কি","নাম বলো"
 ],

 thanks:[
  "thanks","thank you","thnx","thanx","tanks","thankyou",
  "thank u","thnku","thnks","thankss","tnx","tnks",
  "dhonnobad","donnobad","ধন্যবাদ","থ্যাংকস"
 ]

};

/* ================= NAME ALIASES ================= */

const RIYAD=[
 "riyad","ridwan","tiswan","munn","dionsur",
 "riyyad","riyad bhai","ridwan bhai","riyad vai",
 "ridwan vai","রিয়াদ","রিদওয়ান","তিসওয়ান","মুন্ন","রিয়াদ ভাই"
];

const SHAWON=[
 "shawon","sagwon","abu touhid","abu towhid",
 "touhid shawon","touhid","shawn","shawon bhai",
 "shawon vai","sawon","শাওন","আবু তৌহিদ","তৌহিদ","শাওন ভাই"
];

/* ================= GREETINGS ================= */

const GREETINGS=[
 "hi","hii","hiii","hello","helo","hellow",
 "hey","heyy","hy","salam","slm",
 "salamualaikum","assalamualaikum","assalamu alaikum",
 "asalamualaikum","আসসালামু আলাইকুম","সালাম","হাই","হ্যালো"
];

const HOW_ARE_YOU=[
 "kemon aso","kemon acho","kmn aso","kmn acho",
 "kmon aso","kmon acho","kemon asen","kemon achen",
 "how are you","how r you","how are u",
 "valo acho","bhalo acho","কেমন আছো","কেমন আছেন","ভালো আছো"
];

const WHAT_DO_YOU_DO=[
 "ki koro","ki koros","ki koren","tumi ki koro",
 "apni ki koren","what do you do","what u do",
 "ki kaj koro","ki kaj koren","তুমি কি করো","কি করো"
];

/* ================= FUZZY ================= */

function normalizeChatText(v){
 return String(v||"")
 .toLowerCase()
 .normalize("NFKC")
 .replace(/[؟?!.。,،;:|/\\()[\]{}<>_+=*#@%$^&~`'"“”‘’]/g," ")
 .replace(/[০-৯]/g,d=>String("০১২৩৪৫৬৭৮৯".indexOf(d)))
 .replace(/\s+/g," ")
 .trim();
}

function compactChatText(v){
 return normalizeChatText(v).replace(/\s+/g,"");
}

function levenshtein(a,b){
 if(a===b)return 0;
 if(!a)return b.length;
 if(!b)return a.length;

 const prev=Array.from({length:b.length+1},(_,i)=>i);

 for(let i=1;i<=a.length;i++){
  const cur=[i];

  for(let j=1;j<=b.length;j++){
   cur[j]=Math.min(
    cur[j-1]+1,
    prev[j]+1,
    prev[j-1]+(a[i-1]===b[j-1]?0:1)
   );
  }

  for(let j=0;j<cur.length;j++)
   prev[j]=cur[j];
 }

 return prev[b.length];
}

function fuzzy(a,b){
 a=compactChatText(a);
 b=compactChatText(b);

 if(!a||!b)return false;
 if(a===b||a.includes(b)||b.includes(a))return true;

 const n=Math.max(a.length,b.length);

 if(n<=4)return levenshtein(a,b)<=1;
 if(n<=7)return levenshtein(a,b)<=2;

 return levenshtein(a,b)<=3;
}

function hasIntent(text,aliases){

 const n=normalizeChatText(text);
 const tokens=n.split(" ").filter(Boolean);

 for(const alias of aliases){

  const a=normalizeChatText(alias);

  if(!a)continue;
  if(n.includes(a))return true;

  const parts=a.split(" ").filter(Boolean);

  if(parts.length===1){
   if(tokens.some(t=>fuzzy(t,parts[0])))return true;
  }else{

   for(let i=0;i<=tokens.length-parts.length;i++){

    let ok=true;

    for(let j=0;j<parts.length;j++){
     if(!fuzzy(tokens[i+j],parts[j])){
      ok=false;
      break;
     }
    }

    if(ok)return true;
   }
  }
 }

 return false;
}

/* ================= LANGUAGE ================= */

function detectLanguage(text){

 if(/[\u0980-\u09FF]/.test(text))
  return "bn";

 const words=normalizeChatText(text).split(" ");

 const banglish=[
  "ami","apni","tumi","vai","bhai","kemon",
  "kivabe","kibhabe","koto","koy","ase",
  "ache","achen","aso","acho","chai",
  "lagbe","hobe","korbo","korben","den",
  "dao","dekhaw","amar","tomar","ki","ke",
  "nai","nei","dam","stock","order"
 ];

 if(words.some(w=>banglish.includes(w)))
  return "bi";

 return "en";
}

function reply(key,lang){
 return TRUE_SELLER_KNOWLEDGE[key]?.[lang]||
        TRUE_SELLER_KNOWLEDGE[key]?.en||
        TRUE_SELLER_KNOWLEDGE.fallback.en;
}

/* ================= PRODUCT SEARCH ================= */

function findChatProduct(text){

 const entries=Object.entries(products||{});

 if(!entries.length)return null;

 const n=normalizeChatText(text);

 if(
  lastChatProduct &&
  /\b(this|that|it|eta|ota|etar|otar|eita|oita)\b/.test(n)
  ||lastChatProduct &&
  /এই|ওই|এটার|ওটার|এইটা|ওইটা/.test(n)
 ){
  return lastChatProduct;
 }

 let best=null;
 let scoreBest=0;

 for(const [id,p] of entries){

  const name=normalizeChatText(p?.name||"");
  if(!name)continue;

  let score=0;

  if(n.includes(name))
   score+=10;

  for(const word of name.split(" ")){

   if(word.length<2)continue;

   if(n.includes(word))
    score+=3;
   else if(
    n.split(" ").some(x=>fuzzy(x,word))
   )
    score+=2;
  }

  if(score>scoreBest){
   scoreBest=score;
   best={id,product:p};
  }
 }

 if(best&&scoreBest>=3){

  lastChatProductId=best.id;
  lastChatProduct=best.product;

  return best.product;
 }

 return null;
}

/* ================= PRODUCT INTENT ================= */

function getProductIntent(text){

 const t=normalizeChatText(text);

 return{
  price:
   /\b(price|prce|prise|prize|dam|damm|koto|koy|how much)\b|দাম|মূল্য|কত/.test(t),

  stock:
   /\b(stock|stok|stck|stoke|available|avai|ase|ache)\b|স্টক|আছে|অ্যাভেইলেবল/.test(t),

  show:
   /\b(show|see|dekh|dekhao|dekhaw|product|prodcut|pruduct|item|items)\b|দেখাও|দেখি|পণ্য|প্রোডাক্ট/.test(t)
 };
}

/* ================= PRODUCT REPLY ================= */

function productReply(text,lang){

 const p=findChatProduct(text);
 if(!p)return null;

 const intent=getProductIntent(text);

 const name=p.name||"Product";
 const price=Number(p.price||0).toLocaleString();
 const stock=Number(p.stock||0);

 if(intent.price){

  if(lang==="bn")
   return `🛍️ ${name} এর দাম ৳${price}। 😊`;

  if(lang==="bi")
   return `🛍️ ${name}-er dam ৳${price}. 😊`;

  return `🛍️ ${name} costs ৳${price}. 😊`;
 }

 if(intent.stock){

  if(stock>0){

   if(lang==="bn")
    return `📦 ${name}-এর ${stock} pcs stock আছে। ✅😊`;

   if(lang==="bi")
    return `📦 ${name}-er ${stock} pcs stock ache. ✅😊`;

   return `📦 ${name} has ${stock} pcs in stock. ✅😊`;
  }

  if(lang==="bn")
   return `📦 দুঃখিত, ${name} এখন Out of Stock। 😔`;

  if(lang==="bi")
   return `📦 Sorry, ${name} ekhon out of stock. 😔`;

  return `📦 Sorry, ${name} is currently out of stock. 😔`;
 }

 return `🛍️ ${name} 🔥
💰 Price: ৳${price}
📦 Stock: ${stock} pcs ${stock>0?"✅":"❌"}`;
}

/* ================= ADMIN NAME ================= */

function adminNameReply(text,lang){

 const r=hasIntent(text,RIYAD);
 const s=hasIntent(text,SHAWON);

 if(r&&!s){

  if(lang==="bn")
   return "👨‍💼 Riyad Ahmed (Ridwanul Hoque Riyad) True Seller-এর একজন admin এবং website developer। 💻😊";

  if(lang==="bi")
   return "👨‍💼 Riyad Ahmed (Ridwanul Hoque Riyad) True Seller-er ekjon admin ebong website developer. 💻😊";

  return "👨‍💼 Riyad Ahmed (Ridwanul Hoque Riyad) is an admin of True Seller and the website developer. 💻😊";
 }

 if(s&&!r){

  if(lang==="bn")
   return "👨‍💼 Touhid Shawon True Seller-এর একজন admin। 😊";

  if(lang==="bi")
   return "👨‍💼 Touhid Shawon True Seller-er ekjon admin. 😊";

  return "👨‍💼 Touhid Shawon is an admin of True Seller. 😊";
 }

 return null;
}

/* ================= MAIN RESPONSE ================= */

function getHybridAiResponse(text){

 const lang=detectLanguage(text);

 /* specific admin name first */

 const namedAdmin=adminNameReply(text,lang);
 if(namedAdmin)return namedAdmin;

 /* greeting */

 if(hasIntent(text,HOW_ARE_YOU)){

  if(lang==="bn")
   return "Alhamdulillah, আমি ভালো আছি। আপনি কেমন আছেন? 😊🤝";

  if(lang==="bi")
   return "Alhamdulillah, ami valo achi. Apni kemon achen? 😊🤝";

  return "Alhamdulillah, I am doing well. How are you? 😊🤝";
 }

 if(hasIntent(text,WHAT_DO_YOU_DO)){

  if(lang==="bn")
   return "🤖 আমি True Seller-এর AI Assistant। Product, price, stock, order এবং store information নিয়ে সাহায্য করি। 😊";

  if(lang==="bi")
   return "🤖 Ami True Seller-er AI Assistant. Product, price, stock, order ebong store information niye help kori. 😊";

  return "🤖 I am the True Seller AI Assistant. I help with products, prices, stock, orders, and store information. 😊";
 }

 if(hasIntent(text,GREETINGS)){

  if(lang==="bn")
   return "ওয়ালাইকুমুস সালাম! 😊 True Seller-এ আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি? 🤝";

  if(lang==="bi")
   return "Walaikumussalam! 😊 True Seller-e apnake welcome. Kivabe help korte pari? 🤝";

  return "Hello! 😊 Welcome to True Seller. How can I help you? 🤝";
 }

 /* admin */

 if(hasIntent(text,INTENTS.admin))
  return reply("admin",lang);

 /* owner */

 if(hasIntent(text,INTENTS.owner))
  return reply("owner",lang);

 /* developer */

 if(hasIntent(text,INTENTS.developer))
  return reply("developer",lang);

 /* facebook */

 if(hasIntent(text,INTENTS.facebook))
  return reply("facebook",lang);

 /* whatsapp */

 if(hasIntent(text,INTENTS.whatsapp))
  return reply("whatsapp",lang);

 /* delivery */

 if(hasIntent(text,INTENTS.delivery))
  return reply("delivery",lang);

 /* payment */

 if(hasIntent(text,INTENTS.payment))
  return reply("payment",lang);

 /* identity */

 if(hasIntent(text,INTENTS.identity))
  return reply("identity",lang);

 /* thanks */

 if(hasIntent(text,INTENTS.thanks))
  return reply("thanks",lang);

 /* product */

 const p=productReply(text,lang);
 if(p)return p;

 /* order */

 if(
  /\b(order|ordar|oder|odr|buy|purchase)\b/i.test(text)||
  /অর্ডার|কিভাবে অর্ডার/.test(text)
 ){

  if(lang==="bn")
   return "🛒 Product-এর Order button-এ click করে আপনার নাম, phone number, address এবং payment method দিয়ে order করতে পারবেন। 😊";

  if(lang==="bi")
   return "🛒 Product-er Order button-e click kore apnar naam, phone number, address ebong payment method diye order korte parben. 😊";

  return "🛒 Click the Order button on a product, then provide your name, phone number, address, and payment method. 😊";
 }

 /* casual */

 if(
  /\b(cool|nice|wow|great|good|valo|bhalo)\b/i.test(text)||
  /ভালো|দারুণ/.test(text)
 ){

  if(lang==="bn")
   return "😊 ধন্যবাদ! আরও কিছু জানতে চাইলে বলুন। 🤝";

  if(lang==="bi")
   return "😊 Dhonnobad! Aro kichu jante chaile bolun. 🤝";

  return "😊 Thank you! Feel free to ask anything else. 🤝";
 }

 return reply("fallback",lang);
}

/* ================= CHAT MESSAGE ================= */

function appendAiMessage(text,type="bot",product=null){

 if(!aiMessages)return;

 const bubble=document.createElement("div");

 bubble.className=`ai-message ${type}`;

 bubble.textContent=text;

 if(product){

  const card=document.createElement("div");
  card.className="ai-product";

  const img=document.createElement("img");
  img.src=product.image||product.imageUrl||"";
  img.alt=product.name||"Product";

  const info=document.createElement("div");

  const strong=document.createElement("strong");
  strong.textContent=product.name||"Product";

  const span=document.createElement("span");

  span.textContent=
   `💰 ৳${Number(product.price||0).toLocaleString()} • 📦 ${Number(product.stock||0)} pcs`;

  info.append(strong,span);
  card.append(img,info);
  bubble.append(card);
 }

 aiMessages.appendChild(bubble);
 aiMessages.scrollTop=aiMessages.scrollHeight;
}

/* ================= CHAT UI ================= */

function initializeHybridChat(){

 if(!hybridChatButton||!hybridChatModal)return;

 const openChat=()=>{
  hybridChatModal.classList.add("active");
  hybridChatModal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
 };

 const closeChat=()=>{
  hybridChatModal.classList.remove("active");
  hybridChatModal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
 };

 const showScreen=screen=>{
  [
   chatChoiceScreen,
   aiAssistantScreen,
   adminHelpScreen
  ].forEach(x=>x?.classList.remove("active"));

  screen?.classList.add("active");
 };

 /* ================= DRAG ================= */

 let sx=0;
 let sy=0;
 let dragging=false;
 let moved=false;

 hybridChatButton.addEventListener("pointerdown",e=>{
  dragging=true;
  moved=false;
  sx=e.clientX;
  sy=e.clientY;
  hybridChatButton.setPointerCapture?.(e.pointerId);
 });

 hybridChatButton.addEventListener("pointermove",e=>{

  if(!dragging)return;

  if(
   Math.hypot(
    e.clientX-sx,
    e.clientY-sy
   )>8
  )moved=true;

  if(moved){

   const x=Math.max(
    8,
    Math.min(
     window.innerWidth-70,
     e.clientX-31
    )
   );

   const y=Math.max(
    8,
    Math.min(
     window.innerHeight-70,
     e.clientY-31
    )
   );

   hybridChatButton.style.left=`${x}px`;
   hybridChatButton.style.top=`${y}px`;
   hybridChatButton.style.right="auto";
   hybridChatButton.style.bottom="auto";
  }
 });

 hybridChatButton.addEventListener("pointerup",()=>{
  if(dragging&&!moved)openChat();
  dragging=false;
 });

 hybridChatButton.addEventListener("pointercancel",()=>{
  dragging=false;
 });

 /* ================= CLOSE ================= */

 hybridChatClose?.addEventListener(
  "click",
  closeChat
 );

 hybridChatModal.addEventListener(
  "click",
  e=>{
   if(e.target===hybridChatModal)
    closeChat();
  }
 );

 /* ================= AI ================= */

 openAiAssistant?.addEventListener(
  "click",
  ()=>{

   showScreen(aiAssistantScreen);

   if(
    aiMessages&&
    !aiMessages.children.length
   ){

    appendAiMessage(
     "🤖 Assalamu Alaikum! I’m the True Seller AI Assistant. How can I help you? 😊"
    );
   }

   setTimeout(
    ()=>aiChatInput?.focus(),
    0
   );
  }
 );

 /* ================= ADMIN HELP ================= */

 openAdminHelp?.addEventListener(
  "click",
  ()=>{
   showScreen(adminHelpScreen);
  }
 );

 /* ================= BACK ================= */

 document
 .querySelectorAll("[data-chat-back]")
 .forEach(btn=>{
  btn.addEventListener(
   "click",
   ()=>{
    showScreen(chatChoiceScreen);
   }
  );
 });

 /* ================= CHAT FORM ================= */

 aiChatForm?.addEventListener(
  "submit",
  e=>{

   e.preventDefault();

   const text=aiChatInput?.value.trim();

   if(!text)return;

   appendAiMessage(
    text,
    "user"
   );

   if(aiChatInput)
    aiChatInput.value="";

   /*
      NO ARTIFICIAL DELAY
   */

   const answer=
    getHybridAiResponse(text);

   appendAiMessage(
    answer,
    "bot"
   );
  }
 );
}

initializeHybridChat();

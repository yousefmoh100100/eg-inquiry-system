(function() {
    emailjs.init("YOUR_PUBLIC_KEY");
})();

document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = ['birthDate', 'dateStart', 'dateEnd'];
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.setAttribute('maxlength', '10');
            input.addEventListener('input', function(e) {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 8) v = v.slice(0, 8);
                if (v.length > 4) v = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4);
                else if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                e.target.value = v;
            });
        }
    });
});

function parseDateInput(str) {
    const parts = str.split('/');
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[0] - 1, parts[1]);
}

let isFirstTrial = localStorage.getItem("isFirstTrial") !== "false";
let isActivated = localStorage.getItem("isActivated") === "true";
let usedServices = JSON.parse(localStorage.getItem("usedServices") || "[]");

const mainDeveloperCode = "8978008978";
const dailyCodes = ["DAY9102", "DAY4821", "DAY7305", "DAY1198", "DAY6543", "DAY8812", "DAY3097", "DAY5521", "DAY4076", "DAY9234"];
const monthlyCodes = ["MON8832", "MON1945", "MON7621", "MON5540", "MON3391", "MON8072", "MON2219", "MON6684", "MON4405", "MON9152"];

const plateGovs = {
    "أ": "القاهرة", "ب": "القاهرة", "ج": "القاهرة", "د": "القاهرة", "ه": "القاهرة", "و": "القاهرة", "ى": "القاهرة",
    "ق": "الجيزة", "ر": "الجيزة", "س": "الجيزة",
    "سأ": "الإسكندرية", "سب": "الإسكندرية", "سج": "الإسكندرية", "سد": "الإسكندرية",
    "رأ": "الشرقية", "رب": "الشرقية", "رج": "الشرقية", "رد": "الشرقية",
    "دأ": "الدقهلية", "دب": "الدقهلية", "دج": "الدقهلية", "دد": "الدقهلية",
    "نط": "الدقهلية", "نطب": "الدقهلية", "ن": "الدقهلية",
    "قأ": "القليوبية", "قب": "القليوبية", "قج": "القليوبية", "قد": "القليوبية",
    "طأ": "الغربية", "طب": "الغربية", "طج": "الغربية", "طد": "الغربية",
    "mأ": "المنوفية", "مب": "المنوفية", "مج": "المنوفية", "مد": "المنوفية",
    "بأ": "البحيرة", "بب": "البحيرة", "بج": "البحيرة", "بد": "البحيرة",
    "جأ": "دمياط", "جب": "دمياط", "جج": "دمياط", "جد": "دمياط",
    "لأ": "كفر الشيخ", "لب": "كفر الشيخ", "لج": "كفر الشيخ", "لد": "كفر الشيخ",
    "نأ": "الفيوم", "نب": "الفيوم", "نج": "الفيوم", "nd": "الفيوم",
    "وأ": "بني سويف", "وب": "بني سويف", "وج": "بني سويف", "ود": "بني سويف",
    "عأ": "المنيا", "عب": "المنيا", "عج": "المنيا", "عد": "المنيا",
    "يأ": "أسيوط", "يب": "أسيوط", "يج": "أسيوط", "يد": "أسيوط",
    "هأ": "سوهاج", "هب": "سوهاج", "هج": "سوهاج", "هد": "سوهاج",
    "فأ": "قنا", "فb": "قنا", "فج": "قنا", "فد": "قنا",
    "صأ": "أسوان",
    "طه": "بورسعيد", "طي": "الإسماعيلية", "طق": "السويس", "طو": "شمال سيناء",
    "طص": "جنوب سيناء", "طر": "البحر الأحمر", "طود": "الوادي الجديد", "طط": "الأقصر",
    "طج": "مطروح"
};

const govData = [
    { name: "شهادة ميلاد مميكنة", price: 50 },
    { name: "بدل فاقد بطاقة رقم قومي", price: 75 },
    { name: "وثيقة زواج", price: 120 },
    { name: "وثيقة طلاق", price: 120 },
    { name: "شهادة وفاة", price: 50 },
    { name: "فيش وتشبيه", price: 100 },
    { name: "جواز سفر", price: 750 },
    { name: "رخصة قيادة خاصة", price: 450 },
    { name: "تجديد رخصة سيارة", price: 800 },
    { name: "توكيل عام شهر عقاري", price: 30 },
    { name: "قيد عائلي", price: 65 },
    { name: "بطاقة تموين بدل فاقد", price: 40 },
    { name: "تصريح عمل", price: 120 },
    { name: "شهادة تحركات", price: 100 },
    { name: "تجديد رخصة دراجة نارية", price: 350 },
    { name: "استخراج بطاقة ضريبية", price: 250 },
    { name: "شهادة تخرج جامعية", price: 150 },
    { name: "عقد إيجار موثق", price: 200 },
    { name: "نقل ملكية سيارة", price: 1200 },
    { name: "إخطار سداد مخالفات مرور", price: 50 },
    { name: "بدل تالف بطاقة تموين", price: 30 },
    { name: "استخراج قيد فردي", price: 45 },
    { name: "تصريح دفن", price: 20 },
    { name: "تجديد بطاقة رقم قومي", price: 50 },
    { name: "استخراج وثيقة ميلاد إلكترونية", price: 60 },
    { name: "شهادة بيانات مركبة", price: 100 },
    { name: "رخصة قيادة مهنية", price: 600 },
    { name: "شهادة ميلاد (نسخة إضافية)", price: 30 },
    { name: "استخراج برنت تأميني", price: 20 },
    { name: "تغيير محل الإقامة", price: 70 },
    { name: "استخراج فيش جنائي مميكن", price: 150 },
    { name: "عقد بيع سيارة", price: 500 },
    { name: "تصديق على محرر عرفي", price: 100 },
    { name: "تسجيل بيانات بطاقة تموين", price: 25 },
    { name: "شهادة خلو من الأمراض", price: 200 },
    { name: "استخراج بدل فاقد رخصة قيادة", price: 300 },
    { name: "استخراج جواز سفر بدل تالف", price: 1000 },
    { name: "طلب الحصول على وظيفة حكومية", price: 50 },
    { name: "طلب إجازة بدون راتب", price: 0 },
    { name: "استخراج بطاقة متعطل", price: 100 }
];

window.onload = function() {
    if (isFirstTrial || isActivated) {
        document.getElementById("services-wrapper").style.display = "block";
        document.getElementById("activation-area").style.display = "none";
        const select = document.getElementById("govServiceSelect");
        if(select) {
            govData.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
            govData.forEach(item => {
                let opt = document.createElement("option");
                opt.value = item.name;
                opt.innerHTML = item.name;
                select.appendChild(opt);
            });
        }
    } else {
        document.getElementById("services-wrapper").style.display = "none";
        document.getElementById("activation-area").style.display = "block";
    }
};

function showAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    if (alertBox) {
        alertBox.innerHTML = message;
        alertBox.style.display = "block";
        setTimeout(() => { alertBox.style.display = "none"; }, 3000);
    } else { alert(message); }
}

function checkActivation() {
    const code = document.getElementById("activationCode").value.trim();
    if (code === mainDeveloperCode || dailyCodes.includes(code) || monthlyCodes.includes(code)) {
        localStorage.setItem("isActivated", "true");
        isActivated = true;
        document.getElementById("services-wrapper").style.display = "block";
        document.getElementById("activation-area").style.display = "none";
        showAlert("تم التفعيل بنجاح!");
    } else { showAlert("كود غير صحيح."); }
}

function markServiceUsed(serviceName) {
    usedServices.push(serviceName);
    localStorage.setItem("usedServices", JSON.stringify(usedServices));
}

function checkAccess(serviceName) {
    if (isActivated || !usedServices.includes(serviceName)) return true;
    document.getElementById("services-wrapper").style.display = "none";
    document.getElementById("activation-area").style.display = "block";
    showAlert("يرجى التفعيل للاستمرار.");
    return false;
}

function formatPlateLetters(input) { let value = input.value.replace(/\s+/g, ''); input.value = value.split('').join(' '); }
function formatPlateNumbers(input) { let value = input.value.replace(/\s+/g, ''); input.value = value.split('').join(' '); }

function resPlate() {
    if (!checkAccess("اللوحة")) return;
    const lettersInput = document.getElementById("vLetters").value.trim();
    const numbersInput = document.getElementById("vNumbers").value.trim();
    const out = document.getElementById("outCar");
    if (!lettersInput || !numbersInput) { out.style.display = "block"; out.innerHTML = "أدخل الحروف والأرقام."; return; }
    const cleanLetters = lettersInput.replace(/\s+/g, '');
    const cleanNumbers = numbersInput.replace(/\s+/g, '');
    let govName = "غير معروفة";
    if (plateGovs[cleanLetters]) { govName = plateGovs[cleanLetters]; } 
    else if (cleanLetters.length >= 2 && plateGovs[cleanLetters.substring(0, 2)]) { govName = plateGovs[cleanLetters.substring(0, 2)]; }
    else if (plateGovs[cleanLetters[0]]) { govName = plateGovs[cleanLetters[0]]; }
    out.style.display = "block";
    out.innerHTML = "<b>🚗 بيانات اللوحة:</b> " + cleanLetters.split('').join(' ') + " - " + cleanNumbers.split('').join(' ') + "<br><b>📍 المحافظة:</b> " + govName;
    markServiceUsed("اللوحة");
}

function getZodiacSign(day, month) {
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "الدلو ♒";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "الحوت ♓";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "الحمل ♈";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "الثور ♉";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "الجوزاء ♊";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "السرطان ♋";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "الأسد 👑";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "العذراء ♍";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "الميزان ♎";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "العقرب ♏";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "القوس ♐";
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "الجدي ♑";
    return "غير معروف";
}

function resNID() {
    if (!checkAccess("الرقم القومي")) return;
    const id = document.getElementById("nID").value.trim();
    const out = document.getElementById("outNID");
    if (id.length !== 14 || isNaN(id)) { out.style.display = "block"; out.innerHTML = "يرجى كتابة 14 رقماً."; return; }
    const century = id[0] == '2' ? "19" : "20";
    const birthYear = parseInt(century + id.substring(1, 3));
    const birthMonth = parseInt(id.substring(3, 5));
    const birthDay = parseInt(id.substring(5, 7));
    const govCode = id.substring(7, 9);
    const governorates = { "01": "القاهرة", "02": "الإسكندرية", "03": "بورسعيد", "04": "السويس", "11": "دمياط", "12": "الدقهلية", "13": "الشرقية", "14": "القليوبية", "15": "كفر الشيخ", "16": "الغربية", "17": "المنوفية", "18": "البحيرة", "19": "الإسماعيلية", "21": "الجيزة", "22": "بني سويف", "23": "الفيوم", "24": "المنيا", "25": "أسيوط", "26": "سوهاج", "27": "قنا", "28": "أسوان", "29": "الأقصر", "31": "البحر الأحمر", "32": "الوادي الجديد", "33": "مطروح", "34": "شمال سيناء", "35": "جنوب سيناء" };
    const gender = (parseInt(id.charAt(12)) % 2 === 0) ? "أنثى ♀️" : "ذكر ♂️";
    out.style.display = "block";
    out.innerHTML = "<b>📅 الميلاد:</b> " + birthDay + "/" + birthMonth + "/" + birthYear + "<br><b>📍 المحافظة:</b> " + (governorates[govCode] || "خارج مصر") + "<br><b>👤 الجنس:</b> " + gender + "<br><b>🌟 البرج:</b> " + getZodiacSign(birthDay, birthMonth);
    markServiceUsed("الرقم القومي");
}

function resBarcode() {
    if (!checkAccess("الباركود")) return;
    const fullBarcode = document.getElementById("barcodeInput").value.trim();
    const out = document.getElementById("outBarcode");
    if (!fullBarcode || isNaN(fullBarcode)) { out.style.display = "block"; out.innerHTML = "أدخل أرقام صحيحة."; return; }
    const val = parseInt(fullBarcode.substring(0, 3));
    let country = (val === 622) ? "مصر 🇪🇬" : (val >= 400 && val <= 440) ? "ألمانيا 🇩🇪" : (val >= 690 && val <= 699) ? "الصين 🇨🇳" : "غير معروف";
    out.style.display = "block";
    out.innerHTML = "<b>🔍 الباركود:</b> " + fullBarcode.substring(0, 3) + "<br><b>📦 المنشأ:</b> " + country;
    markServiceUsed("الباركود");
}

function resTamween() {
    if (!checkAccess("التموين")) return;
    const members = parseInt(document.getElementById("familyMembers").value.trim());
    const out = document.getElementById("outTamween");
    if (isNaN(members) || members <= 0) { out.style.display = "block"; out.innerHTML = "أدخل عدد أفراد صحيح."; return; }
    let tamweenCash = (members <= 4) ? members * 50 : (4 * 50) + ((members - 4) * 25);
    out.style.display = "block";
    out.innerHTML = `<div style="text-align:right;"><b>💳 تفاصيل حصة التموين:</b><br>• عدد الأفراد: ${members}<br>• دعم السلع: ${tamweenCash} جنيه<br>• حصة العيش اليومية: ${members * 5} رغيف<br>• حصة العيش الشهرية: ${members * 5 * 30} رغيف</div>`;
    markServiceUsed("التموين");
}

function resAge() {
    if (!checkAccess("العمر")) return;
    const birthDate = parseDateInput(document.getElementById("birthDate").value);
    const today = new Date();
    const out = document.getElementById("outAge");
    if (!birthDate || isNaN(birthDate)) { out.style.display = "block"; out.innerHTML = "تاريخ غير صحيح. اكتب: شهر/يوم/سنة"; return; }
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (days < 0) { months--; days += 30; }
    if (months < 0) { years--; months += 12; }
    out.style.display = "block";
    out.innerHTML = "<b>🎂 العمر:</b> " + years + " سنة و " + months + " شهر و " + days + " يوم.";
    markServiceUsed("العمر");
}

function resLoan() {
    if (!checkAccess("القرض")) return;
    const amount = parseFloat(document.getElementById("loanAmount").value.trim());
    const years = parseFloat(document.getElementById("loanYears").value.trim());
    const rate = parseFloat(document.getElementById("interestRate").value.trim());
    const out = document.getElementById("outLoan");
    if (isNaN(amount) || isNaN(years) || isNaN(rate) || amount <= 0) { out.style.display = "block"; out.innerHTML = "أدخل بيانات صحيحة."; return; }
    const r = (rate / 100) / 12;
    const n = years * 12;
    const monthly = (rate === 0) ? (amount / n) : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    out.style.display = "block";
    out.innerHTML = `<div style="text-align:right;"><b>💰 تفاصيل القرض:</b><br>• القسط الشهري: ${monthly.toFixed(2)} جنيه<br>• عدد الأقساط: ${n} شهر<br>• إجمالي الفوائد: ${(monthly * n - amount).toFixed(2)} جنيه<br>• الإجمالي المدفوع: ${(monthly * n).toFixed(2)} جنيه</div>`;
    markServiceUsed("القرض");
}

function resElectricity() {
    if (!checkAccess("الكهرباء")) return;
    const kwh = parseFloat(document.getElementById("kwhInput").value.trim());
    const out = document.getElementById("outElectricity");
    if (isNaN(kwh) || kwh < 0) { out.style.display = "block"; out.innerHTML = "أدخل استهلاكاً صحيحاً."; return; }
    let cost = 0;
    let details = "";
    if (kwh <= 50) { cost = kwh * 0.58; details = "الشريحة الأولى (0-50 ك.و)"; } 
    else if (kwh <= 100) { cost = (50 * 0.58) + ((kwh - 50) * 0.68); details = "الشريحة الثانية (51-100 ك.و)"; } 
    else if (kwh <= 200) { cost = (50 * 0.58) + (50 * 0.68) + ((kwh - 100) * 0.83); details = "الشريحة الثالثة (101-200 ك.و)"; } 
    else { cost = (50 * 0.58) + (50 * 0.68) + (100 * 0.83) + ((kwh - 200) * 1.25); details = "الشريحة الرابعة (أكثر من 200 ك.و)"; }
    out.style.display = "block";
    out.innerHTML = `<div style="text-align:right;"><b>⚡ تفاصيل الفاتورة:</b><br>• الاستهلاك: ${kwh} كيلووات<br>• الشريحة: ${details}<br>• التكلفة التقديرية: <b>${cost.toFixed(2)}</b> جنيه</div>`;
    markServiceUsed("الكهرباء");
}

function resBMR() {
    if (!checkAccess("الحرق")) return;
    const weight = parseFloat(document.getElementById("bmiWeight").value.trim());
    const height = parseFloat(document.getElementById("bmiHeight").value.trim());
    const age = parseFloat(document.getElementById("bmiAge").value.trim());
    const bmr = (document.getElementById("bmiGender").value === "male") ? 88 + (13 * weight) + (4 * height) - (5 * age) : 447 + (9 * weight) + (3 * height) - (4 * age);
    const out = document.getElementById("outBMR");
    out.style.display = "block";
    out.innerHTML = "<b>🔥 الحرق اليومي:</b> " + bmr.toFixed(0) + " سعرة.";
    markServiceUsed("الحرق");
}

function resChargeCode() {
    if (!checkAccess("الشحن")) return;
    const telecom = document.getElementById("telecomCompany").value;
    const code = document.getElementById("scratchCardCode").value.trim();
    const codes = { "vodafone": `*858*${code}#`, "orange": `*102*${code}#`, "etisalat": `*556*${code}#`, "we": `*555*${code}#` };
    const out = document.getElementById("outCharge");
    out.style.display = "block";
    out.innerHTML = "<b>📞 كود الشحن:</b> " + codes[telecom];
    markServiceUsed("الشحن");
}

function resUnits() {
    if (!checkAccess("الوحدات")) return;
    const val = parseFloat(document.getElementById("valInput").value.trim());
    const type = document.getElementById("unitType").value;
    const out = document.getElementById("outUnits");
    let res = (type === "kg_lb") ? val * 2.204 : (type === "m_ft") ? val * 3.28 : val * 0.393;
    out.style.display = "block";
    out.innerHTML = "<b>📏 النتيجة:</b> " + res.toFixed(2);
    markServiceUsed("الوحدات");
}

function resDateDiff() {
    if (!checkAccess("التاريخ")) return;
    const d1 = parseDateInput(document.getElementById("dateStart").value);
    const d2 = parseDateInput(document.getElementById("dateEnd").value);
    const diff = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
    const out = document.getElementById("outDateDiff");
    out.style.display = "block";
    out.innerHTML = "<b>📅 الفرق:</b> " + (isNaN(diff) ? 0 : diff) + " يوم.";
    markServiceUsed("التاريخ");
}

function resSubsidy() {
    if (!checkAccess("الدعم")) return;
    const income = parseFloat(document.getElementById("incomeInput").value.trim());
    const out = document.getElementById("outSubsidy");
    if (isNaN(income)) { out.style.display = "block"; out.innerHTML = "يرجى إدخال الدخل."; return; }
    let status = (income < 3000) ? "مستحق مبدئياً" : "غير مستحق (تجاوز حد الدخل)";
    out.style.display = "block";
    out.innerHTML = `<div style="text-align:right;"><b>📊 النتيجة:</b><br>• الحالة: <b>${status}</b><br><small>* استرشادي فقط، القرار للجهة المختصة.</small></div>`;
    markServiceUsed("الدعم");
}

function resGovServiceBtn() {
    const selectedName = document.getElementById("govServiceSelect").value;
    const out = document.getElementById("outGovFees");
    if (!selectedName) { showAlert("يرجى اختيار خدمة أولاً!"); return; }
    const service = govData.find(s => s.name === selectedName);
    if (service) {
        out.style.display = "block";
        out.innerHTML = `<b>📋 تفاصيل الرسوم:</b><br>• الخدمة: ${service.name}<br>• التكلفة: <b>${service.price} جنيه</b>`;
        markServiceUsed(selectedName);
    }
}

function logoutAdmin() {
    localStorage.removeItem("isActivated");
    localStorage.removeItem("usedServices");
    localStorage.removeItem("isFirstTrial");
    location.reload();
}

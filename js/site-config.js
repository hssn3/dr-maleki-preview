/* ============================================================
   تنظیمات مرکزی اطلاعات تماس و شبکه‌های اجتماعی سایت
   برای تغییر شماره‌ها یا آدرس‌ها، فقط همین فایل را ویرایش کنید.
   (از پنل مدیریت هم قابل تولید است)
   ============================================================ */
var SITE_CONFIG = {
  phone1_display: "۰۹۱۰۰۴۷۶۰۰۳",
  phone1_tel: "+989100476003",
  phone2_display: "۰۹۱۰۰۴۷۱۰۰۹",
  phone2_tel: "+989100471009",
  whatsapp_num: "989100471009",
  instagram_url: "https://www.instagram.com/dr.fariborzmaleki/",
  telegram_url: "https://t.me/dr_fariborzmaleki",
  aparat_url: "https://www.aparat.com/drmaleki",
  bale_url: "https://ble.ir/drmaleki",
  address: "تهران، سعادت‌آباد، بلوار دریا، برج پزشکان ملکی، طبقه ۴"
};

(function () {
  function apply() {
    var c = SITE_CONFIG;
    try {
      /* --- لینک‌ها: تلفن، واتس‌اپ، تلگرام، اینستاگرام، آپارات، بله --- */
      var wa = "https://wa.me/" + c.whatsapp_num;
      document.querySelectorAll('a[href^="tel:"]').forEach(function (a) { a.href = "tel:" + c.phone1_tel; });
      document.querySelectorAll('a[href^="https://wa.me/"], a[href^="http://wa.me/"]').forEach(function (a) { a.href = wa; });
      document.querySelectorAll('a[href*="instagram.com"]').forEach(function (a) { a.href = c.instagram_url; });
      document.querySelectorAll('a[href*="t.me/"]').forEach(function (a) { a.href = c.telegram_url; });
      document.querySelectorAll('a[href*="aparat.com"]').forEach(function (a) { a.href = c.aparat_url; });
      document.querySelectorAll('a[href*="ble.ir"]').forEach(function (a) { a.href = c.bale_url; });

      /* --- نوار بالا: آدرس و شماره‌ها --- */
      var topbarAddr = document.querySelector(".topbar .container > div:first-child");
      if (topbarAddr) topbarAddr.textContent = "📍 " + c.address;
      var topbarPhone = document.querySelector(".topbar .hide-m");
      if (topbarPhone)
        topbarPhone.innerHTML = c.phone1_display + ' | <a href="tel:' + c.phone2_tel + '">' + c.phone2_display + "</a>";

      /* --- فوتر: ستون تماس --- */
      var footerBoxes = document.querySelectorAll(".footer-grid > div");
      var contactBox = footerBoxes[footerBoxes.length - 1];
      if (contactBox) {
        var ps = contactBox.querySelectorAll("p");
        if (ps[0]) ps[0].textContent = c.address;
        if (ps[1]) ps[1].textContent = c.phone1_display;
      }
    } catch (e) { /* ignore */ }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", apply);
  else apply();
  /* برای استفاده پنل ادمین: */
  window.SITE_CONFIG_APPLY = apply;
})();

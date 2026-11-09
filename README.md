# AI FILM STUDIO — Autonomous AI Video Production Platform

<p align="center">
  <strong>پلتفرم خودمختار تولید فیلم و محتوای سینمایی با هوش مصنوعی</strong><br>
  <em>From Idea to Cinema — Fully Autonomous Video Production Studio powered by Google Gemini & Nano Banana</em>
</p>

---

## 🌟 معرفی پروژه (Introduction)

**AI FILM STUDIO** یک استودیوی کامل و خودمختار تولید فیلم است که با استفاده از مدل‌های پیشرفته گوگل طراحی شده است. کاربر فقط یک موضوع یا ایده خام وارد می‌کند و سیستم به عنوان یک تیم ۱۰ نفره متخصص سینما مراحل زیر را به صورت خودکار مدیریت می‌کند:

```
IDEA ➔ STORY ➔ SCRIPT ➔ SCENES ➔ BEATS ➔ CHARACTERS ➔ STYLE BIBLE ➔ IMAGES ➔ VOICEOVER ➔ VIDEO PROMPTS ➔ FINAL PRODUCTION
```

### 🎬 نقش‌های تیم مجازی هوش مصنوعی:
1. **مدیر خلاقیت و ایده‌پرداز سینمایی:** خلق موضوعات بکر و تعلیق‌های داستانی
2. **سناریونیست حرفه‌ای:** نگارش فیلمنامه با ساختار ۵ مرحله‌ای (Hook، مقدمه، گسترش، اوج، پایان)
3. **کارگردان سینما:** دکوپاژ و سکانس‌بندی دقیق
4. **طراح استوری‌بورد و شات:** تعیین نوع قاب، زاویه لنز، حرکت دوربین و نورپردازی
5. **طراح شخصیت (Character Bible):** تعیین مشخصات چهره، مو، لباس و استخوان‌بندی
6. **مدیر هنری:** طراحی پالت رنگ، بافت ۳۵ میلی‌متری و اتمسفر بصری (Visual Style Bible)
7. **تولید تصویر با Nano Banana:** رندر پلان‌ها با مدل `gemini-3.1-flash-lite-image` و حفظ ثبات چهره
8. **گویندگی و نریشن هوشمند:** تولید گفتار چندزبانه با `gemini-3.8-flash-lite-tts`
9. **متحرک‌سازی با Google Veo:** ساخت پرامپت‌های ویدیویی دقیق بدون اعوجاج
10. **تدوینگر استودیو نهایی:** خط زمانی تعاملی (Timeline Player) و پکیج خروجی فشرده (ZIP)

---

## 🚀 ویژگی‌های کلیدی (Key Features)

- **رابط کاربری سینمایی مدرن:** دارک‌مود اختصاصی با تم طلایی/کهربایی، کاملاً راست‌چین (RTL) و فونت وزیرمتن
- **طراحی Mobile-First:** کاملاً ریسپانسیو و بهینه‌شده برای صفحات لمسی و موبایل
- **تولید خودکار پروژه (Auto-Pilot):** اجرای یکپارچه تمامی ۸ مرحله تولید با امکان توقف موقت و ادامه
- **سیستم ثبات چهره (Character Consistency):** تولید نماهای مرجع (Front, 3/4, Profile, Full Body) و ارجاع در تمام پرامپت‌ها
- **پلیر خط زمانی (Cinematic Timeline):** پخش هماهنگ فریم‌های تصویری به همراه نریشن صوتی
- **خروجی بسته پروژه (ZIP Export):** دانلود تمام تصاویر شماره‌گذاری‌شده، صداهای نریشن، پرامپت‌ها و فیلمنامه به صورت یکجا
- **دانلود سورس‌کد برای گیت‌هاب:** امکان دانلود سورس کامل پروژه به صورت ZIP از داخل پنل

---

## 🛠 تکنولوژی‌های استفاده‌شده (Tech Stack)

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express
- **AI Engine:** Google GenAI SDK (`@google/genai`)
  - **Text & Reasoning:** `gemini-3.8-flash`
  - **Image Generation:** `gemini-3.1-flash-lite-image` (Nano Banana)
  - **Speech & Audio (TTS):** `gemini-3.8-flash-lite-tts`
  - **Video Generation:** `gemini-omni-1.2-flash` (Veo / Video)
- **Archive & Storage:** JSZip, LocalStorage persistence

---

## 📦 نحوه راه‌اندازی و اجرا (Getting Started)

### ۱. کلون کردن مخزن (Clone Repository)
```bash
git clone https://github.com/your-username/ai-film-studio.git
cd ai-film-studio
```

### ۲. نصب وابستگی‌ها (Install Dependencies)
```bash
npm install
```

### ۳. تنظیم متغیرهای محیطی (Environment Variables)
یک فایل `.env` بر اساس نمونه بسازید:
```bash
cp .env.example .env
```
سپس کلید API گوگل خود را در آن وارد کنید:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### ۴. اجرای محیط توسعه (Run Development Server)
```bash
npm run dev
```
سپس مرورگر را باز کرده و به آدرس `http://localhost:3000` مراجعه فرمایید.

### ۵. بیلد نهایی پروژه (Production Build)
```bash
npm run build
npm start
```

---

## 📁 ساختار پوشه‌ها (Project Structure)

```
.
├── server.ts                 # سرور Express با روت‌های API هوش مصنوعی
├── index.html                # صفحه اصلی با فونت وزیرمتن و RTL
├── package.json              # وابستگی‌ها و اسکریپت‌ها
├── vite.config.ts            # تنظیمات Vite و Tailwind
├── tsconfig.json             # تنظیمات تایپ‌اسکریپت
├── src/
│   ├── main.tsx              # نقطه ورود React
│   ├── App.tsx               # هدایت‌کننده مرکزی مراحل و استیت
│   ├── index.css             # استایل‌های تم سینمایی و گرین
│   ├── types/
│   │   └── filmStudio.ts     # تعاریف داده‌ای فیلمنامه، صحنه‌ها و شخصیت‌ها
│   ├── services/
│   │   ├── api.ts            # توابع ارتباط با بک‌اند Gemini و Nano Banana
│   │   └── storage.ts        # ذخیره‌سازی محلی و دیتای نمونه
│   └── components/
│       ├── Navbar.tsx            # هدر استودیو و دکمه دانلود گیت‌هاب
│       ├── DashboardView.tsx     # داشبورد اصلی و آمار
│       ├── Step1Topic.tsx        # انتخاب موضوع و ایده‌پردازی
│       ├── Step2Settings.tsx     # تنظیمات نسبت تصویر، سبک و زبان
│       ├── Step3Story.tsx        # فیلمنامه‌نویسی و بازنویسی
│       ├── Step4ScenesAndBeats.tsx # دکوپاژ، سکانس‌ها و پلان‌ها
│       ├── Step5Characters.tsx   # کاراکتر بایبل و عکس‌های مرجع
│       ├── Step6VisualStyle.tsx  # پالت رنگی و استایل بصری
│       ├── Step7BeatImages.tsx   # رندر تصاویر با Nano Banana
│       ├── Step8Voiceover.tsx    # نریشن و صداگذاری صوتی
│       ├── Step9Video.tsx        # ویدیو با Google Veo
│       ├── Step10AutoPilotModal.tsx # اجرای خودکار ۸ مرحله
│       ├── Step11FinalStudio.tsx # پلیر تدوین و دانلود پکیج
│       └── ProjectsModal.tsx     # مدیریت پروژه‌ها
└── README.md
```

---

## 📄 لایسنس (License)

این پروژه تحت لایسنس **Apache-2.0** منتشر شده است.
با افتخار تقدیم به جامعه فیلم‌سازان و تولیدکنندگان محتوا.

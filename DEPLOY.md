# העלאת האתר לשרת

אין גישה לחשבון או לשרת מהסביבה הזו – ההעלאה מתבצעת אצלך. אלה האפשרויות:

---

## אפשרות 1: Replit (אם הפרויקט היה ב-Replit)

1. העלה את התיקייה ל-Replit (ייבוא מ-GitHub או העלאה).
2. ב-Replit: **Tools → Deployment** (או **Deploy**).
3. בחר **Deploy to Replit**.
4. ב-**Secrets** (או Environment) הוסף:
   - `SESSION_SECRET` – מחרוזת אקראית ארוכה
   - `CONTACT_EMAIL` – המייל שלך
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (ו־`SMTP_PORT` אם צריך)
   - `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - אם יש DB: `DATABASE_URL`
5. אחרי ה-build האתר יהיה זמין בכתובת ש-Replit נותנת.

---

## אפשרות 2: Render.com (חינמי ל-Web Service)

1. היכנס ל־https://render.com והתחבר (GitHub מומלץ).
2. **New → Web Service**.
3. חבר את ה-repo (GitHub) שבו נמצא הפרויקט.
4. הגדרות:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Runtime:** Node
5. ב-**Environment** הוסף:
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` – מחרוזת אקראית (או Generate ב-Render)
   - `CONTACT_EMAIL`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
   - `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
6. **Create Web Service** – אחרי ה-build תקבל קישור כמו `https://webstudio-ias.onrender.com`.

**הערה:** בלי PostgreSQL האתר יעבוד עם אחסון בזיכרון. ל-DB קבוע הוסף ב-Render **PostgreSQL** והגדר `DATABASE_URL`.

---

## אפשרות 3: Railway / Fly.io / VPS

- **Railway:** חבר repo, הגדר Build/Start ו-env.
- **Fly.io:** `fly launch` מתוך התיקייה (צריך Dockerfile או הוראות Node).
- **VPS:** התקן Node, `git clone`, `npm run build`, `npm run start`, והגדר nginx ל־פורט 5000.

---

---

## לידים ל-support@webstudio-ias.com (Formspree)

כדי שכל הלידים יגיעו מסודרים ל־support@webstudio-ias.com:

1. היכנס ל־https://formspree.io והתחבר.
2. **New Form** – בחר "Email" והזן: **support@webstudio-ias.com**
3. העתק את ה־form ID מתוך ה־URL (למשל: `https://formspree.io/f/xyzabc12` → `xyzabc12`).
4. ב־`.env` או ב־Environment Variables של השרת הגדר:
   ```
   VITE_FORMSPREE_FORM_ID=xyzabc12
   ```

בכל ליד תקבל מייל עם:
- **נושא מסודר:** `ליד חדש [Ecommerce]: שם הלקוח`
- **שדות ברורים:** Name, Email, Message, Service
- **Reply-To:** לחיצה על "Reply" תשלח ישירות ללקוח

---

## לפני הפריסה

1. **בדיקה מקומית:**
   ```bash
   npm run build
   npm run start
   ```
   גלוש ל־http://localhost:5000.

2. **אל תעלה .env ל-repo:** השתמש ב-Environment Variables בפאנל השירות. הגדר `ADMIN_PASSWORD` (ומפתחות אחרים) במשתני סביבה ב-production — לעולם אל תכלול סיסמאות אמיתיות בקוד או ב-repo.

3. אחרי הפריסה תקבל קישור – זה האתר החי.

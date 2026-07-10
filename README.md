# תיעוד שטח - אבטיפוס מהיר

זה אבטיפוס מובייל בעברית לתיעוד נקודות שטח ביום הבחירות.

מה יש בו:

- בחירה בין אשכול, שילוט ודוכן
- טופס מותאם לכל סוג נקודה
- צילום / העלאת תמונות
- לקיחת מיקום GPS
- שדה גיבוי להדבקת קואורדינטות או קישור מפות
- דף נקודה מסכם עם קישורי Google Maps ו-Waze
- שמירה מקומית בדפדפן
- ייצוא JSON של כל הנקודות

איך להריץ במחשב:

```powershell
cd C:\Users\samb2\OneDrive\Desktop\Democratim\field-doc-prototype
python -m http.server 4173
```

ואז לפתוח:

```text
http://127.0.0.1:4173/index.html
```

עמודים נוספים:

```text
http://127.0.0.1:4173/output-mockups.html
http://127.0.0.1:4173/infra/feasibility-client.html
```

- `output-mockups.html` מציג דף נקודה וסיכום יישוב/צוות למובילים ולשטח.
- `infra/feasibility-client.html` מיועד לבדיקת תשתית מול Apps Script, Google Sheets ו-Drive.

לטלפון:

כדי ש-GPS יעבוד בצורה אמינה בטלפון, עדיף לפרסם את התיקייה כאתר HTTPS חינמי, למשל דרך GitHub Pages.

בלי HTTPS אפשר עדיין לבדוק את רוב הזרימה, אבל ייתכן שהטלפון יחסום מיקום אוטומטי. במקרה כזה מדביקים קישור מפות או קואורדינטות בשדה המיקום הידני.

פרסום ל-GitHub Pages:

1. ליצור repository חדש ב-GitHub, למשל `field-doc-prototype`.
2. לדחוף אליו את התיקייה הזאת.
3. ב-GitHub לפתוח Settings → Pages.
4. לבחור Deploy from branch.
5. לבחור branch בשם `main` ותיקייה `/root`.
6. אחרי הפרסום, לפתוח את כתובת ה-HTTPS ש-GitHub נותן.

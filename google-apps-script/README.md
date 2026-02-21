# AUY Student Portal — Apps Script API

A single Google Apps Script function that reads **2 sheet tabs** and returns
all student data in one JSON response. No API keys, no OAuth, no backend.

---

## Setup (~3 minutes)

### 1. Create your Google Sheet

Create a new Google Sheet with exactly **2 tabs**:

#### Tab: `Students`
| email | name | student_id | semester | study_mode |
|---|---|---|---|---|
| alex@auy.edu.mm | Alex Johnson | STU-2024-001 | Spring 2025 | Computer Science |

#### Tab: `Enrollments`
One row per **course × material/quiz item**. Repeat student/course columns freely.

| email | course_id | course_name | credits | instructor | grade | score | attended | total | semester | material_title | material_url | material_type | quiz_title | quiz_date | quiz_status | quiz_link |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| alex@auy.edu.mm | CS301 | Data Structures | 3 | Dr. Sarah Chen | A | 94 | 28 | 30 | Spring 2025 | Lecture 1 Slides | https://drive.google.com/... | pdf | Midterm Exam | 2025-04-01 | Upcoming | |
| alex@auy.edu.mm | CS301 | Data Structures | 3 | Dr. Sarah Chen | A | 94 | 28 | 30 | Spring 2025 | Problem Set 1 | https://drive.google.com/... | doc | Quiz 1 | 2025-02-10 | Completed | |
| alex@auy.edu.mm | CS350 | Operating Systems | 3 | Prof. Miller | B+ | 88 | 22 | 30 | Spring 2025 | OS Concepts | https://drive.google.com/... | pdf | Midterm | 2025-04-05 | Upcoming | https://exam.auy.edu.mm |

> **Rule:** one row per material+quiz pair per course. If a course has 3 materials
> and 2 quizzes, add rows until all are covered. Grade/attendance columns repeat.

---

### 2. Add the script

1. In your Sheet: **Extensions → Apps Script**
2. Delete any existing code
3. Paste the contents of `Code.gs`
4. On **line 1** of `Code.gs`, replace `YOUR_GOOGLE_SHEET_ID` with your Sheet ID
   - Sheet ID is the string between `/d/` and `/edit` in the URL

### 3. Deploy

1. Click **Deploy → New deployment**
2. Click ⚙️ → **Web app**
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** → copy the Web App URL

### 4. Configure the frontend

In `.env.local`:
```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

> After any code change, go to **Deploy → Manage deployments → Edit → New version**.

---

## API Reference

### Request
```
GET https://script.google.com/macros/s/{ID}/exec?email=student@auy.edu.mm
```

### Response
```json
{
  "studentName": "Alex Johnson",
  "studentId":   "STU-2024-001",
  "studyMode":   "Computer Science",
  "semester":    "Spring 2025",
  "courses": [
    {
      "courseId":   "CS301",
      "courseName": "Data Structures & Algorithms",
      "credits":    "3",
      "instructor": "Dr. Sarah Chen",
      "grade":      "A",
      "score":      "94",
      "attendance": 93,
      "attended":   "28",
      "total":      "30",
      "materials": [
        { "title": "Lecture 1 Slides", "url": "https://...", "type": "pdf" }
      ],
      "quizzes": [
        { "title": "Midterm Exam", "date": "2025-04-01", "status": "Upcoming", "link": null }
      ]
    }
  ]
}
```

### Error response
```json
{ "error": "Student not found: unknown@email.com" }
```

---

## Material types
| Value | Icon shown |
|---|---|
| `pdf` | Red PDF icon |
| `doc` | Blue doc icon |
| `slides` | Amber slides icon |
| `video` | Purple video icon |
| anything else | Grey file icon |

## Quiz status values
| Value | Badge color |
|---|---|
| `Upcoming` | Amber |
| `Completed` | Green |

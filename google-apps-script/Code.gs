/**
 * ============================================================
 *  American University of Yangon — Student Portal API
 *  Google Apps Script Web App
 * ============================================================
 *
 *  SETUP (one-time, ~3 minutes)
 *  ─────────────────────────────
 *  1. Open your Google Sheet
 *  2. Extensions → Apps Script → paste this file
 *  3. Set SHEET_ID below to your Sheet's ID
 *     (the long string in the URL between /d/ and /edit)
 *  4. Deploy → New deployment → Web app
 *       Execute as : Me
 *       Who has access : Anyone
 *  5. Copy the Web App URL → paste into VITE_APPS_SCRIPT_URL
 *
 *  ENDPOINT
 *  ─────────
 *  GET ?email=student@auy.edu.mm
 *
 *  RESPONSE
 *  ─────────
 *  {
 *    studentName : "Alex Johnson",
 *    studentId   : "STU-2024-001",
 *    studyMode   : "Computer Science",
 *    semester    : "Spring 2025",
 *    courses: [
 *      {
 *        courseId    : "CS301",
 *        courseName  : "Data Structures",
 *        credits     : "3",
 *        instructor  : "Dr. Sarah Chen",
 *        grade       : "A",
 *        score       : "94",
 *        attendance  : 93,
 *        attended    : "28",
 *        total       : "30",
 *        materialTitle : "Lecture 1 Slides",
 *        materialUrl   : "https://drive.google.com/...",
 *        materialType  : "pdf",
 *        quizTitle  : "Midterm",
 *        quizDate   : "2025-04-01",
 *        quizStatus : "Upcoming",
 *        quizLink   : ""
 *      },
 *      ...
 *    ]
 *  }
 *
 * ============================================================
 *  GOOGLE SHEET SCHEMA  (2 tabs only)
 * ============================================================
 *
 *  Tab 1 — "Students"
 *  ┌─────────────────────┬──────────────────┬──────────────┬────────────┬───────────────────┐
 *  │ email               │ name             │ student_id   │ semester   │ study_mode        │
 *  ├─────────────────────┼──────────────────┼──────────────┼────────────┼───────────────────┤
 *  │ alex@auy.edu.mm     │ Alex Johnson     │ STU-2024-001 │ Spring 2025│ Computer Science  │
 *  └─────────────────────┴──────────────────┴──────────────┴────────────┴───────────────────┘
 *
 *  Tab 2 — "Enrollments"
 *  One row per student-course. All course data lives here — no joins needed.
 *
 *  ┌──────────────────┬───────────┬───────────────────────┬─────────┬──────────────────┬───────┬───────┬──────────┬──────────┬───────┬────────────────────┬──────────────────────────┬───────────────┬────────────┬────────────┬───────────┬───────────┐
 *  │ email            │ course_id │ course_name           │ credits │ instructor       │ grade │ score │ attended │ total    │ semester│ material_title    │ material_url             │ material_type │ quiz_title │ quiz_date  │quiz_status│ quiz_link │
 *  ├──────────────────┼───────────┼───────────────────────┼─────────┼──────────────────┼───────┼───────┼──────────┼──────────┼─────────┼───────────────────┼──────────────────────────┼───────────────┼────────────┼────────────┼───────────┼───────────┤
 *  │ alex@auy.edu.mm  │ CS301     │ Data Structures       │ 3       │ Dr. Sarah Chen   │ A     │ 94    │ 28       │ 30       │Spring 25│ Lecture 1 Slides  │ https://drive.google.com │ pdf           │ Midterm    │ 2025-04-01 │ Upcoming  │           │
 *  │ alex@auy.edu.mm  │ CS301     │ Data Structures       │ 3       │ Dr. Sarah Chen   │ A     │ 94    │ 28       │ 30       │Spring 25│ Problem Set 1     │ https://drive.google.com │ doc           │ Quiz 1     │ 2025-02-10 │ Completed │           │
 *  │ alex@auy.edu.mm  │ CS350     │ Operating Systems     │ 3       │ Prof. J. Miller  │ B+    │ 88    │ 22       │ 30       │Spring 25│ OS Concepts       │ https://drive.google.com │ pdf           │ Midterm    │ 2025-04-05 │ Upcoming  │ https://  │
 *  └──────────────────┴───────────┴───────────────────────┴─────────┴──────────────────┴───────┴───────┴──────────┴──────────┴─────────┴───────────────────┴──────────────────────────┴───────────────┴────────────┴────────────┴───────────┴───────────┘
 *
 *  Tip: If a course has multiple materials or quizzes, add one row per item.
 *       Student/course fields (name, grade, attendance) repeat — that's fine.
 * ============================================================
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
var SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // ← paste your Sheet ID here

// ── ENTRY POINT ──────────────────────────────────────────────────────────────
function doGet(e) {
  // Allow CORS for browser fetch()
  var output;

  try {
    var email = ((e && e.parameter && e.parameter.email) || '').toLowerCase().trim();

    if (!email) {
      output = { error: 'Missing ?email= parameter' };
    } else {
      var ss   = SpreadsheetApp.openById(SHEET_ID);
      output   = buildResponse(ss, email);
    }
  } catch (err) {
    output = { error: String(err.message || err) };
  }

  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── BUILD RESPONSE ────────────────────────────────────────────────────────────
function buildResponse(ss, email) {

  // 1. Look up student profile
  var student = findStudent(ss, email);
  if (!student) {
    return { error: 'Student not found: ' + email };
  }

  // 2. Pull all enrollment rows for this email
  var rows = getEnrollmentRows(ss, email);
  if (rows.length === 0) {
    return {
      studentName : student.name,
      studentId   : student.student_id,
      studyMode   : student.study_mode,
      semester    : student.semester,
      courses     : []
    };
  }

  // 3. Group rows by course_id
  var courseMap = {};
  rows.forEach(function(row) {
    var cid = row.course_id;
    if (!courseMap[cid]) {
      courseMap[cid] = {
        courseId   : cid,
        courseName : row.course_name,
        credits    : row.credits,
        instructor : row.instructor,
        grade      : row.grade      || null,
        score      : row.score      || null,
        attended   : row.attended   || '0',
        total      : row.total      || '0',
        attendance : computeAttendance(row.attended, row.total),
        materials  : [],
        quizzes    : []
      };
    }
    // Append material if present
    if (row.material_title) {
      courseMap[cid].materials.push({
        title : row.material_title,
        url   : row.material_url  || '',
        type  : row.material_type || 'file'
      });
    }
    // Append quiz if present
    if (row.quiz_title) {
      courseMap[cid].quizzes.push({
        title  : row.quiz_title,
        date   : row.quiz_date   || '',
        status : row.quiz_status || 'Upcoming',
        link   : row.quiz_link   || null
      });
    }
  });

  return {
    studentName : student.name,
    studentId   : student.student_id,
    studyMode   : student.study_mode,
    semester    : student.semester,
    courses     : Object.values(courseMap)
  };
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function computeAttendance(attended, total) {
  var a = parseInt(attended, 10);
  var t = parseInt(total,    10);
  if (!t) return null;
  return Math.round((a / t) * 100);
}

function findStudent(ss, email) {
  var rows = sheetToObjects(ss, 'Students');
  return rows.find(function(r) {
    return (r.email || '').toLowerCase().trim() === email;
  }) || null;
}

function getEnrollmentRows(ss, email) {
  var rows = sheetToObjects(ss, 'Enrollments');
  return rows.filter(function(r) {
    return (r.email || '').toLowerCase().trim() === email;
  });
}

/**
 * Read a sheet tab and return an array of plain objects.
 * Row 1 = headers (auto-lowercased, spaces → underscores).
 */
function sheetToObjects(ss, tabName) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) return [];

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0].map(function(h) {
    return String(h).trim().toLowerCase().replace(/\s+/g, '_');
  });

  return values.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(key, i) {
      obj[key] = (row[i] !== null && row[i] !== undefined) ? String(row[i]).trim() : '';
    });
    return obj;
  });
}

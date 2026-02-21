const API_BASE =
  "https://script.google.com/a/macros/connect.edu.mm/s/AKfycbyXrW9rP56j3eG0DmKN6b3dOSYuHb5W-74aQJms5qbtHusuZYzEmKb0zAfJWx976i1b_Q/exec";

// ✅ get single student
export async function getStudentByEmail(email: string) {
  const res = await fetch(
    `${API_BASE}?action=getStudentData&email=${encodeURIComponent(email)}`
  );

  if (!res.ok) throw new Error("Failed to fetch student");
  return res.json();
}

// ✅ get all users
export async function getAllUsers() {
  const res = await fetch(`${API_BASE}?action=getAllUsers}`);

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// ✅ system stats fallback
export async function getSystemStats() {
  return {
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
  };
}
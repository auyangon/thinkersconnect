export const fetchStudents = async () => {
  const res = await fetch(import.meta.env.VITE_API_BASE);
  if (!res.ok) throw new Error('Failed to fetch students from Google Sheet');
  return res.json();
};
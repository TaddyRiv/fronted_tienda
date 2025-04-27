const API_URL = "http://127.0.0.1:5000/api/users";

export const fetchUsuarios = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return await res.json();
};

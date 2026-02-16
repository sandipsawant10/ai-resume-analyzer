const url = "http://localhost:5000/auth";

const registerUser = async (email, password, confirmPassword) => {
  const res = await fetch(`${url}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, confirmPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to register");
  }

  const data = await res.json();
  return data;
};

const loginUser = async (email, password) => {
  const res = await fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to login");
  }
  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
};

const getToken = () => {
  return localStorage.getItem("token");
};

const logout = () => {
  localStorage.removeItem("token");
};

export { registerUser, loginUser, getToken, logout };

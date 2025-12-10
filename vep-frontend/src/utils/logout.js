import axiosClient from "./axiosClient";

export default async function logout() {
  await axiosClient.post("/logout");
  localStorage.removeItem("token");
}

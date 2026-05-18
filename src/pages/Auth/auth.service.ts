import api from "../../api/apiInstance";

export async function loginUser(payload: { email: string; password: string }) {
  try {
    const res: any = await api.post("/auth/login", payload);
    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Something went wrong, Try again.";

    throw new Error(message);
  }
}

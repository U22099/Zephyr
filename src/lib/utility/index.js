"use server";
import { cookies } from "next/headers";

export const setCookie = (name, value, options) => {
  cookies().set(name, value, options);
}
export const getCookie = (name) => {
  const data = cookies().get(name)?.value;
  return data;
}
export const deleteCookie = (name) => {
  cookies().delete(name);
}

export const storeSession = (session) => {
  if (session) {
    setCookie("session", JSON.stringify(session), { expires: new Date(new Date().getTime() + 1000 * 12 * 30 * 24 * 60 * 60 * 1000), httpOnly: true });
    return true;
  } else {
    return false
  }
}
export const getSession = () => {
  const session = getCookie("session");
  if (!session) return null;
  let user = null;
  try {
    const decodedCookie = decodeURIComponent(session);
    user = JSON.parse(decodedCookie) || null;
    console.log(user);
  } catch (error) {
    console.error("Error parsing session cookie:", error);
  }
  return user;
}
export const deleteSession = () => {
  deleteCookie("session");
}

export const app = {
  // api: "https://server.everydayfreshfood.com/api/",
  // api: "https://vegetable.gamemark.xyz/api/",
  api: "http://127.0.0.1:8000/api/",
  currencySymbol: "£",
  currencyCode: "GBP",
  colorOne: "#f5881f",
  colorTwo: "#AE9EFD",
  vans: ["Van#1", "Van#2", "Van#3", "Van#4", "Van#5"],
  payments: ["Paid", "Unpaid"],
  status: ["Progress", "Completed", "Canceled"],
};
export const passwordValidator = (password, extra = "") => {
  if (!password || password.length <= 0)
    return extra + "Password cannot be empty.";
  if (password.length < 6) return extra + "Password must be have 6 characters.";
  return "";
};

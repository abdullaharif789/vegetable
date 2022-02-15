export const app = {
  api: "https://server.everydayfreshfood.com/api/",
  // api: "http://127.0.0.1:8000/api/",
  currencySymbol: "£",
  currencyCode: "GBP",
  colorOne: "#f5881f",
  colorTwo: "#AE9EFD",
  vans: ["Van#1", "Van#2", "Van#3", "Van#4", "Van#5"],
  discounts: [
    {
      label: "0%",
      value: 0.0,
    },
    {
      label: "5%",
      value: 0.05,
    },
    {
      label: "10%",
      value: 0.1,
    },
    {
      label: "15%",
      value: 0.15,
    },
  ],
  weeks: [
    {
      label: "Older than 1 Week",
      value: "-1 week",
    },
    {
      label: "Older than 2 Weeks",
      value: "-2 weeks",
    },
    {
      label: "Older than 3 Weeks",
      value: "-3 weeks",
    },
    {
      label: "Older than 4 Weeks",
      value: "-4 weeks",
    },
    {
      label: "Older than 5 Weeks",
      value: "-5 weeks",
    },
  ],
  filterAmounts: [
    {
      label: "Greater than 100",
      value: 100,
    },
    {
      label: "Greater than 200",
      value: 200,
    },
    {
      label: "Greater than 300",
      value: 300,
    },
    {
      label: "Greater than 500",
      value: 500,
    },
    {
      label: "Greater than 700",
      value: 700,
    },
  ],
  boxTypes: ["Full Box", "Half Box", "Loose Item"],
  payments: ["Paid", "Unpaid"],
  status: ["Progress", "Completed", "Canceled"],
  tax: 20,
  adminRole: "admin",
  superAdminRole: "superadmin",
  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  filter: (array, element, cross = true) => {
    const tempArray = [];
    for (let i = 0; i < array.length; i++) {
      if (cross) {
        if (
          array[i].name === element.name &&
          array[i].van === element.van &&
          array[i].type === element.type
        ) {
          tempArray.push(array[i]);
        }
      } else {
        if (array[i].name === element.name && array[i].van === element.van) {
          tempArray.push(array[i]);
        }
      }
    }
    return tempArray;
  },
  sort: (array, key = "name") => {
    return array.sort((a, b) => {
      if (a[key] > b[key]) return 1;
      if (a[key] < b[key]) return -1;
      return 0;
    });
  },
};
export const passwordValidator = (password, extra = "") => {
  if (!password || password.length <= 0)
    return extra + "Password cannot be empty.";
  if (password.length < 6) return extra + "Password must be have 6 characters.";
  return "";
};

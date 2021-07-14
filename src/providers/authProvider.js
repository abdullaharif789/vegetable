import { app } from "../contants";

export default {
  // called when the user attempts to log in
  login: ({ username, password }) => {
    const request = new Request(app.api + "adminlogin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((auth) => {
        localStorage.setItem("auth", JSON.stringify(auth));
      })
      .catch(() => {
        throw new Error("Invalid credentials.");
      });
  },
  // called when the user clicks on the logout button
  logout: () => {
    if (localStorage.getItem("auth")) {
      const request = new Request(app.api + "logout", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("auth")).token,
        }),
      });
      return fetch(request)
        .then((response) => {
          if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(() => {
          localStorage.removeItem("auth");
          return Promise.resolve();
        })
        .catch(() => {});
    }
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("auth") ? Promise.resolve() : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
  getIdentity: () => {
    var token = {
      id: JSON.stringify(Date()),
      fullName: "Admin",
    };
    if (localStorage.getItem("auth"))
      token = JSON.parse(localStorage.getItem("auth"));
    return Promise.resolve({
      id: token.token,
      fullName: token.name,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    });
  },
};

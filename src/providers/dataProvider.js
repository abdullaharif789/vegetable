import { fetchUtils, useNotify } from "react-admin";
import { stringify } from "query-string";
import { app } from "../contants";
import zlFetch from "zl-fetch";
const apiUrl = app.api;
const httpClient = fetchUtils.fetchJson;

export default {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}${resource}?${stringify(query)}`;
    console.log(url);
    return httpClient(url).then(({ headers, json }) => {
      const total = headers.get("content-range")
        ? parseInt(headers.get("content-range").split("/").pop(), 10)
        : json.length;
      return {
        data: json,
        total,
      };
    });
  },

  getOne: (resource, params) => {
    const url = `${apiUrl}${resource}/${params.id}`;
    return httpClient(url).then(({ json }) => ({
      data: json,
    }));
  },

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(headers.get("content-range").split("/").pop(), 10),
    }));
  },

  updateMany: (resource, params) => {
    alert("updateMany");
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) => {
    return zlFetch(`${apiUrl}${resource}`, {
      method: "POST",
      body: params.data,
    }).then((response) => ({
      data: { ...params.data, id: response.id },
    }));
  },

  update: (resource, params) => {
    const url = `${apiUrl}${resource}/${params.id}`;
    return zlFetch(url, {
      method: "PUT",
      body: params.data,
    }).then((response) => ({
      data: response.body,
    }));
  },

  delete: (resource, params) =>
    httpClient(`${apiUrl}${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}${resource}?${stringify(query)}`;
    return httpClient(url, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },
  getListSimple: async (resource, params) => {
    const url = `${apiUrl}${resource}?${stringify(params)}`;
    return httpClient(url).then(({ json }) => {
      return {
        data: json,
      };
    });
  },
};

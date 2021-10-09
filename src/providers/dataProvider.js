import { fetchUtils, useNotify } from "react-admin";
import { stringify } from "query-string";
import { app } from "../contants";
import zlFetch from "zl-fetch";
const apiUrl = app.api;
const httpClient = fetchUtils.fetchJson;

const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}${resource}?${stringify(query)}`;
    return zlFetch(url).then((response) => {
      const { body, headers } = response;
      const total = headers["content-language"]
        ? parseInt(headers["content-language"])
        : body.length;
      return {
        data: body,
        total: total,
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
  create: (resource, params) => {
    return zlFetch(`${apiUrl}${resource}`, {
      method: "POST",
      body: params.data,
    }).then((response) => {
      return {
        data: { ...params.data, id: response.id },
      };
    });
  },

  update: (resource, params) => {
    const url = `${apiUrl}${resource}/${params.id}`;
    return zlFetch(url, {
      method: "PUT",
      body: params.data,
    }).then((response) => {
      return {
        data: response.body,
      };
    });
  },
};

export default {
  ...dataProvider,
  update: (resource, params) => {
    if (!params.data.image || resource !== "items") {
      return dataProvider.update(resource, params);
    } else {
      var image = params.data.image.rawFile ? params.data.image : null;
      if (image) {
        return convertFileToBase64(image).then((image) => {
          return dataProvider.update(resource, {
            ...params,
            data: {
              ...params.data,
              image,
            },
          });
        });
      } else {
        return dataProvider.update(resource, {
          ...params,
          data: {
            ...params.data,
          },
        });
      }
    }
  },
  create: (resource, params) => {
    if (!params.data.image || resource !== "items") {
      return dataProvider.create(resource, params);
    } else {
      var image = params.data.image;
      return convertFileToBase64(image).then((image) => {
        return dataProvider.create(resource, {
          ...params,
          data: {
            ...params.data,
            image,
          },
        });
      });
    }
  },
};

const convertFileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file.rawFile);
  });

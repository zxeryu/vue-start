import { createRequestActor } from "@vue-start/request";

export const userList = createRequestActor("userList", ({ page, pageSize, name, gender }) => {
  return {
    method: "get",
    url: `/user/list`,
    params: {
      page,
      pageSize,
      name,
      gender,
    },
  };
});

export const userAdd = createRequestActor("userAdd", ({ body }) => {
  return {
    method: "post",
    url: `/user/add`,
    data: body,
  };
});

export const userEdit = createRequestActor("userEdit", ({ body }) => {
  return {
    method: "post",
    url: `/user/edit`,
    data: body,
  };
});

export const userDel = createRequestActor("userDel", ({ id }) => {
  return {
    method: "delete",
    url: `/user/del`,
    params: { id },
  };
});

export const userDetail = createRequestActor("userDetail", ({ id }) => {
  return {
    method: "get",
    url: `/user/detail`,
    params: { id },
  };
});

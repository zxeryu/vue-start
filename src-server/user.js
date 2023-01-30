const { map, times, slice, size, findIndex, find, filter } = require("lodash");

const users = map(times(21), (index) => {
  return {
    id: `${index + 1}`,
    name: `user ${index + 1}`,
    age: index + 1,
    gender: index % 2 === 0 ? "man" : "woman",
  };
});

const list = (page, pageSize, name, gender) => {
  const data = filter(users, (item) => {
    if (!name && !gender) {
      return true;
    } else if (!gender) {
      return item.name === name;
    } else if (!name) {
      return item.gender === gender;
    }
    return item.name === name && item.gender === gender;
  });
  return {
    list: slice(data, (page - 1) * pageSize, page * pageSize),
    total: size(data),
  };
};

const add = (user) => {
  const newUser = { ...user, id: new Date().valueOf() };
  users.push(newUser);
};

const edit = (user) => {
  const index = findIndex(users, (u) => u.id === user.id);
  if (index > -1) {
    users[index] = user;
  }
};

const del = (id) => {
  const index = findIndex(users, (u) => u.id === id);
  users.splice(index, 1);
};

const detail = (id) => {
  return find(users, (u) => u.id == id);
};

module.exports = {
  list,
  add,
  edit,
  del,
  detail,
};

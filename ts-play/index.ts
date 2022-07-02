import { Err, None, Ok, Option, Result, Some } from "./types.js";

const result = fetchUser();

const users: User[] = [];

if (result.type === "ok") {
  const user = result.value;
  users.push(user);
} else {
  let e = result.error;
  console.error(e.message);
}

// const firstUser = first(users).unwrap();

// console.log("First user", firstUser);

// switch (result.type) {
//   case "ok": {
//     const user = result.value;
//     console.log("User", { user });
//     break;
//   }
//   case "err": {
//     console.log("No user");
//     break;
//   }
// }

function fetchUser(): Result<User> {
  if (Math.random() > 0.5) {
    return Ok({
      id: "abc",
      name: "Mubaraq",
    });
  }
  // Feels weird; Err("No user") might be nice?
  return Err(new Error("No user"));
}

function first<T>(arr: T[]): Option<T> {
  const elem = arr[0];
  if (elem !== undefined) {
    return Some(elem as T);
  } else {
    return None;
  }
}

interface User {
  id: string;
  name: string;
}

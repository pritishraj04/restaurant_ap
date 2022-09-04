import * as cookie from "cookie";

export const GET = () => {
  return {
    status: 303,
    headers: {
      "Set-Cookie": cookie.serialize("session", "", {
        path: "/",
        expires: new Date(0),
      }),
      location: "/",
    },
  };
};

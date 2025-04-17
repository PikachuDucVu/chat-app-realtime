import { Hono } from "hono";
import UserSchema from "../../schema/UserSchema";
import bcrypt from "bcryptjs";
import { setCookie, getCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
const app = new Hono();

app.use("/verifyToken", async (c) => {
  const token = getCookie(c, "userToken");
  console.log(token);
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!.toString()) as {
      _id: string;
      email: string;
      username: string;
    };
    const user = await UserSchema.findOne({ email: decoded.email });

    if (!user) {
      return c.json({ message: "No user found" }, 404);
    }

    return c.json({
      payload: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return c.json({ message: "Token is not valid" }, 401);
  }
});

app.post("/register", async (c) => {
  const { username, email, password } = await c.req.json();

  if (!username || !email || !password) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!regexEmail.test(email)) {
    return c.json({ error: "Invalid email format" }, 400);
  }

  // Check if the email is already taken
  const user = await UserSchema.findOne({ email });

  if (user) {
    return c.json({ message: "Email already taken" }, 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userData = {
    username,
    email,
    password: hashedPassword,
  };

  const newUser = new UserSchema(userData);
  await newUser.save();

  const payload = {
    _id: newUser._id,
    email: newUser.email,
    username: newUser.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!.toString(), {
    algorithm: "HS256",
  });
  setCookie(c, "userToken", token);

  return c.json({ message: "User registered successfully", token });
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const user = await UserSchema.findOne({ email });
  if (!user) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!.toString(), {
    algorithm: "HS256",
  });

  setCookie(c, "userToken", token);

  return c.json({ token });
});

app.get("/getListFriends", async (c) => {
  const token = getCookie(c, "userToken");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const friends = await UserSchema.find(
      {},
      { username: 1, profilePicture: 1, email: 1 }
    ).exec();
    return c.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return c.json({ error: "Failed to fetch friends" }, 500);
  }
});

export default app;

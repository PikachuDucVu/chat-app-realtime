import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { AuthAPI } from "@/lib/api";
import { toast } from "sonner";
import { useLocation } from "wouter";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [, navigate] = useLocation();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = useCallback(async () => {
    try {
      const res = await AuthAPI.login(email, password);
      if (res && res.token) {
        toast.success("Login successful");
        navigate("/chat");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [email, navigate, password]);

  const handleRegister = useCallback(async () => {
    try {
      const res = await AuthAPI.register(fullName, email, password);
      if (res && res.token) {
        toast.success("Register successful");
        navigate("/chat");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [email, fullName, navigate, password]);

  return (
    <div className="w-full h-full grid lg:grid-cols-2">
      {/* Left side with illustration */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-[#B5CCBE] text-white">
        <div className="max-w-md mx-auto text-center space-y-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%89%8F%E9%9D%A2%204.%20Lovebirds%20Website%20Login%20Design.jpg-1paoL13xn74ze0DJ424BHsfCXvnvkO.jpeg"
            alt="Decorative bird illustration"
            width={300}
            height={300}
            className="mx-auto"
          />
          <h2 className="text-2xl font-medium">Maecenas mattis egestas</h2>
          <p className="text-sm text-white/80">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
            nisi doloremque ullam veritatis quas corporis, dolore mollitia
            tempore, aut ipsum recusandae aperiam commodi veniam a in architecto
            tempora, voluptatem id.
          </p>
          {/* Dots navigation */}
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>

      {/* Right side with login/register form */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-script mb-6">DVChat</h1>
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.h2
                  key="login-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xl text-gray-600"
                >
                  Welcome to DVChat
                </motion.h2>
              ) : (
                <motion.h2
                  key="register-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xl text-gray-600"
                >
                  Create Your Account
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="password">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full p-2 border rounded"
                    />
                    <div className="text-right">
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Forget password?
                      </a>
                    </div>
                  </div>

                  <Button
                    className="w-full border  bg-gray-600 hover:bg-gray-700 text-black"
                    type="button"
                    onClick={handleLogin}
                  >
                    Sign in
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-gray-300">
                    <img
                      src="/placeholder.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Sign in with Google
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    New Lovebirds?{" "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="fullName">
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm text-gray-500"
                      htmlFor="registerEmail"
                    >
                      Email
                    </label>
                    <Input
                      id="registerEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm text-gray-500"
                      htmlFor="registerPassword"
                    >
                      Password
                    </label>
                    <Input
                      id="registerPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm text-gray-500"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <button
                    className="w-full text-black border"
                    onClick={handleRegister}
                  >
                    Create Account
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-gray-300">
                    <img
                      src="/placeholder.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Sign up with Google
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

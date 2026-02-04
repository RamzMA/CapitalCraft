import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import Footer from "../Components/Footer"



export default function Login() {
    // State variables
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [accountStatus, setAccountStatus] = useState<boolean>(false)
  const navigate = useNavigate();

  // Login existing user
  const handleLogin = async (): Promise<void> => {
    const lowerCaseEmail = email.toLowerCase();
    setError("")
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lowerCaseEmail, password, author_name: username }),
      })

      const data: { access_token?: string; detail?: string; user_id?: number; author_name?: string; email?: string } = await res.json()

      if (!res.ok) {
        setError(data.detail ?? "Invalid credentials")
        return
      }

      if (!data.access_token) {
        setError("No token returned")
        return
      }

      localStorage.setItem("token", data.access_token)
      // Store user_id from backend response
      if (data.user_id) {
        localStorage.setItem("user_id", data.user_id.toString())
      }
      // Store author_name from backend response
        if (data.author_name) {
        localStorage.setItem("author_name", data.author_name)
      }

      if (data.email) {
        localStorage.setItem("author_email", data.email)
      }

      navigate("/feed")
    } catch (err) {
      setError("Backend not reachable")
    }
  }

// Register new user
const handleRegister = async (): Promise<void> => {
  const lowerCaseEmail = email.toLowerCase();
  setError("");
  setMessage("");

  // Validate fields before sending request
  if (!username.trim() || !email.trim() || !password.trim()) {
    setError("All fields are required.");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: lowerCaseEmail, password, author_name: username }),
    });

    const data: { detail?: string } = await res.json();

    if (!res.ok) {
      setError(data.detail ?? "Registration failed");
      return;
    }

    setMessage("Registration successful! You can now log in.");
    setAccountStatus(false); // switch to login form
  } catch {
    setError("Backend not reachable");
  }
};

    // Remember Me functionality
    const [rememberMe, setRememberMe] = useState<boolean>(false);

   const toggleRememberMe = () => {
    const newValue = !rememberMe
    setRememberMe(newValue)

    if (newValue) {
        localStorage.setItem("rememberedEmail", email)
    } else {
        localStorage.removeItem("rememberedEmail")
    }
    }

    useEffect(() => {
    if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
    }
    }, [email, rememberMe])

    useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
    }
    }, [])



  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-500/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Large animated orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: '10%', left: '10%' }}
      />

      <motion.div
        className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: '10%', right: '10%' }}
      />

      {/* Login form - with z-index to stay on top */}
      <motion.div
        className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center text-3xl font-extrabold text-red-500 mb-2">
          CapitalCraft
        </h1>

        <h2 className="text-center text-xl font-semibold text-gray-300 mb-6">
          {accountStatus ? "Create an Account" : "Welcome Back"}
        </h2>

        {/* Error and success messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600 text-white p-3 rounded mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-600 text-white p-3 rounded mb-4 text-center"
          >
            {message}
          </motion.div>
        )}

        {accountStatus && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
        />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
        />
        <button
          onClick={accountStatus ? handleRegister : handleLogin}
          className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition mb-3 cursor-pointer"
        >
          {accountStatus ? "Sign Up" : "Login"}
        </button>

        <button
            onClick={toggleRememberMe}
            className="absolute top-4 right-4 w-5 h-5 border-2 border-gray-400 rounded-sm flex items-center justify-center cursor-pointer"
        >
          {rememberMe && <div className="w-3 h-3 bg-red-500"></div>}
        </button>

        <button
          onClick={() => setAccountStatus(!accountStatus)}
          className="w-full py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition cursor-pointer"
        >
        
          {accountStatus ? "Switch to Login" : "Switch to Sign Up"}
        </button>
      </motion.div>
    
    </div>
    <Footer />
    </>
  )
}

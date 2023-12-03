import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assests/Images/logo.png";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const [cookies, setCookie] = useCookies(["token"]);
  const [error, setError] = useState("");
  const { isAdmin, onLogin } = useAuth();

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const history = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3999/Login", {
        email: formData.email,
        password: formData.password,
      });

      // Assuming the API returns a token
      const token = response.data.token;

      // Set the token in a cookie
      setCookie("token", token, { path: "/" });
      setError("Sign-in successful");
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have Signed in successfully.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
        },
      });
      if (response.data.role_id === 2) {
        onLogin(true);
        history("/dashboard");
      } else {

        history(-1);
      }
      // Handle successful sign-in, e.g., redirect or show a success message
      // alert("Sign-in successful:", response.data);
      console.log("Sign-in successful:", response.data);
    } catch (error) {
      // Delay the error message and handle it
      setTimeout(() => {
        console.error("Sign-in error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Sign-in failed. Email or password is invalid.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton:
              "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
          },
        });
        setError("Sign-in failed. Email or password is invalid");
      }, 100);
    }
  };
  const handleGoogle = () => {
    // history('/');
    window.location.href = "http://localhost:3999/auth/google";
    axios
      .get("http://localhost:3999/auth/google")
      .then((response) => {
        console.log(response.data);
        const token = response.data.token;
        console.log("token:" + token);
        // Set the token in a cookie
        setCookie("token", token, { path: "/" });
        setError("Sign-in successful");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "You have Signed in successfully.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton:
              "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
          },
        });
        // history("/");
      })
      .catch((error) => {
        setTimeout(() => {
          console.error("Sign-in error:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Sign-in failed. Something went wrong.",
            confirmButtonText: "OK",
            customClass: {
              confirmButton:
                "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
            },
          });
          setError("Sign-in failed. Email or password is invalid");
        }, 100);
        // Handle errors here
        console.error("Error:", error);
      });
  };
  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/Login",
  //       formData
  //     );
  //     history("/");
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  return (
    <div className="bg-[url('https://images.unsplash.com/photo-1529718836725-f449d3a52881?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <div className="min-h-screen flex justify-center items-center">
          <div className="py-8 px-12 bg-white rounded-2xl shadow-xl z-20">
            <div className="flex flex-col justify-center items-center">
              <img className=" w-16" src={logo} alt="EcoVoyage logo" />
              <h1 className="text-3xl text-sky-900 font-bold text-center mb-4 cursor-pointer">
                Log In
              </h1>
              <p className="w-80 text-center text-sm mb-8 font-semibold text-sky-700 tracking-wide cursor-pointer">
                Unlock New Adventures with Your Travel Account
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email Addres"
                onChange={handleChange}
                className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
              />
              <Link to={"/"}>
                <p className="mt-4 text-sm text-sky-900 cursor-pointer text-start">
                  {" "}
                  Forgot yo password?
                </p>
              </Link>
            </div>
            <p className="text-sm text-start text-red-500">{error}</p>
            <div className="text-center mt-6">
              <button
                type="submit"
                className="py-3 w-64 text-xl text-white hover:text-sky-900 bg-sky-900 border-2 hover:bg-white border-sky-900 rounded-2xl"
              >
                Log In
              </button>
              <p className="mt-4 text-sm text-sky-900">
                Or login with: <br />
                <button
                  onClick={() => handleGoogle()}
                  className="p-3 mt-2 text-xl text-white hover:text-sky-900 border-2 hover:bg-white bg-gray-200 rounded-2xl"
                >
                  <svg
                    className="text-sky-700 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <path d="M17.788 5.108A9 9 0 1021 12h-8" />
                  </svg>
                </button>
              </p>
              <p className="mt-4 text-sm text-sky-900">
                Don't Have An Account?{" "}
                <Link to={"/signup"}>
                  <span className="underline cursor-pointer"> Sign Up</span>
                </Link>
              </p>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                <Link
                  to="/"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Go back
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;

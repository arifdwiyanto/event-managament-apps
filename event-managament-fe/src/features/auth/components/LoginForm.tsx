"use client";

import React from "react";
import Link from "next/link";
import { useGoogleLogin, useLoginForm } from "../hooks";
import {
  BoltIcon,
  EmailIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  CheckIcon,
  GoogleIcon,
} from "./ui/Icons";
import { useStoreLogin } from "../store/useAuthStore";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm: React.FC = () => {
  const {
    formik,
    showPassword,
    togglePasswordVisibility,
    loading,
    toast,
    handleCloseToast,
  } = useLoginForm();

  const {
    handleGoogleSuccess,
    loading: googleLoading,
    toast: googleToast,
    handleCloseToast: handleCloseGoogleToast,
  } = useGoogleLogin();
  return (
    <div className="w-full max-w-[420px] flex flex-col gap-6 relative z-10">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 bg-[#ee2b8c] dark:bg-[#FF00FF] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]">
            <BoltIcon />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-black dark:text-white italic">
            Hype
          </span>
        </div>
        <h2 className="text-black dark:text-white text-3xl md:text-4xl font-black leading-none tracking-tighter uppercase drop-shadow-[2px_2px_0px_rgba(238,43,140,0.2)] dark:drop-shadow-[2px_2px_0px_rgba(255,0,255,0.4)]">
          Log In
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-bold uppercase tracking-wide">
          Welcome back! Enter your details.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <label className="flex flex-col gap-1.5">
          <span className="text-black dark:text-white text-xs font-black uppercase tracking-wider">
            Email Address
          </span>
          <div className="relative flex items-center group">
            <span className="absolute left-3 z-10 text-gray-400 group-focus-within:text-[#ee2b8c] dark:group-focus-within:text-[#FF00FF] transition-colors">
              <EmailIcon />
            </span>
            <input
              className="w-full h-11 pl-10 pr-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-zinc-800 focus:border-[#ee2b8c] dark:focus:border-[#FF00FF] focus:outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-all font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_#ee2b8c] dark:focus:shadow-[4px_4px_0px_0px_#FF00FF]"
              id="email"
              placeholder="ENTER YOUR EMAIL"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-500 font-bold uppercase text-[10px] px-1">
              {formik.errors.email}
            </span>
          )}
        </label>

        {/* Password Field */}
        <label className="flex flex-col gap-1.5">
          <span className="text-black dark:text-white text-xs font-black uppercase tracking-wider">
            Password
          </span>
          <div className="relative flex items-center group">
            <span className="absolute left-3 z-10 text-gray-400 group-focus-within:text-[#ee2b8c] dark:group-focus-within:text-[#FF00FF] transition-colors">
              <LockIcon />
            </span>
            <input
              className="w-full h-11 pl-10 pr-10 bg-white dark:bg-black border-2 border-gray-200 dark:border-zinc-800 focus:border-[#ee2b8c] dark:focus:border-[#FF00FF] focus:outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-all font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_#ee2b8c] dark:focus:shadow-[4px_4px_0px_0px_#FF00FF]"
              id="password"
              placeholder="ENTER PASSWORD"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <button
              className="absolute right-3 z-10 text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <span className="text-red-500 font-bold uppercase text-[10px] px-1">
              {formik.errors.password}
            </span>
          )}
        </label>

        {/* Actions Row */}
        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-2 cursor-pointer group select-none">
            <div className="relative flex items-center justify-center">
              <input
                className="peer h-5 w-5 cursor-pointer appearance-none border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-black checked:border-[#ee2b8c] dark:checked:border-[#FF00FF] checked:bg-[#ee2b8c] dark:checked:bg-[#FF00FF] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                type="checkbox"
                name="remember"
                checked={formik.values.remember}
                onChange={formik.handleChange}
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-75">
                <CheckIcon />
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wide group-hover:text-[#ee2b8c] dark:group-hover:text-[#FF00FF] transition-colors">
              Remember me
            </span>
          </label>
          <Link
            href="#"
            className="text-xs font-bold uppercase tracking-wide text-[#ee2b8c] dark:text-[#FF00FF] hover:underline decoration-2 underline-offset-2"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Primary Button */}
        <button
          className="mt-2 w-full h-12 bg-[#ee2b8c] hover:bg-[#d61f7a] dark:bg-[#FF00FF] dark:hover:bg-[#d900d9] text-white dark:text-black text-sm font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[2px_2px_0px_0px_#000000] dark:hover:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
          type="submit"
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <>
              <span>Log In</span>
              <ArrowRightIcon />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t-2 border-dashed border-gray-300 dark:border-zinc-800"></div>
        <span className="flex-shrink-0 mx-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
          Or continue with
        </span>
        <div className="flex-grow border-t-2 border-dashed border-gray-300 dark:border-zinc-800"></div>
      </div>

      {/* Social Login */}
      <div className="flex flex-col gap-4 items-center w-full">
        {googleLoading ? (
          <CircularProgress size={24} />
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Google Login Failed")}
            useOneTap
            theme="filled_blue"
            shape="square"
            width="100%"
          />
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-2 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">
          New to Hype?
          <Link
            href="/register"
            className="text-[#ee2b8c] dark:text-[#FF00FF] ml-1 hover:underline decoration-2 underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </div>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      {/* Google Login Toast */}
      <Snackbar
        open={googleToast.open}
        autoHideDuration={6000}
        onClose={handleCloseGoogleToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseGoogleToast}
          severity={googleToast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {googleToast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginForm;

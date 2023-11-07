import React from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Link from "next/link";
import { useFormik } from "formik";
import { useRef } from "react";

// Primereact imports
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const RegisterForm = () => {
  const toast = useRef(null);

  const showToast = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.email) {
        errors.email = "Email is required.";
      }
      if (!data.password) {
        errors.password = "Password is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      createUserWithEmailAndPassword(auth, data.email, data.password).catch(
        (error) => {
          showToast(error.code);
        }
      );
    },
  });

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <form
        className="bg-[#F9F9FD] flex flex-col gap-2 justify-center
         h-[370px] border-[0.5px] border-[#ECEDF5] rounded-md
        px-5"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-[24px] font-[700] text-center mb-5">Register</h1>
        <div className="card flex justify-content-center flex-col">
          <span className="p-float-label w-full">
            <InputText
              className={`w-full h-[42px] border-none ${
                isFormFieldInvalid("email") ? "p-invalid" : ""
              }`}
              id="email"
              value={formik.values.email}
              onChange={(e) => {
                formik.setFieldValue("email", e.target.value);
              }}
            />
            <label htmlFor="email">E-mail</label>
          </span>
          {getFormErrorMessage("email")}
        </div>
        <div className="card flex flex-col justify-content-center">
          <span className="p-float-label w-full">
            <Password
              inputClassName={`w-[330px] h-[42px] border-none ${
                isFormFieldInvalid("password") ? "p-invalid" : ""
              }`}
              inputId="password"
              value={formik.values.password}
              onChange={(e) => {
                formik.setFieldValue("password", e.target.value);
              }}
              feedback={false}
              toggleMask
            />
            <label htmlFor="password">Password</label>
          </span>
          {getFormErrorMessage("password")}
        </div>
        <Button className="h-[36px] mt-[32px]" type="submit" label="Register" />
      </form>
      <div
        className="relative h-[92px] overflow-hidden bg-[#F9F9FD] border-[0.5px] border-[#ECEDF5] rounded-md p-2
      "
      >
        <div className="absolute top-[14px] left-[28px] pl flex gap-4">
          <i
            className="pi pi-users"
            style={{ fontSize: "95px", color: "#5F6B8A" }}
          ></i>
          <div className="pt-2">
            <p className="text-[#5F6B8A] text-[18px] font-[600]">
              Already have an account?
            </p>
            <Link
              className="text-[#FF5722] text-[14px] font-[700] underline "
              href="/login"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;

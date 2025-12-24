"use client";

import { useFormik } from "formik";
import { Loader } from "lucide-react";
import * as yup from "yup";
import { createChatRoom } from "./actions.ts";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const formik = useFormik({
    validationSchema: yup.object({
      username: yup.string().required("Username is required"),
      mobile: yup
        .string()
        .matches(/^[0-9]{11}$/, "Mobile number must be 11 digits")
        .required("Mobile number is required"),
    }),
    initialValues: {
      username: "",
      mobile: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await createChatRoom(values);
        if (res.status === 200) {
          router.push(`/rooms/${res.userId}`);
        }
      } catch (error) {
        enqueueSnackbar((error as Error).message || "Something went wrong", {
          variant: "error",
        });
      }
    },
  });
  return (
    <main className="flex bg-black min-h-screen flex-col items-center justify-center p-24">
      <div className=" flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-green-600 animate-pulse">
          Welcome Chatting server
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Your server is up and running!
        </p>
      </div>
      <div className="">
        <div className=" w-full max-w-md mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl capitalize font-semibold text-white mb-4 text-center">
            {" "}
            Start room chat{" "}
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your name and mobile number to create chat room.
          </p>
          <div className="">
            <div className="">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 mt-3 mb-4 bg-gray-700 text-white rounded-4xl focus:outline-none focus:ring-2 focus:ring-green-500"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-400 text-sm mb-2 px-2">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>
            <div className="">
              <input
                {...formik.getFieldProps("mobile")}
                maxLength={11}
                type="text"
                placeholder="Mobile Number"
                className="w-full px-4 py-2 mb-4 bg-gray-700 text-white rounded-4xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {formik.touched.mobile && formik.errors.mobile ? (
                <div className="text-red-400 text-sm mb-2 px-2">
                  {formik.errors.mobile}
                </div>
              ) : null}
            </div>
            <button
              onClick={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
            >
              {formik.isSubmitting ? (
                <i className=" text-center w-full flex justify-center ">
                  {" "}
                  <Loader className=" animate-spin" />{" "}
                </i>
              ) : (
                "Create Chat Room"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

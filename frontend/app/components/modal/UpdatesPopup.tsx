"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { setPopupRecord } from "@/app/lib/popupTTL";
import { Button, Form, Input, message } from "antd";
import { useAppDispatch } from "@/app/store/hooks";
import { AppDispatch } from "@/app/store/store";
import { RootState } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { addMovieUser } from "@/app/store/movieUser.reducer";


type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UpdatesPopup({ open, onClose }: Props) {

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleDismiss();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  //  Close/No = dismissed record set (6 hours)
  const handleDismiss = () => {
    setPopupRecord("dismissed");
    onClose();
  };

  //  Yes = accepted record set (6 hours)
  const handleAccept = () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    // later: API call to save email
    setPopupRecord("accepted");
    setEmail("");
    onClose();
  };

  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch<AppDispatch>();
  const { loading, error } = useSelector((s: RootState) => s.movieUser);

  if (!open) return null;

  const onFinish = async (values: { email: string }) => {
    try {

      const user = await dispatch(addMovieUser(values.email)).unwrap();
      console.log('user', user)

      message.success(`Added: ${user.email}`);
      form.resetFields();
      onClose();
    } catch (e: any) {

      message.error(e || "Failed to add user");


      form.setFields([
        { name: "email", errors: [e || "Failed to add user"] },
      ]);
    }
  };


  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.button
            aria-label="Close overlay"
            onClick={handleDismiss}
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl"
            initial={{ y: 30, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {/* Close icon */}
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
              aria-label="Close"
            >
              <X size={18} className="text-black" />
            </button>

            <div className="flex gap-4 p-5 sm:p-6">
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-700">
                <Bell size={20} className="text-emerald-200" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-[20px] font-sans leading-1 font-bold text-black sm:text-xl">
                  Get weekly movie updates?
                </h3>

                <p className="mt-4 font-sans pr-4  text-sm text-black/70">
                  Weekly updates on top-rated IMDb releases, trending movies, and popular series.
                </p>

                <Form
                  form={form}
                  layout="inline"
                  onFinish={onFinish}
                  className="mt-12 mb-4 flex gap-2"
                >
                  <div className=" mt-4 w-[300px]">
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Enter a valid email address" },
                      ]}
                      className="flex-1  "
                    >
                      <Input
                        placeholder="Enter your email"
                        className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none focus:border-emerald-600"
                      />
                    </Form.Item>
                  </div>

                  <div className="mt-4">
                    <Form.Item>
                     


                      <div className="mt-0 flex gap-3">
                        
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          className="rounded-full bg-amber-300 px-8 py-2 text-sm font-semibold text-black hover:bg-amber-400"
                        >
                          Yes
                        </Button>

                        <Button
                          onClick={handleDismiss}
                          className="rounded-full bg-black/10 px-8 py-2 text-sm font-semibold text-black hover:bg-black/15"
                        >
                          No
                        </Button>
                      </div>

                    </Form.Item>
                  </div>

                </Form>

                {/* input */}
                {/* <div className="mt-4">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none focus:border-emerald-600"
                  />

                </div> */}

                {/* buttons */}
                {/* <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="rounded-full bg-amber-300 px-8 py-2 text-sm font-semibold text-black hover:bg-amber-400"
                  >
                    Yes
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="rounded-full bg-black/10 px-8 py-2 text-sm font-semibold text-black hover:bg-black/15"
                  >
                    No
                  </button>
                </div> */}


              </div>
            </div>

            <div className="h-px w-full bg-black/10" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

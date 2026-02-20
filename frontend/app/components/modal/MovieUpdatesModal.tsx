"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { addMovieUser } from "@/app/store/movieUser.reducer";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function MovieUpdatesModal({ open, onClose }: Props) {
    const [email, setEmail] = useState("");
    const [form] = Form.useForm();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((s: RootState) => s.movieUser);

    if (!open) return null;

    const onFinish = async (values: { email: string }) => {
        try {

            const user = await dispatch(addMovieUser(values.email)).unwrap();
            // console.log('user', user)

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
        <>
            {open && (
                <div
                    className="absolute right-0 mt-3 z-[999]"
                >
                    {/* modal box */}
                    <div className="relative w-[430px] rounded-xl bg-white p-5 shadow-2xl ">

                        {/* header */}
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold text-black">
                                    Get movie updates
                                </h3>
                                <p className="mt-1 text-sm text-black/70">
                                    Weekly alerts on top-rated IMDb releases, trending movies, and popular series.
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="inline-flex h-6 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
                                aria-label="Close"
                            >
                                <X size={18} className="text-black" />
                            </button>
                        </div>

                        {/* form */}
                        <div className="mb-6">
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
                                            className="rounded-lg border border-black/15 px-3 py-2  text-sm focus:border-emerald-600"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="mt-4">
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold hover:bg-emerald-800"
                                        >
                                            Add
                                        </Button>
                                    </Form.Item>
                                </div>

                            </Form>
                        </div>

                        {/* note */}
                        {/* <p className="mt-3 text-xs text-black/60">
                            Note: We won’t spam you. You can unsubscribe anytime.
                        </p> */}
                    </div>
                </div>
            )}
        </>
    );
}

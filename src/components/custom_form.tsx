"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface FormFields {
  [key: string]: unknown;
  first_name?: string;
  last_name?: string;
  user_email?: string;
  user_phone?: string;
  company_name?: string;
  company_url?: string;
  country?: string;
  user_message?: string;
}

const useFormStore = create<{
  formData: FormFields;
  updateFormData: (newData: Partial<FormFields>) => void;
}>((set) => ({
  formData: {},
  updateFormData: (newData) => {
    set((state) => {
      const updatedData = { ...state.formData, ...newData };
      sendPartialData(updatedData);
      return { formData: updatedData };
    });
  },
}));

const sendPartialData = async (data: FormFields) => {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to send email");

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending form data:", error);
  }
};

const StepOne: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const { register, handleSubmit, setValue } = useForm<FormFields>();
  const updateFormData = useFormStore((state) => state.updateFormData);

  const onSubmit = (data: FormFields) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    {/* Heading */}
    <h1 className="text-2xl font-bold text-center">Register your Interest</h1>
    <p className="text-gray-600 text-center">
      Kindly fill out the form below to proceed with creating your account. A member of our team will reach out to you to assist with your free trial set-up.
    </p>
  
    {/* First Name & Last Name */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-medium">First Name *</label>
        <input
          {...register("first_name", { required: true })}
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Last Name *</label>
        <input
          {...register("last_name", { required: true })}
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  
    {/* Email */}
    <div>
      <label className="block text-gray-700 font-medium">Email *</label>
      <input
        {...register("user_email", { required: true })}
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
      />
    </div>
  
    {/* Phone & Country */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-medium">Phone *</label>
        <PhoneInput
          country={"us"}
          onChange={(phone) => setValue("user_phone", phone)}
          inputClass="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
          containerClass="w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Country *</label>
        <input
          {...register("country", { required: true })}
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  
    {/* Company Name & Website URL */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-medium">Company Name *</label>
        <input
          {...register("company_name", { required: true })}
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Website URL *</label>
        <input
          {...register("company_url", { required: true })}
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  
    {/* Inventory Size */}
    <div>
      <label className="block text-gray-700 font-medium">Inventory Size *</label>
      <input
        {...register("inventory_size", { required: true })}
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
      />
    </div>
  
    {/* Leave a Message */}
    <div>
      <label className="block text-gray-700 font-medium">Leave a Message</label>
      <textarea
        {...register("user_message")}
        className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500"
        rows={3}
      />
    </div>
  
    {/* Submit Button */}
    <button
      type="submit"
      className="bg-purple-600 text-white p-3 w-full rounded-lg hover:bg-purple-700 transition"
    >
      Next
    </button>
  </form>
  

  );
};

const StepTwo: React.FC<{ prevStep: () => void; nextStep: () => void }> = ({ prevStep, nextStep }) => {
  const { register, handleSubmit } = useForm<FormFields>();
  const updateFormData = useFormStore((state) => state.updateFormData);

  const onSubmit = (data: FormFields) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("user_message", { required: true })} placeholder="Message" className="border p-2 w-full" />
      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-500 text-white p-2">Back</button>
        <button type="submit" className="bg-blue-500 text-white p-2">Next</button>
      </div>
    </form>
  );
};

const StepThree: React.FC<{ prevStep: () => void }> = ({ prevStep }) => {
  const formData = useFormStore((state) => state.formData);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPartialData(formData);
    setSuccessMessage("Form submitted successfully!");
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-4">
        <button type="button" onClick={prevStep} className="bg-gray-500 text-white p-2">Back</button>
        <button type="submit" className="bg-green-500 text-white p-2">Submit</button>
      </form>
      {successMessage && <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">{successMessage}</div>}
    </div>
  );
};

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded shadow-lg">
      {step === 1 && <StepOne nextStep={() => setStep(2)} />}
      {step === 2 && <StepTwo prevStep={() => setStep(1)} nextStep={() => setStep(3)} />}
      {step === 3 && <StepThree prevStep={() => setStep(2)} />}
    </div>
  );
};

export default MultiStepForm;

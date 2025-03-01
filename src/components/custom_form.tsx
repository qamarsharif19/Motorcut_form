"use client"; 

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import emailjs from "@emailjs/browser";
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

const sendPartialData = (data: FormFields) => {
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        data as Record<string, unknown>,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      )
      .catch(() => {
        console.log("Error sending partial data");
      });
  };

const StepOne: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const { register, handleSubmit, setValue } = useForm<FormFields>();
  const updateFormData = useFormStore((state) => state.updateFormData);

  const onSubmit = (data: FormFields) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input {...register("first_name", { required: true })} placeholder="First Name *" className="border p-2 w-full" />
        <input {...register("last_name", { required: true })} placeholder="Last Name *" className="border p-2 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input {...register("user_email", { required: true })} placeholder="Email" className="border p-2 w-full" />
        <div className="w-full">
          <PhoneInput
            country={"us"}
            onChange={(phone) => setValue("user_phone", phone)}
            inputClass="border p-2 w-full"
            containerClass="w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input {...register("company_name")} placeholder="Company Name" className="border p-2 w-full" />
        <input {...register("company_url")} placeholder="Company URL" className="border p-2 w-full" />
      </div>
      <input {...register("country", { required: true })} placeholder="Country *" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">Next</button>
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
        <div className="flex justify-between">
          <button type="button" onClick={prevStep} className="bg-gray-500 text-white p-2">Back</button>
          <button type="submit" className="bg-green-500 text-white p-2">Submit</button>
        </div>
      </form>
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <p>{successMessage}</p>
        </div>
      )}
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

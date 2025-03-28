"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";

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
  file_upload?: string;
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
    <div className="formdiv">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Heading */}
        <div className="logo_image_div">
         <Image 
            src="/motorcut_logo.png"  
            alt="Company Logo" 
            width={150} 
            height={50} 
            className="h-auto logoimage"
          />
          </div>
        <h1 className="text-2xl font-bold text-left">Register your Interest</h1>
        <p className="fillform">
          Kindly fill out the form below to register your interest. A member of the team will reach out to you to assist with setting up you&apos;re free trial.
        </p>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4 umr">
          <div>
            <label className="block font-medium">First Name *</label>
            <input
              {...register("first_name", { required: true })}
              placeholder="Enter your first name"
              className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
            />
          </div>
          <div>
            <label className="block font-medium">Last Name *</label>
            <input
              {...register("last_name", { required: true })}
              placeholder="Enter your last name"
              className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email *</label>
          <input
            {...register("user_email", { required: true })}
            placeholder="Enter your email"
            className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
          />
        </div>

        {/* Phone & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Phone *</label>
            <PhoneInput
              country={"gb"}
              onChange={(phone) => setValue("user_phone", phone)}
              inputClass="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500"
              containerClass="w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Country *</label>
            <input
              {...register("country", { required: true })}
              placeholder="Enter your country"
              className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
            />
          </div>
        </div>

        {/* Company Name & Website URL */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Company Name *</label>
            <input
              {...register("company_name", { required: true })}
              placeholder="Enter your company name"
              className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
            />
          </div>
          <div>
            <label className="block font-medium">Website URL *</label>
            <input
              {...register("company_url", { required: true })}
              placeholder="Enter your website URL"
              className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
            />
          </div>
        </div>

        {/* Inventory Size */}
        <div>
          <label className="block font-medium">Inventory Size *</label>
          <input
            {...register("inventory_size", { required: true })}
            placeholder="Enter your inventory size"
            className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
          />
        </div>

        {/* Leave a Message */}
        <div>
          <label className="block font-medium">Leave a Message</label>
          <textarea
            {...register("user_message")}
            placeholder="Write your message here..."
            className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="nextq bg-purple-600 text-white w-full hover:bg-purple-700 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
};

// Step 2: File Upload
const StepTwo: React.FC<{ prevStep: () => void; nextStep: () => void }> = ({ prevStep, nextStep }) => {
  const { handleSubmit } = useForm<FormFields>();
  const updateFormData = useFormStore((state) => state.updateFormData);
  const [fileList, setFileList] = useState<{ name: string; url: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/list-public-files");
        if (!response.ok) throw new Error("Failed to fetch files");
        const files: { name: string; url: string }[] = await response.json();
        setFileList(files);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const toggleSelection = (fileUrl: string) => {
    setSelectedFiles((prev) => {
      if (prev.includes(fileUrl)) {
        return prev.filter((url) => url !== fileUrl); // Remove selection
      } else if (prev.length < 3) {
        return [...prev, fileUrl]; // Add selection (max 3)
      }
      return prev;
    });
  };

  const onSubmit = (data: FormFields) => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one background.");
      return;
    }
    updateFormData({ file_uploads: selectedFiles, ...data });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title & Subheading */}
      <h2 className="text-xl font-bold">Choose your Styles</h2>
      <p className="text-gray-600">
        Please browse and select up to 3 background templates which interest you. Our team will then use these
        to help prepare examples for your inventory for your review.
      </p>

      {/* Image Selection Grid */}
      <div className="grid grid-cols-3 gap-4">
        {fileList.map((file) => (
          <div
            key={file.name}
            className={`border p-2 cursor-pointer ${
              selectedFiles.includes(file.url) ? "border-green-500" : "border-gray-300"
            }`}
            onClick={() => toggleSelection(file.url)}
          >
            <img src={file.url} alt={file.name} className="w-full h-24 object-cover" />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2">Skip</button>
        <button type="submit" className={`px-4 py-2 ${selectedFiles.length > 0 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`} disabled={selectedFiles.length === 0}>
          Next
        </button>
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
      <form onSubmit={onSubmit} className="formq space-y-4">
        <button type="button" onClick={prevStep} className="backq bg-gray-500 text-white p-2">Back</button>
        <button type="submit" className="submitq bg-green-500 text-white p-2">Submit</button>
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
    <div className="test">
      {step === 1 && <StepOne nextStep={() => setStep(2)} />}
      {step === 2 && <StepTwo prevStep={() => setStep(1)} nextStep={() => setStep(3)} />}
      {step === 3 && <StepThree prevStep={() => setStep(2)} />}
    </div>
  );
};

export default MultiStepForm;

"use client";
import { useRouter } from 'next/navigation';
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
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
  "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China",
  "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent",
  "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

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
          Kindly fill out the form below to register your interest. A member of the team will reach out to you to assist with setting up your free trial.
        </p>

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

        <div>
          <label className="block font-medium">Email *</label>
          <input
            {...register("user_email", { required: true })}
            placeholder="Enter your email"
            className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
          />
        </div>

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
            <select
              {...register("country", { required: true })}
               className="border border-gray-300 w-full py-2 px-3 text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              defaultValue=""
            >
              <option value="" disabled>
                Select your country
              </option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

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

        <div>
          <label className="block font-medium">Inventory Size *</label>
          <input
            {...register("inventory_size", { required: true })}
            placeholder="Enter your inventory size"
            className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
          />
        </div>

        <div>
          <label className="block font-medium">Leave a Message</label>
          <textarea
            {...register("user_message")}
            placeholder="Write your message here..."
            className="border border-gray-300 w-full focus:ring-2 focus:ring-purple-500 placeholder-[#94A3B8]"
            rows={3}
          />
        </div>

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
  const { handleSubmit } = useForm();
  const updateFormData = useFormStore((state) => state.updateFormData);
  const [fileList, setFileList] = useState<{ name: string; url: string; category: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Studio");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null); // Lightbox state

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/list-public-files");
        if (!response.ok) throw new Error("Failed to fetch files");
        const files: { name: string; url: string; category: string }[] = await response.json();
        setFileList(files);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const toggleSelection = (fileUrl: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileUrl) ? prev.filter((url) => url !== fileUrl) : [...prev, fileUrl]
    );
  };

  const onSubmit = () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one background.");
      return;
    }
    updateFormData({ selected_files: selectedFiles }); // ✅ Store correctly
    console.log("Selected Files:", selectedFiles); // ✅ Debugging log
    nextStep();
  };

  const filteredFiles = activeTab === "All" ? fileList : fileList.filter((file) => file.category === activeTab);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">Choose your Styles</h2>
      <p className="text-gray-600">Please browse and select up to 3 background templates.</p>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 tabsq">
        {["Studio", "Indoor", "Outdoor", "Showroom", "Simplistic", "All"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab ? "text-black border-b-2 border-purple-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Image Selection Grid */}
      <div className="grid grid-cols-2 gap-4 imggridq">
        {filteredFiles.map((file) => (
          <div key={file.name} className="border p-2 flex flex-col items-center">
            {/* Image */}
            <Image
  src={file.url}
  alt={file.name}
  width={200} // Define width
  height={100} // Define height
  className={`w-full h-24 object-cover cursor-pointer ${
    selectedFiles.includes(file.url) ? "border-2 border-green-500" : "border-gray-300"
  }`}
  onClick={() => toggleSelection(file.url)}
/>
            {/* Preview Button */}
            <button
              className="preview mt-2 bg-blue-500 text-white px-4 py-1 text-sm rounded preview"
              type="button"
              onClick={() => setLightboxImage(file.url)}
            >
              Preview
            </button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2">Skip</button>
        <button type="submit" className={`px-4 py-2 ${selectedFiles.length > 0 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"} nextskip`} disabled={selectedFiles.length === 0}>
          Next
        </button>
      </div>

      {/* Lightbox Popup */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-700 text-lg font-bold"
              onClick={() => setLightboxImage(null)}
            >
              ✖
            </button>
            <Image
      src={lightboxImage}
      alt="Preview"
      className="w-full max-h-[500px] object-contain"
      width={500} // Specify the width
      height={500} // Specify the height
      priority={false} // Optional: Set to `true` for above-the-fold images
    />
          </div>
        </div>
      )}
    </form>
  );
};










const StepThree: React.FC<{ prevStep: () => void }> = ({ prevStep }) => {
  const router = useRouter();
  const formData = useFormStore((state) => state.formData);
  const [successMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPartialData(formData); // wait for async operation
      router.push('/thank-you'); // redirect after successful submission
    } catch (error) {
      console.error("Form submission failed:", error);
      // optionally, show error message to user
    }
  }
  return (
    <div className="space-y-6">
      {/* Booking Form (Pipedrive Scheduler) */}
      <div className="flex justify-center">
      <iframe
  src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0LiStxQJ_r9Tg2B9OJrW8Wk1lcVLx5eRrCq5B4n11ur_GYqKWqzZmK0734KOUtdGxLguqORg5N?gv=true"
  style={{ border: 0 }}
  width="100%"
  height="600"
  frameBorder="0"
/>


      </div>

      {/* Form Buttons */}
      <form onSubmit={onSubmit} className="formq space-y-4 text-center">
        <button 
          type="button" 
          onClick={prevStep} 
          className="backq bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button 
          type="submit" 
          className="submitq bg-green-500 text-white px-4 py-2 rounded"
        >
          Finish
        </button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded text-center">
          {successMessage}
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
    <div className="test">
      {step === 1 && <StepOne nextStep={() => setStep(2)} />}
      {step === 2 && <StepTwo prevStep={() => setStep(1)} nextStep={() => setStep(3)} />}
      {step === 3 && <StepThree prevStep={() => setStep(2)} />}
    </div>
  );
};

export default MultiStepForm;

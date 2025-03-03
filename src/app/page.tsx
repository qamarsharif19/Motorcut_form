import CustomForm from "@/components/custom_form";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      {/* Header with Logo */}
      <header className="bg-white shadow-md p-4 flex items-center justify-center">
  <Image 
    src="/motorcut_logo.png"  
    alt="Company Logo" 
    width={150} 
    height={50} 
    className="h-auto"
  />
</header>

      {/* Form Component */}
      <main className="mt-6">
        <CustomForm />
      </main>
    </div>
  );
}

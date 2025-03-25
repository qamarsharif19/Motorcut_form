import CustomForm from "@/components/custom_form";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      {/* Header with Logo */}
      

      {/* Form Component */}
      <main className="mt-6">
        <div className="maindiv">
        <CustomForm />
        <div className="imagediv">
    <Image src="/main_container.png" alt="Registration" width={500} height={300} className="mx-w-full h-auto" />

    </div>
    </div>
      </main>
    </div>
  );
}

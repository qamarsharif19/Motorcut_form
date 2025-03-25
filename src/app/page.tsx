import CustomForm from "@/components/custom_form";


export default function Page() {
  return (
    <div>
      {/* Header with Logo */}
      

      {/* Form Component */}
      <main className="mt-6">
        <div className="maindiv">
        <CustomForm />
        <div className="imagediv">
    <img src="/main_container.png" alt="Registration" className="mx-w-full h-auto" />
    </div>
    </div>
      </main>
    </div>
  );
}

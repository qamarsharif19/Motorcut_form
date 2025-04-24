export default function ThankYou() {
    return (
        <div
        className="min-h-screen flex flex-col justify-center items-center text-white p-10"
        style={{
          backgroundImage: "url('/colorkit.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-white mb-4">Thank you! 🎉</h1>
        <p className="text-lg text-white">We’ve received your submission.</p>
        <a href="https://www.motorcut.com">
  <button className="bkhome">Back to Home</button>
</a>
      </div>
      </div>
    );
  }
  
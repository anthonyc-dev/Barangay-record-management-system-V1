import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp path="/signup" routing="path" signInUrl="/signin" />
    </div>
  );
};

export default Signup;

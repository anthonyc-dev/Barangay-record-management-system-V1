import { SignIn } from "@clerk/clerk-react";

const Signin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn path="/signin" routing="path" signUpUrl="/signup" />
    </div>
  );
};

export default Signin;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterConfirm: React.FC = () => {
  const navigate = useNavigate();
  const gotoLogin = () => {
    navigate("/");
  };
  return (
    <div className="w-full max-w-md mx-auto mt-24 p-4">
      <Card className="shadow-md rounded-2xl text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-yellow-50">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-lg font-semibold">
            Registration Pending
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Thank you for registering! Your account is awaiting admin approval.
            Once approved, you will be able to log in.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <Button onClick={gotoLogin} className="w-full">
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterConfirm;

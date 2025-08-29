
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import { toast } from 'react-toastify';

const CandidateOTPVerify = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = location.state?.phoneNumber || "";

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/candidate/login');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [phoneNumber, navigate]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome to Bambinos.live");
      navigate('/candidate/application');
    }, 2000);
  };

  const handleResendOTP = () => {
    setCountdown(60);
    toast.info("A new verification code has been sent to your phone");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bambinos-skin to-bambinos-pink/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-12 h-12 rounded-full" />
            </div>
            <h1 className="text-3xl font-bold text-bambinos-blue">Bambinos.live</h1>
          </div>
          <p className="text-gray-600">Teacher Application Portal</p>
        </div>

        <Card className="border-bambinos-blue/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-bambinos-yellow/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-bambinos-blue" />
            </div>
            <CardTitle className="text-2xl text-bambinos-blue">Verify Your Phone</CardTitle>
            <CardDescription>
              Enter any 6-digit code to proceed (OTP bypassed for testing)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-bambinos-blue font-medium">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue"
                  maxLength={6}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-bambinos-blue hover:bg-bambinos-blue/90 text-white py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend code in {countdown} seconds
                </p>
              ) : (
                <Button 
                  variant="link" 
                  onClick={handleResendOTP}
                  className="text-bambinos-blue hover:text-bambinos-blue/80 p-0"
                >
                  Resend verification code
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back to login */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/candidate/login')}
            className="text-bambinos-blue hover:text-bambinos-blue/80"
          >
            ← Change phone number
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateOTPVerify;

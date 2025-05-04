
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { Download, Lock, Shield, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const SecuritySettings = () => {
  const { user, updatePassword } = useAuth();
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  
  // For password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  // For 2FA setup
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [setupStep, setSetupStep] = useState<'qr' | 'verify'>('qr');
  
  // TOTP secret - in a real app this would be generated on the server
  const totpSecret = 'JBSWY3DPEHPK3PXP'; // Example secret
  
  const handle2FAToggle = () => {
    if (twoFactorEnabled) {
      // Turn off 2FA
      setTwoFactorEnabled(false);
      toast.success('Two-factor authentication disabled');
    } else {
      // Show 2FA setup dialog
      setShowSetup2FA(true);
      setSetupStep('qr');
      setVerificationCode('');
    }
  };
  
  const handleNextStep = () => {
    setSetupStep('verify');
  };
  
  const handleVerify2FA = () => {
    // In a real app, this would verify the code with a backend
    // For demo purposes, we'll accept any 6-digit code
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowSetup2FA(false);
      setVerificationCode('');
      toast.success('Two-factor authentication enabled');
    } else {
      toast.error('Please enter a valid 6-digit verification code');
    }
  };
  
  const handleEncryptionToggle = () => {
    setEncryptionEnabled(!encryptionEnabled);
    toast.success(`End-to-end encryption ${!encryptionEnabled ? 'enabled' : 'disabled'}`);
  };
  
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully');
      setPasswordDialogOpen(false);
      
      // Reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to update password');
    }
  };
  
  const handleExportData = () => {
    // In a real app this would generate a file with user data
    const userData = {
      user: {
        name: user?.name,
        email: user?.email,
        memberSince: user?.memberSince
      },
      // Include tasks, teams, etc.
    };
    
    // Create a download link
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskmaster-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Data exported successfully');
  };
  
  const getTOTPQRCodeUrl = () => {
    // In a real app, this would be generated on the server
    // Generate URL for QR code (this follows the otpauth URL format)
    const appName = 'TaskMaster';
    const username = user?.email || 'user';
    
    return `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(username)}?secret=${totpSecret}&issuer=${encodeURIComponent(appName)}`;
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Security & Privacy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account security settings
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {twoFactorEnabled 
                  ? 'Your account is protected with 2FA' 
                  : 'Add an extra layer of security by enabling 2FA'}
              </p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={handle2FAToggle} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            End-to-End Encryption
          </CardTitle>
          <CardDescription>
            Protect your sensitive tasks with encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">End-to-End Encryption</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {encryptionEnabled 
                  ? 'Your sensitive tasks are encrypted end-to-end' 
                  : 'Encrypt sensitive tasks for maximum privacy'}
              </p>
            </div>
            <Switch checked={encryptionEnabled} onCheckedChange={handleEncryptionToggle} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Password Security</CardTitle>
          <CardDescription>
            Change your password regularly for better security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button>Change Password</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleChangePassword}>Update Password</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Data & Privacy
          </CardTitle>
          <CardDescription>
            Export your data or delete your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Export Your Data</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Download all your tasks, projects, and account information
            </p>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" /> Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 2FA Setup Dialog with TOTP */}
      <Dialog open={showSetup2FA} onOpenChange={setShowSetup2FA}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {setupStep === 'qr' ? 'Set Up Two-Factor Authentication' : 'Verify Authentication'}
            </DialogTitle>
          </DialogHeader>
          
          {setupStep === 'qr' ? (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="mb-4 flex justify-center">
                  <img 
                    src={getTOTPQRCodeUrl()} 
                    alt="TOTP QR Code" 
                    className="w-48 h-48 mx-auto" 
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Scan this QR code with your authenticator app
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Or manually enter this setup key:
                  </p>
                  <p className="font-mono text-sm bg-gray-200 dark:bg-gray-700 p-2 rounded select-all">
                    {totpSecret}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSetup2FA(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNextStep}>Next</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <p className="text-sm text-center">
                  Enter the 6-digit verification code from your authenticator app
                </p>
                
                <div className="flex justify-center py-4">
                  <InputOTP 
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSetupStep('qr')}>
                  Back
                </Button>
                <Button onClick={handleVerify2FA}>Verify & Enable</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySettings;

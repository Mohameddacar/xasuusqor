import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Mail, User, Calendar, Crown, Sparkles } from 'lucide-react';

export default function Settings() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    initialData: null,
  });

  const isPremium = user?.subscription_plan === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#3C3835] mb-2">Settings</h1>
          <p className="text-[#8B7355]">Manage your subscription and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Premium Plan Card */}
          <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8B7355] to-[#C4A57B] rounded-t-lg" />
            <CardHeader className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-2xl flex items-center justify-center shadow-sm">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-[#3C3835]">Premium Plan</CardTitle>
                    <p className="text-[#8B7355]">Active until November 18, 2025</p>
                  </div>
                </div>
                <Badge className="bg-[#8B7355] text-white">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-[#F5F0E8] rounded-xl border border-[#E8DDD0]">
                <p className="text-[#8B7355] text-sm">
                  You're enjoying all premium features! Your subscription will renew on November 18, 2025.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Email-to-Journal Card */}
          <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8B7355] to-[#C4A57B] rounded-t-lg" />
            <CardHeader className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-2xl flex items-center justify-center shadow-sm">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-[#3C3835]">Email-to-Journal</CardTitle>
                  <p className="text-[#8B7355]">Create journal entries by sending emails</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-[#8B7355] text-sm">
                  Generate your unique email address to start journaling via email. Any email sent to this address will automatically create a new journal entry.
                </p>
                <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Email Address
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#3C3835] flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-2xl flex items-center justify-center shadow-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#8B7355]" />
                  <div>
                    <p className="text-sm text-[#8B7355]">Email</p>
                    <p className="text-[#3C3835] font-medium">{user?.email || 'mohameddacarmohumed@gmail.com'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#8B7355]" />
                  <div>
                    <p className="text-sm text-[#8B7355]">Name</p>
                    <p className="text-[#3C3835] font-medium">{user?.name || 'Mohamed Dacar'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#8B7355]" />
                  <div>
                    <p className="text-sm text-[#8B7355]">Member since</p>
                    <p className="text-[#3C3835] font-medium">October 17, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
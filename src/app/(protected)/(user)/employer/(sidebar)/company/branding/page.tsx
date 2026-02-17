"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Palette, Upload, Eye, Save, Sparkles, Image, Type, Hash } from "lucide-react";
import { useState } from "react";

export default function CompanyBrandingPage() {
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Branding</h1>
          <p className="text-muted-foreground">Customize your company's visual identity</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo & Visual Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Logo & Visual Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Logo */}
            <div className="space-y-3">
              <Label>Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  TC
                </div>
                <div className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 200x200px, PNG or SVG
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <div className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Cover Image
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 1200x400px, JPG or PNG
                </p>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-3">
              <Label>Favicon</Label>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  T
                </div>
                <div className="flex-1">
                  <Button variant="outline" size="sm">
                    <Upload className="w-3 h-3 mr-2" />
                    Upload Favicon
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    32x32px, ICO or PNG
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Color */}
            <div className="space-y-3">
              <Label>Primary Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-muted-foreground/25"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="flex-1">
                  <Input 
                    value={selectedColor} 
                    onChange={(e) => setSelectedColor(e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-muted-foreground/25 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Secondary Colors */}
            <div className="space-y-3">
              <Label>Secondary Colors</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-500 rounded border"></div>
                  <Input defaultValue="#6b7280" placeholder="#6b7280" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded border"></div>
                  <Input defaultValue="#10b981" placeholder="#10b981" />
                </div>
              </div>
            </div>

            {/* Color Palette Preview */}
            <div className="space-y-3">
              <Label>Color Palette Preview</Label>
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Primary</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-sm">Secondary</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Success</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Font</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>Lato</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Secondary Font</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>Lato</option>
              </select>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-bold text-lg">Typography Preview</h3>
              <p className="text-base">This is how your body text will look</p>
              <p className="text-sm text-muted-foreground">This is secondary text</p>
            </div>
          </CardContent>
        </Card>

        {/* Brand Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Brand Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Brand Tagline</Label>
              <Input defaultValue="Innovation Through Technology" />
            </div>
            <div className="space-y-2">
              <Label>Brand Voice</Label>
              <Textarea 
                placeholder="Describe your brand's tone and voice..."
                defaultValue="Professional, innovative, and approachable. We communicate with confidence while remaining accessible to our audience."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Brand Values</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Innovation</Badge>
                <Badge variant="secondary">Quality</Badge>
                <Badge variant="secondary">Integrity</Badge>
                <Badge variant="secondary">Collaboration</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Brand Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 space-y-4" style={{ borderColor: selectedColor }}>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: selectedColor }}
                >
                  TC
                </div>
                <div>
                  <h3 className="font-bold text-xl">TechCorp Solutions</h3>
                  <p className="text-muted-foreground">Innovation Through Technology</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Job Posting</h4>
                  <p className="text-sm text-muted-foreground">How your job posts will appear</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Company Profile</h4>
                  <p className="text-sm text-muted-foreground">Your public company page</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Email Templates</h4>
                  <p className="text-sm text-muted-foreground">Branded communications</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
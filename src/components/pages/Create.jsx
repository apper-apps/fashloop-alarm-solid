import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { stylarService } from "@/services/api/stylarService";
import { toast } from "react-toastify";

const Create = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    style: "",
    description: "",
    images: []
  });

  const styles = [
    { value: "streetwear", label: "Streetwear", icon: "Shirt" },
    { value: "minimalist", label: "Minimalist", icon: "Minus" },
    { value: "vintage", label: "Vintage", icon: "Clock" },
    { value: "bohemian", label: "Bohemian", icon: "Flower" },
    { value: "gothic", label: "Gothic", icon: "Moon" },
    { value: "preppy", label: "Preppy", icon: "GraduationCap" },
    { value: "glamour", label: "Glamour", icon: "Star" },
    { value: "casual", label: "Casual", icon: "Coffee" }
  ];

  const mockImages = [
    "https://images.unsplash.com/photo-1506629905607-45b8e2d5c8b7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleSelect = (styleValue) => {
    setFormData(prev => ({
      ...prev,
      style: styleValue
    }));
  };

  const handleImageSelect = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.includes(imageUrl) 
        ? prev.images.filter(img => img !== imageUrl)
        : [...prev.images, imageUrl]
    }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.description)) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (step === 2 && !formData.style) {
      toast.error("Please select a style");
      return;
    }
    if (step === 3 && formData.images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const newStyler = {
        name: formData.name,
        style: formData.style,
        description: formData.description,
        images: formData.images,
        value: 100, // Starting value
        score: 50, // Starting score
        creatorId: "current-user" // In real app, get from auth
      };

      const createdStyler = await stylarService.create(newStyler);
      
      toast.success("Stylar created successfully!");
      navigate(`/stylar/${createdStyler.Id}`);
    } catch (error) {
      toast.error("Failed to create stylar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold gradient-text mb-2">
                Basic Information
              </h2>
              <p className="text-gray-400">Tell us about your stylar</p>
            </div>

            <Input
              label="Stylar Name"
              placeholder="Enter a unique name for your stylar"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                placeholder="Describe the style, inspiration, or story behind this look"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold gradient-text mb-2">
                Choose Style
              </h2>
              <p className="text-gray-400">Select the category that best fits your look</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {styles.map((style) => (
                <Card
                  key={style.value}
                  variant={formData.style === style.value ? "premium" : "default"}
                  hover={true}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    formData.style === style.value ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleStyleSelect(style.value)}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                      formData.style === style.value 
                        ? 'bg-gradient-to-br from-primary to-secondary' 
                        : 'bg-white/10'
                    }`}>
                      <ApperIcon 
                        name={style.icon} 
                        size={24} 
                        className={formData.style === style.value ? 'text-white' : 'text-gray-400'} 
                      />
                    </div>
                    <span className={`font-medium ${
                      formData.style === style.value ? 'text-white' : 'text-gray-300'
                    }`}>
                      {style.label}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold gradient-text mb-2">
                Select Images
              </h2>
              <p className="text-gray-400">Choose photos that represent your style</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {mockImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    formData.images.includes(imageUrl) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleImageSelect(imageUrl)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Style option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {formData.images.includes(imageUrl) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <ApperIcon name="Check" size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-gray-400">
              Selected {formData.images.length} image{formData.images.length !== 1 ? 's' : ''}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold gradient-text mb-2">
                Review & Create
              </h2>
              <p className="text-gray-400">Make sure everything looks perfect</p>
            </div>

            <Card variant="premium" className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">{formData.name}</h3>
                  <p className="text-gray-400 text-sm capitalize">{formData.style} style</p>
                </div>

                <p className="text-gray-300 text-sm">{formData.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  {formData.images.slice(0, 4).map((imageUrl, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={`Selected ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-gray-400">Starting Value</span>
                  <span className="font-bold text-accent">100 SC</span>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">Step {step} of 4</span>
          <span className="text-sm text-gray-400">{Math.round((step / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <Card variant="surface" className="p-6 lg:p-8">
        {renderStep()}

        {/* Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back
          </Button>

          {step < 4 ? (
            <Button
              variant="primary"
              onClick={handleNext}
            >
              Next
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ApperIcon name="Sparkles" size={16} className="mr-2" />
                  Create Stylar
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Create;
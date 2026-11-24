import { customerApi } from "@/api/customerApi";
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
    },
    preferences: {
      favoriteFlavors: [],
      icingType: "",
      dietaryRequirements: [],
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const flavors = [
    "chocolate",
    "vanilla",
    "strawberry",
    "red velvet",
    "lemon",
    "carrot",
    "funfetti",
  ];
  const icingTypes = [
    "buttercream",
    "cream cheese",
    "fondant",
    "royal icing",
    "ganache",
  ];
  const dietaryOptions = [
    "gluten-free",
    "dairy-free",
    "nut-free",
    "sugar-free",
    "vegan",
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.firstName)) {
      newErrors.firstName =
        "First name must be 2-30 characters and contain only letters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.lastName)) {
      newErrors.lastName =
        "Last name must be 2-30 characters and contain only letters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number and special character";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Phone validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    // Address validation
    if (!formData.address.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.address.city.trim()) {
      newErrors.city = "City is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.address.city)) {
      newErrors.city = "City must contain only letters and be 2-50 characters";
    }

    if (!formData.address.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.address.postalCode)) {
      newErrors.postalCode =
        "Please enter a valid postal code (12345 or 12345-6789)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name] || errors[name?.split(".")[1]]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        [name?.split(".")[1]]: "",
      }));
    }
  };

  const handleFlavorChange = (flavor, checked) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        favoriteFlavors: checked
          ? [...prev.preferences.favoriteFlavors, flavor]
          : prev.preferences.favoriteFlavors.filter((f) => f !== flavor),
      },
    }));
  };

  const handleDietaryChange = (dietary, checked) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietaryRequirements: checked
          ? [...prev.preferences.dietaryRequirements, dietary]
          : prev.preferences.dietaryRequirements.filter((d) => d !== dietary),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Hash password (in real app, this would be done on server)
      const registrationData = {
        ...formData,
        passwordHash: formData.password,
        address: [formData.address], // API expects array
      };

      delete registrationData.password;
      delete registrationData.confirmPassword;

      await customerApi.createCustomer(registrationData);
      setSuccess("Registration successful! You can now log in.");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: { street: "", city: "", postalCode: "" },
        preferences: {
          favoriteFlavors: [],
          icingType: "",
          dietaryRequirements: [],
        },
      });
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-pink-600">
              Create Your Account
            </CardTitle>
            <CardDescription>
              Join Sweet Bliss Cakes and start ordering delicious custom cakes
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={
                          errors.confirmPassword ? "border-red-500" : ""
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address.street">Street Address</Label>
                    <Input
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className={errors.street ? "border-red-500" : ""}
                    />
                    {errors.street && (
                      <p className="text-sm text-red-500">{errors.street}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address.city">City</Label>
                    <Input
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address.postalCode">Postal Code</Label>
                    <Input
                      id="address.postalCode"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleInputChange}
                      placeholder="12345"
                      className={errors.postalCode ? "border-red-500" : ""}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Cake Preferences (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Favorite Flavors</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {flavors.map((flavor) => (
                        <div
                          key={flavor}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={flavor}
                            checked={formData.preferences.favoriteFlavors.includes(
                              flavor
                            )}
                            onCheckedChange={(checked) =>
                              handleFlavorChange(flavor, checked)
                            }
                          />
                          <Label
                            htmlFor={flavor}
                            className="text-sm capitalize"
                          >
                            {flavor}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Dietary Requirements</Label>
                    <div className="space-y-2">
                      {dietaryOptions.map((dietary) => (
                        <div
                          key={dietary}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={dietary}
                            checked={formData.preferences.dietaryRequirements.includes(
                              dietary
                            )}
                            onCheckedChange={(checked) =>
                              handleDietaryChange(dietary, checked)
                            }
                          />
                          <Label
                            htmlFor={dietary}
                            className="text-sm capitalize"
                          >
                            {dietary}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Preferred Icing Type</Label>
                    <Select
                      value={formData.preferences.icingType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            icingType: value,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icing type" />
                      </SelectTrigger>
                      <SelectContent>
                        {icingTypes.map((icing) => (
                          <SelectItem
                            key={icing}
                            value={icing}
                            className="capitalize"
                          >
                            {icing}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {errors.submit}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-600">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Sign in here
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;

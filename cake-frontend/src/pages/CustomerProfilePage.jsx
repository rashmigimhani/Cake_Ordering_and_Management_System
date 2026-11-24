import { customerApi } from "@/api/customerApi";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, LogOut, Trash2, Save, User } from "lucide-react";
import LoyaltyTier from "@/components/LoyaltyTier";

const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchCustomer(userId);
  }, [navigate]);

  const fetchCustomer = async (userId) => {
    try {
      const customerData = await customerApi.getCustomerById(userId);
      setCustomer(customerData);

      // Set form data
      setFormData({
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        email: customerData.email || "",
        phoneNumber: customerData.phoneNumber || "",
        address: {
          street: customerData.address?.[0]?.street || "",
          city: customerData.address?.[0]?.city || "",
          postalCode: customerData.address?.[0]?.postalCode || "",
        },
        preferences: {
          favoriteFlavors: customerData.preferences?.favoriteFlavors || [],
          icingType: customerData.preferences?.icingType || "",
          dietaryRequirements:
            customerData.preferences?.dietaryRequirements || [],
        },
      });
    } catch (error) {
      console.error(error);
      setErrors({ fetch: "Failed to load customer data" });
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdate = async () => {
    setSuccess("");

    if (!validateForm()) return;

    setUpdating(true);

    try {
      const updateData = {
        ...formData,
        address: [formData.address], // API expects array
      };

      await customerApi.updateCustomer(customer._id, updateData);
      setSuccess("Profile updated successfully!");

      // Refresh customer data
      await fetchCustomer(customer._id);
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message || "Update failed. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await customerApi.deleteCustomer(customer._id);
      localStorage.removeItem("userId");
      navigate("/register");
    } catch (error) {
      console.error(error);
      setErrors({ delete: "Failed to delete account. Please try again." });
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Alert className="border-red-200 bg-red-50 max-w-md">
          <AlertDescription className="text-red-600">
            {errors.fetch}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-pink-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-pink-600">
              Account Information
            </CardTitle>
            <CardDescription>
              Update your personal details and cake preferences
            </CardDescription>
            {customer && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Member since:</strong>{" "}
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Total Orders:</strong>{" "}
                    {customer.orderHistory?.length || 0}
                  </p>
                </div>
                
                {/* Loyalty Tier Component */}
                <LoyaltyTier loyaltyPoints={customer.loyaltyPoints || 0} />
              </div>
            )}
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
                  Cake Preferences
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

              {errors.delete && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {errors.delete}
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  onClick={handleUpdate}
                  className="bg-pink-600 hover:bg-pink-700 flex-1"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={updating || deleting}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove all your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleting}
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Account"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerProfilePage;

import React, { useState, useEffect } from "react";
import { orderApi } from "@/api/orderApi";
import { cakeApi } from "@/api/cakeApi";
import cloudinaryService from "@/services/cloudinaryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShoppingCart, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cakeData, { calculatePrice } from "@/utils/cakeData";

const CreateOrderPage = () => {
  const [cakeIdFromUrl, setCakeIdFromUrl] = useState("");
  const [selectedCake, setSelectedCake] = useState(null);
  const [cakeLoading, setCakeLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    customerId: localStorage.getItem("userId"),
    cakeId: "",
    flavor: "",
    size: "",
    theme: "",
    eventDate: "",
    customImageUrl: "",
    deliveryMethod: "",
    deliveryAddress: {
      street: "",
      city: "",
      postalCode: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cakeId = urlParams.get("cakeId");
    if (cakeId) {
      setCakeIdFromUrl(cakeId);
      fetchCakeById(cakeId);
    }
  }, []);

  const fetchCakeById = async (cakeId) => {
    setCakeLoading(true);
    try {
      const cake = await cakeApi.getCakeById(cakeId);
      setSelectedCake(cake);
      setFormData((prev) => ({ ...prev, cakeId: cakeId }));
    } catch (error) {
      console.error("Failed to fetch cake:", error);
      setErrors({ cake: "Failed to load cake details" });
    } finally {
      setCakeLoading(false);
    }
  };

  const validateField = (name, value) => {
    const fieldErrors = { ...errors };
    const eventDate = new Date(value);
    const tomorrow = new Date();
    switch (name) {
      case "eventDate":
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (eventDate < tomorrow) {
          fieldErrors.eventDate =
            "Event date must be at least 24 hours from now";
        } else {
          delete fieldErrors.eventDate;
        }
        break;
      case "street":
        if (formData.deliveryMethod === "delivery" && !value.trim()) {
          fieldErrors.deliveryStreet =
            "Street address is required for delivery";
        } else {
          delete fieldErrors.deliveryStreet;
        }
        break;
      case "city":
        if (formData.deliveryMethod === "delivery" && !value.trim()) {
          fieldErrors.deliveryCity = "City is required for delivery";
        } else {
          delete fieldErrors.deliveryCity;
        }
        break;
      case "postalCode":
        if (
          formData.deliveryMethod === "delivery" &&
          !value.match(/^\d{5,6}$/)
        ) {
          fieldErrors.deliveryPostalCode =
            "Valid postal code is required for delivery";
        } else {
          delete fieldErrors.deliveryPostalCode;
        }
        break;
    }

    setErrors(fieldErrors);
  };

  const handleInputChange = (name, value) => {
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

    validateField(name.includes(".") ? name.split(".")[1] : name, value);

    // Update price when relevant fields change
    if (["size", "theme", "deliveryMethod"].includes(name)) {
      const updatedData = name.includes(".")
        ? {
            ...formData,
            [name.split(".")[0]]: {
              ...formData[name.split(".")[0]],
              [name.split(".")[1]]: value,
            },
          }
        : { ...formData, [name]: value };

      if (selectedCake && updatedData.size && updatedData.theme) {
        calculateCakePrice(selectedCake._id, updatedData.size, updatedData.theme);
      }
    }

    // Update price when delivery method changes
    if (name === "deliveryMethod" && selectedCake && formData.size && formData.theme) {
      calculateCakePrice(selectedCake._id, formData.size, formData.theme, value);
    }
  };

  const calculateCakePrice = async (cakeId, size, theme, deliveryMethod = null) => {
    try {
      // First try to use the cake's custom price calculation
      if (selectedCake?.availableSizes?.length > 0 && selectedCake?.availableThemes?.length > 0) {
        const result = await cakeApi.calculateCakePrice(cakeId, size, theme);
        const currentDeliveryMethod = deliveryMethod || formData.deliveryMethod;
        const deliveryCost = currentDeliveryMethod === "delivery" ? 200 : 0;
        const totalPrice = result.finalPrice + deliveryCost;
        
        setPriceInfo({
          basePrice: result.basePrice,
          finalPrice: result.finalPrice,
          deliveryCost: deliveryCost,
          totalPrice: totalPrice,
          size: size,
          theme: theme
        });
      } else {
        // Fallback to hardcoded cakeData calculation
        const pricing = calculatePrice(
          selectedCake?.cakeType || 'custom',
          size,
          theme,
          deliveryMethod || formData.deliveryMethod || "pickup"
        );
        
        setPriceInfo({
          basePrice: pricing.basePrice,
          finalPrice: pricing.cakePrice,
          deliveryCost: pricing.deliveryCost,
          totalPrice: pricing.totalPrice,
          size: size,
          theme: theme
        });
      }
    } catch (error) {
      console.error("Failed to calculate price:", error);
      // Fallback to hardcoded calculation if API fails
      try {
        const pricing = calculatePrice(
          selectedCake?.cakeType || 'custom',
          size,
          theme,
          deliveryMethod || formData.deliveryMethod || "pickup"
        );
        
        setPriceInfo({
          basePrice: pricing.basePrice,
          finalPrice: pricing.cakePrice,
          deliveryCost: pricing.deliveryCost,
          totalPrice: pricing.totalPrice,
          size: size,
          theme: theme
        });
      } catch (fallbackError) {
        console.error("Fallback price calculation failed:", fallbackError);
        setErrors({ price: "Failed to calculate price" });
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        customImage: "Please select a valid image file",
      }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        customImage: "Image size must be less than 5MB",
      }));
      return;
    }

    setImageUploading(true);
    setErrors((prev) => {
      const { customImage, ...rest } = prev;
      console.log(customImage);
      return rest;
    });

    try {
      const result = await cloudinaryService.uploadImage(file);

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          customImageUrl: result.url,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          customImage: result.error || "Failed to upload image",
        }));
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        customImage: "Failed to upload image",
      }));
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      customImageUrl: "",
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!selectedCake) {
      setErrors({ cake: "Please select a cake" });
      return;
    }

    if (!formData.flavor || !formData.size || !formData.theme || !formData.eventDate) {
      setErrors({ 
        submit: "Please fill in all required fields (flavor, size, theme, event date)" 
      });
      return;
    }

    // Validate event date
    const eventDate = new Date(formData.eventDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (eventDate < tomorrow) {
      setErrors({ eventDate: "Event date must be at least 24 hours from now" });
      return;
    }

    // Validate delivery address if delivery is selected
    if (formData.deliveryMethod === "delivery") {
      if (!formData.deliveryAddress.street || !formData.deliveryAddress.city || !formData.deliveryAddress.postalCode) {
        setErrors({ submit: "Please fill in all delivery address fields" });
        return;
      }
    }

    setLoading(true);

    try {
      const orderData = {
        customerId: formData.customerId,
        cakeType: selectedCake.name,
        flavor: formData.flavor,
        size: formData.size,
        theme: formData.theme,
        eventDate: new Date(formData.eventDate).toISOString(),
        orderStatus: "Pending",
        deliveryMethod: formData.deliveryMethod === "delivery" ? "Delivery" : "Pickup",
        totalPrice: priceInfo?.totalPrice || selectedCake.price,
      };

      if (formData.customImageUrl) {
        orderData.customImageUrl = formData.customImageUrl;
      }

      if (formData.deliveryMethod === "delivery") {
        orderData.deliveryAddress = formData.deliveryAddress;
      }

      // Create the order
      const order = await orderApi.createOrder(orderData);

      // Reduce cake stock on successful order creation
      if (order && order._id) {
        try {
          await cakeApi.reduceStock(selectedCake._id, 1);
          console.log("Cake stock reduced successfully");
        } catch (stockError) {
          console.error("Failed to reduce cake stock:", stockError);
          // Note: Order is already created, so we just log the error
          // In a real app, you might want to handle this differently
        }

        // Reset form
        setFormData({
          customerId: localStorage.getItem("userId"),
          cakeId: cakeIdFromUrl || "",
          flavor: "",
          size: "",
          theme: "",
          eventDate: "",
          customImageUrl: "",
          deliveryMethod: "",
          deliveryAddress: {
            street: "",
            city: "",
            postalCode: "",
          },
        });
        setPriceInfo(null);
        setErrors({});

        alert("Order created successfully!");
        navigate(`/create-payment?orderId=${order._id}`);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to create order",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableFlavors = selectedCake?.flavors || [];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Create New Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              {cakeLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading cake details...</span>
                </div>
              ) : selectedCake ? (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">{selectedCake.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedCake.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">Base Price: LKR {selectedCake.basePrice?.toFixed(2) || selectedCake.price?.toFixed(2)}</span>
                    <span className="font-medium">Stock: {selectedCake.inStockAmount}</span>
                    <span className={`px-2 py-1 rounded text-xs ${selectedCake.inStockAmount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedCake.inStockAmount > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  {selectedCake.imageUrl && (
                    <img 
                      src={selectedCake.imageUrl} 
                      alt={selectedCake.name}
                      className="mt-3 w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>
              ) : cakeIdFromUrl ? (
                <div className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-red-600">Failed to load cake details. Please try again.</p>
                </div>
              ) : null}
              
              <div className="space-y-4">
                <div>
                  <Input
                    id="customerId"
                    type={"hidden"}
                    value={formData.customerId}
                  />
                </div>


                <div>
                  <Label htmlFor="flavor">Flavor</Label>
                  <Select
                    value={formData.flavor}
                    onValueChange={(value) =>
                      handleInputChange("flavor", value)
                    }
                    disabled={!selectedCake}
                  >
                    <SelectTrigger
                      className={errors.flavor ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select flavor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFlavors.map((flavor) => (
                        <SelectItem key={flavor} value={flavor}>
                          {flavor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.flavor && (
                    <p className="text-sm text-red-500 mt-1">{errors.flavor}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) => handleInputChange("size", value)}
                  >
                    <SelectTrigger
                      className={errors.size ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {(selectedCake?.availableSizes && selectedCake.availableSizes.length > 0) 
                        ? selectedCake.availableSizes.map((size) => (
                            <SelectItem key={size.size} value={size.size}>
                              <div>
                                <div className="font-medium">
                                  {size.size === 'small' ? 'Small (6 inch)' :
                                   size.size === 'medium' ? 'Medium (8 inch)' :
                                   size.size === 'large' ? 'Large (10 inch)' :
                                   size.size === 'extraLarge' ? 'Extra Large (12 inch)' : size.size}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {size.description || `Multiplier: ${size.multiplier}x`}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        : cakeData.sizes.map((size) => (
                            <SelectItem key={size.id} value={size.id}>
                              <div>
                                <div className="font-medium">{size.name}</div>
                                <div className="text-sm text-gray-500">
                                  {size.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                  {errors.size && (
                    <p className="text-sm text-red-500 mt-1">{errors.size}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={formData.theme}
                    onValueChange={(value) => handleInputChange("theme", value)}
                  >
                    <SelectTrigger
                      className={errors.theme ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {(selectedCake?.availableThemes && selectedCake.availableThemes.length > 0)
                        ? selectedCake.availableThemes.map((theme) => (
                            <SelectItem key={theme.theme} value={theme.theme}>
                              <div>
                                <div className="font-medium">
                                  {theme.theme === 'birthday' ? 'Birthday' :
                                   theme.theme === 'wedding' ? 'Wedding' :
                                   theme.theme === 'anniversary' ? 'Anniversary' :
                                   theme.theme === 'graduation' ? 'Graduation' :
                                   theme.theme === 'corporate' ? 'Corporate' :
                                   theme.theme === 'baby_shower' ? 'Baby Shower' :
                                   theme.theme === 'valentine' ? 'Valentine' :
                                   theme.theme === 'christmas' ? 'Christmas' :
                                   theme.theme === 'custom' ? 'Custom Design' : theme.theme}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {theme.description || `+LKR ${theme.additionalCost}`}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        : cakeData.themes.map((theme) => (
                            <SelectItem key={theme.id} value={theme.id}>
                              <div>
                                <div className="font-medium">{theme.name}</div>
                                <div className="text-sm text-gray-500">
                                  {theme.description} {theme.additionalCost > 0 && `+LKR ${theme.additionalCost}`}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                  {errors.theme && (
                    <p className="text-sm text-red-500 mt-1">{errors.theme}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="datetime-local"
                    value={formData.eventDate}
                    onChange={(e) =>
                      handleInputChange("eventDate", e.target.value)
                    }
                    className={errors.eventDate ? "border-red-500" : ""}
                  />
                  {errors.eventDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.eventDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customImage">Custom Image (Optional)</Label>
                  <div className="space-y-2">
                    {!formData.customImageUrl ? (
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="customImage"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              your custom image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                          <Input
                            id="customImage"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={imageUploading}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={formData.customImageUrl}
                          alt="Custom cake design"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {imageUploading && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span className="text-sm text-gray-500">
                          Uploading image...
                        </span>
                      </div>
                    )}

                    {errors.customImage && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.customImage}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="deliveryMethod">Delivery Method</Label>
                  <Select
                    value={formData.deliveryMethod}
                    onValueChange={(value) =>
                      handleInputChange("deliveryMethod", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.deliveryMethod ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      {cakeData.deliveryMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-500">
                              {method.cost > 0 ? `+LKR ${method.cost}` : "Free"}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.deliveryMethod && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.deliveryMethod}
                    </p>
                  )}
                </div>

                {formData.deliveryMethod === "delivery" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-medium">Delivery Address</h3>

                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={formData.deliveryAddress.street}
                        onChange={(e) =>
                          handleInputChange(
                            "deliveryAddress.street",
                            e.target.value
                          )
                        }
                        placeholder="123 Main Street"
                        className={
                          errors.deliveryStreet ? "border-red-500" : ""
                        }
                      />
                      {errors.deliveryStreet && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.deliveryStreet}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.deliveryAddress.city}
                        onChange={(e) =>
                          handleInputChange(
                            "deliveryAddress.city",
                            e.target.value
                          )
                        }
                        placeholder="Negombo"
                        className={errors.deliveryCity ? "border-red-500" : ""}
                      />
                      {errors.deliveryCity && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.deliveryCity}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.deliveryAddress.postalCode}
                        onChange={(e) =>
                          handleInputChange(
                            "deliveryAddress.postalCode",
                            e.target.value
                          )
                        }
                        placeholder="11500"
                        className={
                          errors.deliveryPostalCode ? "border-red-500" : ""
                        }
                      />
                      {errors.deliveryPostalCode && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.deliveryPostalCode}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={loading || imageUploading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    "Create Order"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {priceInfo ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>LKR {priceInfo.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Size ({formData.size}):</span>
                    <span>×{priceInfo.sizeMultiplier}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Theme ({formData.theme}):</span>
                    <span>×{priceInfo.themeMultiplier}</span>
                  </div>
                  {priceInfo.themeAdditionalCost > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Theme Extra:</span>
                      <span>+LKR {priceInfo.themeAdditionalCost}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Cake Price:</span>
                    <span>LKR {priceInfo.cakePrice}</span>
                  </div>
                  {priceInfo.deliveryCost > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>LKR {priceInfo.deliveryCost}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>LKR {priceInfo.totalPrice}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  Select cake details to see pricing
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;

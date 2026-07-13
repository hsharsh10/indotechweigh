import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload, Trash2, Image as ImageIcon, Plus, Settings, CheckCircle2, Package } from "lucide-react";
import type { Product } from "@/data/products";
import type { Part } from "@/data/parts";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingItem: Product | Part | null;
  type: "products" | "parts";
}

export function ProductFormModal({ isOpen, onClose, onSaved, editingItem, type }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    short_description: "",
    description: "",
    category: "Table Top Scale",
    importance: "High", // for parts
    price: "",
    original_price: "",
    discount: "0",
    stock_status: "in_stock",
    images: [] as string[],
  });

  // Dynamic lists for specs, features, applications
  const [specificationsList, setSpecificationsList] = useState<{ key: string; value: string }[]>([]);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [applicationsList, setApplicationsList] = useState<string[]>([]);

  useEffect(() => {
    if (editingItem) {
      const existingImages = 'images' in editingItem && editingItem.images && editingItem.images.length > 0
        ? editingItem.images
        : ('specifications' in editingItem && editingItem.specifications && Array.isArray(editingItem.specifications._gallery) && editingItem.specifications._gallery.length > 0)
        ? editingItem.specifications._gallery
        : editingItem.image ? [editingItem.image] : [];

      // Extract Specs (excluding internal _gallery)
      const rawSpecs = editingItem.specifications || {};
      const specsArr = Object.entries(rawSpecs)
        .filter(([k]) => k !== "_gallery")
        .map(([key, value]) => ({ key, value: String(value) }));

      setSpecificationsList(specsArr.length > 0 ? specsArr : [
        { key: "capacity", value: "" },
        { key: "accuracy", value: "" }
      ]);

      // Extract Features
      const rawFeatures = ('features' in editingItem && Array.isArray(editingItem.features)) ? editingItem.features : [];
      setFeaturesList(rawFeatures);

      // Extract Applications
      const rawApplications = ('applications' in editingItem && Array.isArray(editingItem.applications)) ? editingItem.applications : [];
      setApplicationsList(rawApplications);

      setFormData({
        id: editingItem.id,
        name: editingItem.name,
        short_description: 'shortDescription' in editingItem ? editingItem.shortDescription : "",
        description: editingItem.description,
        category: 'category' in editingItem ? editingItem.category : "Table Top Scale",
        importance: 'importance' in editingItem ? editingItem.importance : "High",
        price: editingItem.price?.toString() || "",
        original_price: editingItem.originalPrice?.toString() || "",
        discount: editingItem.discount?.toString() || "0",
        stock_status: editingItem.stockStatus,
        images: existingImages,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        short_description: "",
        description: "",
        category: "Table Top Scale",
        importance: "High",
        price: "",
        original_price: "",
        discount: "0",
        stock_status: "in_stock",
        images: [],
      });
      setSpecificationsList([
        { key: "capacity", value: "" },
        { key: "accuracy", value: "" }
      ]);
      setFeaturesList([""]);
      setApplicationsList([""]);
    }
  }, [editingItem, isOpen]);

  // Specifications handlers
  const handleAddSpecification = () => {
    setSpecificationsList(prev => [...prev, { key: "", value: "" }]);
  };
  const handleUpdateSpecification = (index: number, field: "key" | "value", val: string) => {
    setSpecificationsList(prev => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };
  const handleRemoveSpecification = (index: number) => {
    setSpecificationsList(prev => prev.filter((_, idx) => idx !== index));
  };

  // Features handlers
  const handleAddFeature = () => {
    setFeaturesList(prev => [...prev, ""]);
  };
  const handleUpdateFeature = (index: number, val: string) => {
    setFeaturesList(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };
  const handleRemoveFeature = (index: number) => {
    setFeaturesList(prev => prev.filter((_, idx) => idx !== index));
  };

  // Applications handlers
  const handleAddApplication = () => {
    setApplicationsList(prev => [...prev, ""]);
  };
  const handleUpdateApplication = (index: number, val: string) => {
    setApplicationsList(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };
  const handleRemoveApplication = (index: number) => {
    setApplicationsList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product_images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('product_images').getPublicUrl(filePath);
        newUploadedUrls.push(data.publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newUploadedUrls],
      }));
      toast.success(`${newUploadedUrls.length} image(s) uploaded!`);
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image(s). Check if product_images bucket exists and is public.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
    toast.info("Image removed");
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || formData.images.length === 0) {
      toast.error("Please fill all required fields (Name, Price, and at least 1 Image)");
      return;
    }

    setLoading(true);
    try {
      // Auto-generate ID for new items
      const itemId = editingItem ? editingItem.id : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Build specs object
      const specsObj: Record<string, string> = {};
      specificationsList.forEach(item => {
        if (item.key.trim()) {
          specsObj[item.key.trim()] = item.value.trim();
        }
      });
      specsObj._gallery = formData.images as unknown as string;

      const payload: Record<string, unknown> = {
        id: itemId,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        original_price: Number(formData.original_price) || Number(formData.price),
        discount: Number(formData.discount),
        stock_status: formData.stock_status,
        in_stock: formData.stock_status === "in_stock",
        image: formData.images[0] || "",
        images: formData.images,
        specifications: specsObj,
      };

      if (type === "products") {
        payload.short_description = formData.short_description;
        payload.category = formData.category;
        payload.features = featuresList.filter(f => f.trim().length > 0);
        payload.applications = applicationsList.filter(a => a.trim().length > 0);
        if (!editingItem) {
          payload.variants = [];
        }
      } else {
        payload.importance = formData.importance;
        if (!editingItem) {
          payload.types = [];
          payload.compatible_products = [];
        }
      }

      let { error } = await supabase
        .from(type)
        .upsert(payload);

      // Fallback if 'images' column doesn't exist in Supabase table schema yet
      if (error && (error.message?.includes("images") || error.code === "PGRST204" || error.code === "42703")) {
        const { images, ...payloadWithoutImages } = payload;
        const retry = await supabase.from(type).upsert(payloadWithoutImages);
        error = retry.error;
      }

      if (error) {
        console.error("Supabase Save Error:", error);
        toast.error(`Save Error: ${error.message || "Failed to save product"}`);
        return;
      }

      toast.success(editingItem ? "Updated successfully!" : "Added successfully!");
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to save";
      toast.error(`Error: ${msg}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add New'} {type === 'products' ? 'Product' : 'Part'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label>Name *</Label>
            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Table Top Scale" />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label>Price (₹) *</Label>
            <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 5000" />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label>Original Price (₹)</Label>
            <Input type="number" value={formData.original_price} onChange={e => setFormData({...formData, original_price: e.target.value})} placeholder="Before discount" />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label>Discount (%)</Label>
            <Input type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Stock Status</Label>
            <Select value={formData.stock_status} onValueChange={v => setFormData({...formData, stock_status: v})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="made_to_order">Made to Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "products" && (
            <>
              <div className="space-y-2 col-span-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table Top Scale">Table Top Scale</SelectItem>
                    <SelectItem value="Platform Scale">Platform Scale</SelectItem>
                    <SelectItem value="Industrial Weighing Scale">Industrial Weighing Scale</SelectItem>
                    <SelectItem value="Crane Scale">Crane Scale</SelectItem>
                    <SelectItem value="Electronic Weighbridge">Electronic Weighbridge</SelectItem>
                    <SelectItem value="Jewellery Scale">Jewellery Scale</SelectItem>
                    <SelectItem value="Personal Scale">Personal Scale</SelectItem>
                    <SelectItem value="Custom Solutions">Custom Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Short Description</Label>
                <Input value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder="Brief 1-line overview" />
              </div>
            </>
          )}

          <div className="space-y-2 col-span-2">
            <Label>Full Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Detailed product description..." />
          </div>

          {/* Technical Specifications Section */}
          <div className="space-y-3 col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 font-bold text-slate-800">
                <Settings className="h-4 w-4 text-primary" />
                Technical Specifications
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSpecification} className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Specification
              </Button>
            </div>

            {specificationsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specifications added yet. Click "+ Add Specification" to add capacity, accuracy, pan size, etc.</p>
            ) : (
              <div className="space-y-2">
                {specificationsList.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Property (e.g. capacity, accuracy, display)"
                      value={spec.key}
                      onChange={e => handleUpdateSpecification(idx, "key", e.target.value)}
                      className="flex-1 bg-white text-xs"
                    />
                    <Input
                      placeholder="Value (e.g. 50kg, 5g, LED Red)"
                      value={spec.value}
                      onChange={e => handleUpdateSpecification(idx, "value", e.target.value)}
                      className="flex-1 bg-white text-xs"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSpecification(idx)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Remove specification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Key Features Section (for products) */}
          {type === "products" && (
            <div className="space-y-3 col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 font-bold text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Key Features
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddFeature} className="h-8 text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Feature
                </Button>
              </div>

              {featuresList.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No features added yet. Click "+ Add Feature" to add product highlights.</p>
              ) : (
                <div className="space-y-2">
                  {featuresList.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="Feature highlight (e.g. Overload protection, 40hr Battery backup)"
                        value={feat}
                        onChange={e => handleUpdateFeature(idx, e.target.value)}
                        className="flex-1 bg-white text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFeature(idx)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Remove feature"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Applications Section (for products) */}
          {type === "products" && (
            <div className="space-y-3 col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Package className="h-4 w-4 text-primary" />
                  Applications
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddApplication} className="h-8 text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Application
                </Button>
              </div>

              {applicationsList.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No applications added yet. Click "+ Add Application" to specify industries or usage environments.</p>
              ) : (
                <div className="space-y-2">
                  {applicationsList.map((app, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="Application (e.g. Retail & Grocery Stores, Industrial Warehouses)"
                        value={app}
                        onChange={e => handleUpdateApplication(idx, e.target.value)}
                        className="flex-1 bg-white text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveApplication(idx)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Remove application"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Multiple Product Images Upload & Gallery */}
          <div className="space-y-3 col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 font-bold text-slate-800">
                <ImageIcon className="h-4 w-4 text-primary" />
                Product Images * ({formData.images.length} added)
              </Label>
              <span className="text-xs text-muted-foreground">First image is main display photo</span>
            </div>

            {/* Thumbnail Grid with Delete Option */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 p-3 bg-white rounded-xl border border-slate-200">
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group aspect-square bg-card rounded-lg border overflow-hidden flex items-center justify-center p-1">
                    <img src={imgUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-contain" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        Main
                      </span>
                    )}
                    {/* Delete / Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition-transform group-hover:scale-110"
                      title="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Input for Multiple Files */}
            <div className="border-2 border-dashed border-slate-300 hover:border-primary/50 rounded-xl p-4 text-center transition-colors bg-white">
              <input
                type="file"
                accept="image/*"
                multiple
                id="file-upload-input"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className={`h-8 w-8 text-primary mb-2 ${uploading ? "animate-pulse" : ""}`} />
                <p className="text-sm font-medium text-foreground">
                  {uploading ? "Uploading images..." : "Click to upload image(s)"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Select one or multiple image files (PNG, JPG, WEBP)</p>
              </label>
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading || uploading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

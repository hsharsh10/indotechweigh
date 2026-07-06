import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload, Trash2, Image as ImageIcon } from "lucide-react";
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

  useEffect(() => {
    if (editingItem) {
      const existingImages = 'images' in editingItem && editingItem.images && editingItem.images.length > 0
        ? editingItem.images
        : ('specifications' in editingItem && editingItem.specifications && Array.isArray(editingItem.specifications._gallery) && editingItem.specifications._gallery.length > 0)
        ? editingItem.specifications._gallery
        : editingItem.image ? [editingItem.image] : [];

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
    }
  }, [editingItem, isOpen]);

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
      // Reset file input value so same files can be re-selected if needed
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
      
      const existingSpecs = (editingItem && 'specifications' in editingItem && editingItem.specifications) ? editingItem.specifications : {};
      const updatedSpecs = { ...existingSpecs, _gallery: formData.images };

      const payload: any = {
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
        specifications: updatedSpecs,
      };

      if (type === "products") {
        payload.short_description = formData.short_description;
        payload.category = formData.category;
        if (!editingItem) {
          payload.applications = [];
          payload.specifications = {};
          payload.features = [];
          payload.variants = [];
        }
      } else {
        payload.importance = formData.importance;
        if (!editingItem) {
          payload.types = [];
          payload.specifications = {};
          payload.applications = [];
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
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err?.message || "Failed to save. Check console for details."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Short Description</Label>
                <Input value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} />
              </div>
            </>
          )}

          <div className="space-y-2 col-span-2">
            <Label>Full Description</Label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
          </div>

          {/* Multiple Product Images Upload & Gallery */}
          <div className="space-y-3 col-span-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 font-medium">
                <ImageIcon className="h-4 w-4 text-primary" />
                Product Images * ({formData.images.length} added)
              </Label>
              <span className="text-xs text-muted-foreground">First image is main display photo</span>
            </div>

            {/* Thumbnail Grid with Delete Option */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 p-3 bg-muted/40 rounded-xl border border-border">
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
            <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-4 text-center transition-colors bg-card">
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

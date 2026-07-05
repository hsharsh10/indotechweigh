import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    image: "",
  });

  useEffect(() => {
    if (editingItem) {
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
        image: editingItem.image,
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
        image: "",
      });
    }
  }, [editingItem, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product_images').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image. Did you create the product_images bucket?");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.image) {
      toast.error("Please fill all required fields (Name, Price, Image)");
      return;
    }

    setLoading(true);
    try {
      // Auto-generate ID for new items
      const itemId = editingItem ? editingItem.id : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const payload: any = {
        id: itemId,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        original_price: Number(formData.original_price) || Number(formData.price),
        discount: Number(formData.discount),
        stock_status: formData.stock_status,
        in_stock: formData.stock_status === "in_stock",
        image: formData.image,
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

      const { error } = await supabase
        .from(type)
        .upsert(payload);

      if (error) throw error;
      
      toast.success(editingItem ? "Updated successfully!" : "Added successfully!");
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save. Check console for details.");
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

          <div className="space-y-2 col-span-2">
            <Label>Product Image *</Label>
            <div className="flex gap-4 items-center">
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-16 h-16 object-contain rounded border" />
              )}
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </div>
            {formData.image && <p className="text-xs text-muted-foreground break-all">{formData.image}</p>}
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

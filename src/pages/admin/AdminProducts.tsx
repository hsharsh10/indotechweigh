import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { fetchProducts, type Product, formatPrice } from "@/data/products";
import { fetchParts, type Part } from "@/data/parts";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Package, Info, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductFormModal } from "@/components/admin/ProductFormModal";

type Tab = "products" | "parts";

function StockBadge({ status }: { status: string }) {
  if (status === "in_stock") return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">In Stock</Badge>;
  if (status === "made_to_order") return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Made to Order</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Out of Stock</Badge>;
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | Part | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("indotech_admin") !== "true") {
      navigate("/admin");
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    const [prodData, partData] = await Promise.all([
      fetchProducts(),
      fetchParts()
    ]);
    setProducts(prodData);
    setParts(partData);
    setLoading(false);
  };

  const handleDelete = async (id: string, isPart: boolean) => {
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
    
    try {
      const table = isPart ? "parts" : "products";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Item deleted successfully");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Catalog Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your products and spare parts</p>
          </div>
          <Button onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New {tab === "products" ? "Product" : "Part"}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["products", "parts"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-primary/50"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-slate-600 font-medium">Name</th>
                    <th className="text-left px-5 py-3 text-slate-600 font-medium hidden sm:table-cell">Category/Type</th>
                    <th className="text-left px-5 py-3 text-slate-600 font-medium">Price</th>
                    <th className="text-left px-5 py-3 text-slate-600 font-medium">Stock</th>
                    <th className="text-right px-5 py-3 text-slate-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tab === "products" && products.map((p, i) => (
                    <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.shortDescription}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">{p.category}</td>
                      <td className="px-5 py-3">
                        {p.price ? (
                          <div>
                            <p className="font-semibold text-slate-800">{formatPrice(p.price)}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Quote only</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <StockBadge status={p.stockStatus} />
                      </td>
                      <td className="px-5 py-3 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditingItem(p);
                          setModalOpen(true);
                        }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(p.id, false)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {tab === "parts" && parts.map((p, i) => (
                    <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">—</td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-800">{formatPrice(p.price)}</p>
                      </td>
                      <td className="px-5 py-3">
                        <StockBadge status={p.stockStatus} />
                      </td>
                      <td className="px-5 py-3 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditingItem(p);
                          setModalOpen(true);
                        }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(p.id, true)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <ProductFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSaved={loadData} 
        editingItem={editingItem} 
        type={tab} 
      />
    </AdminLayout>
  );
}

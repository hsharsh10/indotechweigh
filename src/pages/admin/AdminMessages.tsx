import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Trash2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  message: string;
  created_at: string;
}

export default function AdminMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("indotech_admin") !== "true") {
      navigate("/admin");
      return;
    }
    loadMessages();
  }, [navigate]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to load messages: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;

      toast.success("Message deleted successfully");
      setMessages(prev => prev.filter(msg => msg.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to delete message: " + msg);
    }
  };

  const filtered = messages.filter((m) => {
    const term = search.toLowerCase();
    return (
      !search ||
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.phone?.toLowerCase().includes(term) ||
      m.company?.toLowerCase().includes(term) ||
      m.message?.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contact Enquiries</h1>
            <p className="text-slate-500 text-sm mt-1">
              View and manage client enquiries sent via contact form
            </p>
          </div>
          <div className="text-sm font-semibold bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-2xs">
            Total Messages: <span className="text-primary">{messages.length}</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by name, email, phone, company, or content..."
            className="pl-10 h-11 bg-white border-slate-200 rounded-xl w-full shadow-2xs"
          />
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white border border-slate-100 rounded-2xl shadow-2xs">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-2xs">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No messages found</h3>
            <p className="text-slate-500 text-sm">
              {search ? "Try adjusting your search query" : "Enquiries submitted will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((msg) => {
              const isExpanded = expandedId === msg.id;

              return (
                <Card
                  key={msg.id}
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                  className={`cursor-pointer transition-all duration-200 border-slate-200/80 hover:border-primary/40 hover:shadow-md ${
                    isExpanded ? "ring-1 ring-primary/20 bg-slate-50/50" : "bg-white"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      {/* Left Info: Contact Header */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-900">{msg.name}</h3>
                          {msg.company && (
                            <Badge variant="secondary" className="flex items-center gap-1 bg-slate-100 text-slate-700">
                              <Building2 className="h-3 w-3" />
                              {msg.company}
                            </Badge>
                          )}
                        </div>

                        {/* Fast Contact info block */}
                        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-500 font-sans">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {msg.email}
                          </span>
                          {msg.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              {msg.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Right Info: Action Buttons */}
                      <div className="flex items-center gap-2 lg:self-start">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          onClick={(e) => e.stopPropagation()}
                          className="h-9 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                        >
                          <a href={`mailto:${msg.email}`}>
                            Reply via Mail
                            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(msg.id, e)}
                          className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Excerpt of Message (collapsed) or full message (expanded) */}
                    <div className="mt-4 border-t border-slate-100/80 pt-4">
                      <p className={`text-slate-700 text-sm leading-relaxed whitespace-pre-line ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}>
                        {msg.message}
                      </p>
                    </div>

                    {/* Expanded details address */}
                    {isExpanded && (
                      <div className="mt-4 grid md:grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
                        {msg.address && (
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-primary" />
                              Location Address
                            </p>
                            <p className="text-slate-600 pl-5">{msg.address}</p>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800">Direct Actions</p>
                          <div className="flex gap-2 pl-1 mt-1">
                            {msg.phone && (
                              <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                                <a href={`tel:${msg.phone}`}>Call {msg.phone}</a>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                              <a href={`mailto:${msg.email}?subject=Regarding your enquiry at Indotech`}>
                                Quick email
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, BookOpen, Edit2, Trash2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import JournalIconPicker from "../components/journals/JournalIconPicker";
import JournalColorPicker from "../components/journals/JournalColorPicker";

export default function Journals() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#8B7355",
    icon: "BookOpen",
    is_default: false
  });

  const { data: journals, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => base44.entities.Journal.list("-created_date"),
    initialData: [],
  });

  const { data: entryCounts } = useQuery({
    queryKey: ['entry-counts'],
    queryFn: async () => {
      const entries = await base44.entities.JournalEntry.list();
      const counts = {};
      entries.forEach(entry => {
        if (entry.journal_id) {
          counts[entry.journal_id] = (counts[entry.journal_id] || 0) + 1;
        }
      });
      return counts;
    },
    initialData: {},
  });

  const createJournalMutation = useMutation({
    mutationFn: (journalData) => base44.entities.Journal.create(journalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const updateJournalMutation = useMutation({
    mutationFn: ({ id, journalData }) => base44.entities.Journal.update(id, journalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const deleteJournalMutation = useMutation({
    mutationFn: (id) => base44.entities.Journal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#8B7355",
      icon: "BookOpen",
      is_default: false
    });
    setEditingJournal(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingJournal) {
      updateJournalMutation.mutate({ id: editingJournal.id, journalData: formData });
    } else {
      createJournalMutation.mutate(formData);
    }
  };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    setFormData({
      name: journal.name,
      description: journal.description || "",
      color: journal.color || "#8B7355",
      icon: journal.icon || "BookOpen",
      is_default: journal.is_default || false
    });
    setShowDialog(true);
  };

  const handleDelete = (journal) => {
    if (confirm(`Delete "${journal.name}"? All entries in this journal will remain but won't be associated with any journal.`)) {
      deleteJournalMutation.mutate(journal.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#3C3835] mb-2">My Journals</h1>
            <p className="text-[#8B7355]">Organize your life into different journals</p>
          </div>
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                New Journal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-gradient-to-br from-[#FBF9F6] to-[#F5F0E8] border-2 border-[#E8DDD0] p-0">
              <DialogHeader className="bg-gradient-to-br from-[#FBF9F6] to-[#F5F0E8]">
                <DialogTitle className="text-2xl font-bold text-[#3C3835] flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-xl flex items-center justify-center shadow-md">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  {editingJournal ? "Edit Journal" : "Create New Journal"}
                </DialogTitle>
              </DialogHeader>
              <DialogBody className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#3C3835] font-semibold text-sm">
                    Journal Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Work, Personal, Travel"
                    className="border-2 border-[#E8DDD0] focus:border-[#8B7355] bg-white h-12 rounded-xl text-[#3C3835] placeholder:text-[#C4A57B]/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#3C3835] font-semibold text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="What's this journal for?"
                    className="border-2 border-[#E8DDD0] focus:border-[#8B7355] bg-white rounded-xl text-[#3C3835] placeholder:text-[#C4A57B]/50 min-h-[100px]"
                  />
                </div>
                
                <JournalIconPicker 
                  value={formData.icon} 
                  onChange={(icon) => setFormData({...formData, icon})} 
                />
                
                <JournalColorPicker 
                  value={formData.color} 
                  onChange={(color) => setFormData({...formData, color})} 
                />
                
                <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl border-2 border-[#E8DDD0]">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                    className="w-5 h-5 rounded border-2 border-[#8B7355] text-[#8B7355] focus:ring-[#8B7355] focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <Label htmlFor="is_default" className="cursor-pointer text-[#3C3835] font-medium">
                      Set as default journal
                    </Label>
                    <p className="text-xs text-[#8B7355] mt-0.5">New entries will be added here automatically</p>
                  </div>
                  <Star className={`w-5 h-5 ${formData.is_default ? 'text-yellow-500 fill-current' : 'text-[#C4A57B]'}`} />
                </div>
                
                <div className="flex gap-3 pt-4 pb-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDialog(false);
                      resetForm();
                    }}
                    className="flex-1 border-2 border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8] h-12 rounded-xl font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!formData.name.trim()}
                    className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#C4A57B] hover:from-[#6F5A44] hover:to-[#A88B63] text-white h-12 rounded-xl shadow-lg font-semibold disabled:opacity-50"
                  >
                    {editingJournal ? "Update Journal" : "Create Journal"}
                  </Button>
                </div>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-48 animate-pulse bg-white" />
            ))}
          </div>
        ) : journals.length === 0 ? (
          <Card className="p-12 text-center border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#8B7355]" />
            <h3 className="text-xl font-semibold text-[#3C3835] mb-2">No journals yet</h3>
            <p className="text-[#8B7355] mb-6">Create your first journal to start organizing your entries</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {journals.map((journal, index) => (
                <motion.div
                  key={journal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-2 cursor-pointer relative overflow-hidden bg-white"
                    style={{ borderColor: journal.color + "40" }}
                  >
                    <div 
                      className="absolute top-0 left-0 w-full h-2"
                      style={{ backgroundColor: journal.color }}
                    />
                    <CardHeader className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: journal.color + "20" }}
                          >
                            <BookOpen className="w-6 h-6" style={{ color: journal.color }} />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-[#3C3835] flex items-center gap-2">
                              {journal.name}
                              {journal.is_default && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </CardTitle>
                            <p className="text-sm text-[#8B7355] mt-1">
                              {entryCounts[journal.id] || 0} entries
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {journal.description && (
                        <p className="text-sm text-[#8B7355] mb-4 line-clamp-2">
                          {journal.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(journal)}
                          className="flex-1 border-2 border-[#E8DDD0] hover:bg-[#F5F0E8] text-[#8B7355]"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(journal)}
                          className="flex-1 text-red-600 hover:bg-red-50 border-2 border-red-200"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Plus, Target, CheckCircle, TrendingUp, Edit2, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const goalCategories = [
  { value: 'health', label: 'Health', color: 'bg-green-100 text-green-800' },
  { value: 'learning', label: 'Learning', color: 'bg-blue-100 text-blue-800' },
  { value: 'personal', label: 'Personal', color: 'bg-purple-100 text-purple-800' },
  { value: 'work', label: 'Work', color: 'bg-orange-100 text-orange-800' },
  { value: 'finance', label: 'Finance', color: 'bg-yellow-100 text-yellow-800' },
];

export default function Goals() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    target_date: '',
    progress: 0
  });

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list('-created_date'),
    initialData: [],
  });

  const createGoalMutation = useMutation({
    mutationFn: (goalData) => base44.entities.Goal.create(goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, goalData }) => base44.entities.Goal.update(id, goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id) => base44.entities.Goal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      target_date: '',
      progress: 0
    });
    setEditingGoal(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    const goalData = {
      ...formData,
      status: 'active',
      progress: parseInt(formData.progress) || 0
    };

    if (editingGoal) {
      updateGoalMutation.mutate({ id: editingGoal.id, goalData });
    } else {
      createGoalMutation.mutate(goalData);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category || 'personal',
      target_date: goal.target_date || '',
      progress: goal.progress || 0
    });
    setShowDialog(true);
  };

  const handleDelete = (goal) => {
    if (confirm(`Delete "${goal.title}"?`)) {
      deleteGoalMutation.mutate(goal.id);
    }
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const successRate = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#3C3835] mb-2">Goals & Progress</h1>
              <p className="text-[#8B7355]">Track your aspirations and achievements</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                <Sparkles className="w-4 h-4 mr-2" />
                Extract from Entries
              </Button>
              <Dialog open={showDialog} onOpenChange={(open) => {
                setShowDialog(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white shadow-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-gradient-to-br from-[#FBF9F6] to-[#F5F0E8] border-2 border-[#E8DDD0]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#3C3835] flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-xl flex items-center justify-center shadow-md">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      {editingGoal ? "Edit Goal" : "Create New Goal"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-[#3C3835] font-semibold text-sm">
                        Goal Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., Run a 5K, Learn Spanish"
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
                        placeholder="Describe your goal..."
                        className="border-2 border-[#E8DDD0] focus:border-[#8B7355] bg-white rounded-xl text-[#3C3835] placeholder:text-[#C4A57B]/50 min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#3C3835] font-semibold text-sm">Category</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {goalCategories.map((category) => (
                          <button
                            key={category.value}
                            onClick={() => setFormData({...formData, category: category.value})}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              formData.category === category.value
                                ? 'border-[#8B7355] bg-[#8B7355]/10'
                                : 'border-[#E8DDD0] hover:border-[#C4A57B]'
                            }`}
                          >
                            <span className={`text-sm font-medium ${category.color}`}>
                              {category.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target_date" className="text-[#3C3835] font-semibold text-sm">
                        Target Date
                      </Label>
                      <Input
                        id="target_date"
                        type="date"
                        value={formData.target_date}
                        onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                        className="border-2 border-[#E8DDD0] focus:border-[#8B7355] bg-white h-12 rounded-xl text-[#3C3835]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="progress" className="text-[#3C3835] font-semibold text-sm">
                        Initial Progress (%)
                      </Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({...formData, progress: e.target.value})}
                        className="border-2 border-[#E8DDD0] focus:border-[#8B7355] bg-white h-12 rounded-xl text-[#3C3835]"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
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
                        disabled={!formData.title.trim()}
                        className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#C4A57B] hover:from-[#6F5A44] hover:to-[#A88B63] text-white h-12 rounded-xl shadow-lg font-semibold disabled:opacity-50"
                      >
                        {editingGoal ? "Update Goal" : "Create Goal"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#E8DDD0]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#3C3835]">{activeGoals.length}</p>
                    <p className="text-[#8B7355] text-sm">Active Goals</p>
                  </div>
                  <Target className="w-8 h-8 text-[#8B7355]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#E8DDD0]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#3C3835]">{completedGoals.length}</p>
                    <p className="text-[#8B7355] text-sm">Completed</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-[#E8DDD0]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#3C3835]">{successRate}%</p>
                    <p className="text-[#8B7355] text-sm">Success Rate</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#8B7355]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Goals */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#3C3835] mb-6">Active Goals</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-48 animate-pulse bg-white" />
              ))}
            </div>
          ) : activeGoals.length === 0 ? (
            <Card className="p-12 text-center border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
              <Target className="w-16 h-16 mx-auto mb-4 text-[#8B7355]" />
              <h3 className="text-xl font-semibold text-[#3C3835] mb-2">No active goals yet</h3>
              <p className="text-[#8B7355] mb-6">Create your first goal to start tracking your progress</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {activeGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 cursor-pointer relative overflow-hidden bg-white">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8B7355] to-[#C4A57B]" />
                      <CardHeader className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl text-[#3C3835] mb-2">{goal.title}</CardTitle>
                            <Badge className={`${goalCategories.find(c => c.value === goal.category)?.color || 'bg-gray-100 text-gray-800'} mb-3`}>
                              {goalCategories.find(c => c.value === goal.category)?.label || goal.category}
                            </Badge>
                            <p className="text-sm text-[#8B7355] line-clamp-2">
                              {goal.description}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(goal)}
                              className="h-8 w-8 p-0 hover:bg-[#F5F0E8]"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(goal)}
                              className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#8B7355]">Progress</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newProgress = Math.max(0, goal.progress - 10);
                                  updateGoalMutation.mutate({ 
                                    id: goal.id, 
                                    goalData: { ...goal, progress: newProgress, status: newProgress >= 100 ? 'completed' : 'active' }
                                  });
                                }}
                                className="h-6 w-6 p-0 hover:bg-[#F5F0E8]"
                              >
                                -
                              </Button>
                              <span className="text-sm font-semibold text-[#3C3835] min-w-[3rem] text-center">{goal.progress}%</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newProgress = Math.min(100, goal.progress + 10);
                                  updateGoalMutation.mutate({ 
                                    id: goal.id, 
                                    goalData: { ...goal, progress: newProgress, status: newProgress >= 100 ? 'completed' : 'active' }
                                  });
                                }}
                                className="h-6 w-6 p-0 hover:bg-[#F5F0E8]"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="w-full bg-[#E8DDD0] rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#8B7355] to-[#C4A57B] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          {goal.target_date && (
                            <p className="text-xs text-[#8B7355]">
                              Target: {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
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
    </div>
  );
}
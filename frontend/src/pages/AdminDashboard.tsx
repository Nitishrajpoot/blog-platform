import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, MOCK_BLOGS } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Users, 
  FileText, 
  Trash2, 
  Search,
  User,
  Calendar,
  Shield,
  TrendingUp,
  Eye,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from '@/lib/utils';

// Colorful tag styles
const getTagStyle = (tag: string) => {
  const tagLower = tag.toLowerCase();
  if (tagLower.includes('react') || tagLower.includes('javascript')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (tagLower.includes('typescript')) return 'bg-sky-100 text-sky-700 border-sky-200';
  if (tagLower.includes('node')) return 'bg-green-100 text-green-700 border-green-200';
  if (tagLower.includes('css') || tagLower.includes('design')) return 'bg-pink-100 text-pink-700 border-pink-200';
  if (tagLower.includes('mongo')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (tagLower.includes('security') || tagLower.includes('auth')) return 'bg-red-100 text-red-700 border-red-200';
  if (tagLower.includes('api') || tagLower.includes('backend')) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (tagLower.includes('frontend') || tagLower.includes('web')) return 'bg-purple-100 text-purple-700 border-purple-200';
  return 'bg-violet-100 text-violet-700 border-violet-200';
};

// Mock users data
const MOCK_USERS = [
  {
    _id: '1',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@blog.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: '2',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    _id: '3',
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: '2024-02-01T00:00:00Z',
  },
];

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'user' | 'blog'>('blog');
  const [, setItemToDelete] = useState<string | null>(null);

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogs = MOCK_BLOGS.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: string, type: 'user' | 'blog') => {
    setItemToDelete(id);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const stats = {
    totalUsers: MOCK_USERS.length,
    totalBlogs: MOCK_BLOGS.length,
    adminUsers: MOCK_USERS.filter(u => u.role === 'admin').length,
    totalViews: '5.2K',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-10 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-slate-500">
                Manage users and content across the platform
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold gradient-text">{stats.totalUsers}</p>
                  <p className="text-sm text-slate-500">Total Users</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalBlogs}</p>
                  <p className="text-sm text-slate-500">Total Blogs</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-emerald-600">{stats.totalViews}</p>
                  <p className="text-sm text-slate-500">Total Views</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500/10 to-pink-500/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-500 to-pink-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-600">{stats.adminUsers}</p>
                  <p className="text-sm text-slate-500">Admins</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid bg-white/80 backdrop-blur-sm p-1 rounded-xl">
              <TabsTrigger value="users" className="gap-2 rounded-lg data-[state=active]:gradient-button data-[state=active]:text-white">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="blogs" className="gap-2 rounded-lg data-[state=active]:gradient-button data-[state=active]:text-white">
                <FileText className="h-4 w-4" />
                Blogs
              </TabsTrigger>
            </TabsList>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
              <Input
                placeholder={`Search ${activeTab === 'users' ? 'users' : 'blogs'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-violet-100 focus:border-violet-300 focus:ring-violet-200 rounded-xl bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="grid gap-4">
                {filteredUsers.map((u, index) => (
                  <Card key={u._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${
                      index % 3 === 0 ? 'from-violet-500 to-fuchsia-500' :
                      index % 3 === 1 ? 'from-blue-500 to-cyan-500' :
                      'from-emerald-500 to-teal-500'
                    }`} />
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-violet-100">
                          <AvatarFallback className={`text-white font-semibold ${
                            index % 3 === 0 ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500' :
                            index % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                            'bg-gradient-to-br from-emerald-500 to-teal-500'
                          }`}>
                            {u.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800">{u.name}</h3>
                            {u.role === 'admin' && (
                              <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">@{u.username}</p>
                          <p className="text-sm text-slate-500">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {format(new Date(u.createdAt), 'MMM d, yyyy')}
                          </span>
                          {u._id !== user?._id && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(u._id, 'user')}
                              className="rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Blogs Tab */}
            <TabsContent value="blogs" className="space-y-4">
              <div className="grid gap-4">
                {filteredBlogs.map((blog, index) => (
                  <Card key={blog._id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${
                      index % 4 === 0 ? 'from-violet-500 to-fuchsia-500' :
                      index % 4 === 1 ? 'from-blue-500 to-cyan-500' :
                      index % 4 === 2 ? 'from-emerald-500 to-teal-500' :
                      'from-orange-500 to-pink-500'
                    }`} />
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-violet-100">
                          <AvatarFallback className={`text-white font-semibold ${
                            index % 3 === 0 ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500' :
                            index % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                            'bg-gradient-to-br from-emerald-500 to-teal-500'
                          }`}>
                            {blog.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-1">
                            {blog.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className={`text-xs ${getTagStyle(tag)}`}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="font-semibold text-slate-800 mb-1">{blog.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                            {blog.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {blog.author.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/blogs/${blog._id}`}>
                            <Button variant="outline" size="sm" className="rounded-full border-violet-200 hover:bg-violet-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(blog._id, 'blog')}
                            className="rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Delete {deleteType === 'user' ? 'User' : 'Blog Post'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
              {deleteType === 'user' && ' All associated blog posts will also be deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 rounded-full"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

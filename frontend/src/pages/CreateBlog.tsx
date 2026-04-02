import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBlogs } from '@/hooks/useBlogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  ArrowLeft, 
  Plus, 
  X, 
  Eye, 
  Save,
  Type,
  AlignLeft,
  Sparkles,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Tag color options
const TAG_COLORS = [
  { name: 'React', class: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'TypeScript', class: 'bg-sky-100 text-sky-700 border-sky-200' },
  { name: 'Node.js', class: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'CSS', class: 'bg-pink-100 text-pink-700 border-pink-200' },
  { name: 'MongoDB', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { name: 'Security', class: 'bg-red-100 text-red-700 border-red-200' },
  { name: 'API', class: 'bg-orange-100 text-orange-700 border-orange-200' },
  { name: 'Frontend', class: 'bg-purple-100 text-purple-700 border-purple-200' },
];

const getTagStyle = (tag: string) => {
  const found = TAG_COLORS.find(t => t.name.toLowerCase() === tag.toLowerCase());
  return found?.class || 'bg-violet-100 text-violet-700 border-violet-200';
};

export function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const { user } = useAuth();
  const { createBlog, isLoading } = useBlogs();
  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    try {
      const newBlog = await createBlog(
        { title: title.trim(), content: content.trim(), tags },
        user?._id || ''
      );
      navigate(`/blogs/${newBlog._id}`);
    } catch (err) {
      setError('Failed to create blog. Please try again.');
    }
  };

  const readingTime = Math.ceil(content.split(' ').length / 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-violet-100">
                <ArrowLeft className="h-6 w-6 text-violet-600" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <h1 className="text-2xl font-bold gradient-text">Create New Blog</h1>
              </div>
              <p className="text-sm text-slate-500">
                Share your colorful thoughts with the world
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2 rounded-full border-violet-200 hover:bg-violet-50"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              size="sm"
              className="gap-2 gradient-button border-0 text-white rounded-full shadow-lg shadow-violet-500/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!showPreview ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                <div className="h-1 gradient-button" />
                <CardContent className="p-6 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2 text-slate-700">
                      <Type className="h-4 w-4 text-violet-500" />
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter an engaging title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg font-semibold border-violet-100 focus:border-violet-300 focus:ring-violet-200 rounded-xl h-12"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="flex items-center gap-2 text-slate-700">
                      <Palette className="h-4 w-4 text-violet-500" />
                      Tags
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Add tags (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 border-violet-100 focus:border-violet-300 focus:ring-violet-200 rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        className="rounded-xl border-violet-200 hover:bg-violet-50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Quick Tag Suggestions */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-slate-400">Quick add:</span>
                      {TAG_COLORS.slice(0, 5).map((tag) => (
                        <button
                          key={tag.name}
                          onClick={() => {
                            if (!tags.includes(tag.name)) {
                              setTags([...tags, tag.name]);
                            }
                          }}
                          className={`text-xs px-2 py-1 rounded-full border ${tag.class} hover:opacity-80 transition-opacity`}
                        >
                          + {tag.name}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {tags.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-wrap gap-2 mt-3"
                        >
                          {tags.map((tag) => (
                            <motion.div
                              key={tag}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Badge 
                                variant="outline"
                                className={`gap-1 pr-1 cursor-pointer ${getTagStyle(tag)}`}
                              >
                                {tag}
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 hover:text-red-500 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="flex items-center gap-2 text-slate-700">
                      <AlignLeft className="h-4 w-4 text-violet-500" />
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Write your blog content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[400px] resize-none border-violet-100 focus:border-violet-300 focus:ring-violet-200 rounded-xl text-slate-700"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{content.split(' ').filter(w => w).length} words</span>
                      <span>~{readingTime} min read</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                <div className="h-2 gradient-button" />
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline" className={getTagStyle(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-3xl gradient-text">{title || 'Untitled Blog'}</CardTitle>
                  <CardDescription className="text-slate-500">
                    {readingTime} min read • {content.split(' ').filter(w => w).length} words
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6 bg-violet-100" />
                  <div className="prose prose-lg max-w-none">
                    {content ? (
                      content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">
                        No content yet. Switch back to edit mode to add content.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

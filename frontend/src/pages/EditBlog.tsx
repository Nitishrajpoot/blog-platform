import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { blog, isLoading, getBlogById, updateBlog } = useBlogs();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      getBlogById(id);
    }
  }, [id, getBlogById]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setTags(blog.tags || []);
    }
  }, [blog]);

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

    if (!id) return;

    setIsSaving(true);
    try {
      await updateBlog(id, {
        title: title.trim(),
        content: content.trim(),
        tags,
      });
      navigate(`/blogs/${id}`);
    } catch (err) {
      setError('Failed to update blog. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const readingTime = Math.ceil(content.split(' ').length / 200);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Blog not found</h2>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Check if user can edit this blog
  const canEdit = user?._id === blog.author._id || user?.role === 'admin';
  
  if (!canEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to edit this blog.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to={`/blogs/${id}`}>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Blog</h1>
              <p className="text-sm text-muted-foreground">
                Make changes to your blog post
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSaving}
              size="sm"
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
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
            <Alert variant="destructive">
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
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter an engaging title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg font-medium"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Add tags (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <AnimatePresence>
                      {tags.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-wrap gap-2 mt-2"
                        >
                          {tags.map((tag) => (
                            <motion.div
                              key={tag}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Badge 
                                variant="secondary"
                                className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
                              >
                                {tag}
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 hover:text-destructive"
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
                    <Label htmlFor="content" className="flex items-center gap-2">
                      <AlignLeft className="h-4 w-4" />
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Write your blog content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[400px] resize-none"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
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
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <CardTitle className="text-3xl">{title || 'Untitled Blog'}</CardTitle>
                  <CardDescription>
                    {readingTime} min read • {content.split(' ').filter(w => w).length} words
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <div className="prose prose-lg max-w-none">
                    {content ? (
                      content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground/90 leading-relaxed">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
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

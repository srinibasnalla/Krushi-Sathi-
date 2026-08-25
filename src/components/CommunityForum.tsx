import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Award,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Share2,
  Bookmark,
  Send,
  Leaf,
  Droplets,
  Tractor,
  Landmark,
  Layers,
  ChevronDown,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ForumPost, LanguageCode } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/mockData';
import { translations } from '../i18n/translations';
import { VoiceReaderButton } from './VoiceReaderButton';

interface CommunityForumProps {
  language: LanguageCode;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({ language }) => {
  const t = translations[language] || translations.en;

  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<{ [postId: string]: string }>({});

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('high_yield');
  const [newCropTag, setNewCropTag] = useState('General Agriculture');
  const [newAuthorName, setNewAuthorName] = useState('Gurmail Singh');
  const [newLocation, setNewLocation] = useState('Karnal, Haryana');

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.cropTag && p.cropTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.hasLiked;
          return {
            ...p,
            likes: hasLiked ? p.likes - 1 : p.likes + 1,
            hasLiked: !hasLiked,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = replyInput[postId];
    if (!text || !text.trim()) return;

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [
              ...p.comments,
              {
                id: `c_${Date.now()}`,
                authorName: 'Kisan Brother (You)',
                authorLocation: 'Punjab / Haryana',
                content: text.trim(),
                postedAt: 'Just now',
                likes: 1,
              },
            ],
          };
        }
        return p;
      })
    );

    setReplyInput({ ...replyInput, [postId]: '' });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostItem: ForumPost = {
      id: `forum_${Date.now()}`,
      authorName: newAuthorName || 'Progressive Farmer',
      authorLocation: newLocation || 'Regional Mandi Zone',
      authorBadge: 'Active Contributor',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      category: newCategory,
      title: newTitle,
      content: newContent,
      cropTag: newCropTag,
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      postedAt: 'Just now',
      isVerifiedTip: false,
      comments: [],
    };

    setPosts([newPostItem, ...posts]);
    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Topic Navigation Bento Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 font-heading">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>{t.communityForum}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Knowledge sharing, verified organic tips, machinery rental & regional farmer wisdom
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsNewPostModalOpen(true)}
            className="bg-stone-900 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{t.shareTipOrQuestion}</span>
          </button>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="mt-4 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farming tips, pest remedies, stubble management, government schemes..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: t.allCategories, icon: Layers },
              { id: 'high_yield', label: t.highYield, icon: Leaf },
              { id: 'pest_control', label: t.pestControl, icon: Sparkles },
              { id: 'water_drip', label: t.waterManagement, icon: Droplets },
              { id: 'machinery', label: t.machinery, icon: Tractor },
              { id: 'govt_schemes', label: t.govtSchemes, icon: Landmark },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200/90 hover:border-emerald-700/40 transition-all space-y-4"
            >
              {/* Author & Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-2xl object-cover border border-stone-200 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-stone-900 font-heading">{post.authorName}</span>
                      {post.authorBadge && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-700" />
                          {post.authorBadge}
                        </span>
                      )}
                      {post.isVerifiedTip && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                          <CheckCircle2 className="w-3 h-3 text-amber-700" />
                          {t.verifiedFarmerTip}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5 font-medium">
                      {post.authorLocation} • {post.postedAt}
                    </div>
                  </div>
                </div>

                {post.cropTag && (
                  <span className="text-xs bg-stone-100 text-stone-800 font-bold px-2.5 py-1 rounded-xl">
                    🌾 {post.cropTag}
                  </span>
                )}
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h4 className="text-base font-bold text-stone-900 leading-snug font-heading">{post.title}</h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Post Footbar & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      post.hasLiked
                        ? 'bg-emerald-100 text-emerald-900 shadow-2xs font-semibold'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.hasLiked ? 'text-emerald-700 fill-emerald-600' : ''}`} />
                    <span>{post.likes} Helpful</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCommentsPostId(
                        expandedCommentsPostId === post.id ? null : post.id
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <VoiceReaderButton
                    text={`${post.title}. Shared by ${post.authorName} from ${post.authorLocation}. ${post.content}`}
                    lang={language}
                    variant="pill"
                    label={t.readAloud}
                  />
                </div>
              </div>

              {/* Expanded Comments Thread */}
              {expandedCommentsPostId === post.id && (
                <div className="mt-3 pt-3 border-t border-stone-100 space-y-3 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
                  <div className="space-y-2.5">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-3 rounded-xl border border-stone-200 text-xs shadow-2xs">
                          <div className="flex items-center justify-between font-bold text-stone-900 mb-0.5">
                            <span>{comment.authorName} ({comment.authorLocation})</span>
                            <span className="text-[10px] text-stone-400 font-normal">{comment.postedAt}</span>
                          </div>
                          <p className="text-stone-700 leading-relaxed">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-xs text-stone-400">
                        No comments yet. Be the first farmer to reply!
                      </div>
                    )}
                  </div>

                  {/* Add reply */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={replyInput[post.id] || ''}
                      onChange={(e) =>
                        setReplyInput({ ...replyInput, [post.id]: e.target.value })
                      }
                      placeholder="Write your advice or answer..."
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Send className="w-3 h-3 text-amber-400" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-400">
            No discussion posts found in this category. Click above to share a farming tip!
          </div>
        )}
      </div>

      {/* Modal: Share New Farming Tip or Question */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 font-heading">{t.shareTipOrQuestion}</h3>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Village / District</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Topic Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="high_yield">{t.highYield}</option>
                    <option value="pest_control">{t.pestControl}</option>
                    <option value="water_drip">{t.waterManagement}</option>
                    <option value="machinery">{t.machinery}</option>
                    <option value="govt_schemes">{t.govtSchemes}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Crop Tag</label>
                  <input
                    type="text"
                    value={newCropTag}
                    onChange={(e) => setNewCropTag(e.target.value)}
                    placeholder="e.g. Wheat, Cotton, Mustard"
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Title / Key Technique</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. How I saved 30% canal water with AWD technique..."
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 font-heading">Detailed Experience / Advice</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Explain step-by-step what worked for you, fertilizer dose, sowing date, or the problem you are facing..."
                  className="w-full border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-emerald-900 shadow-xs cursor-pointer transition-colors"
                >
                  Post to Farmer Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

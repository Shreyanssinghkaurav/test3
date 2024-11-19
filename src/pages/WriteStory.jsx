import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Save, Send, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function WriteStory() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showDrafts, setShowDrafts] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await fetch('http://localhost:5001/stories/drafts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setError('Failed to load drafts. Please try again.');
    }
  };

  const loadDraft = (draft) => {
    setTitle(draft.title);
    setContent(draft.content);
    setImage(draft.image || '');
    setSelectedDraft(draft);
    setShowDrafts(false);
    setError('');
  };

  const handleSaveDraft = async () => {
    if (!title && !content) {
      setError('Please add a title or content before saving');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/stories/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          content,
          image,
          draftId: selectedDraft?._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      await fetchDrafts();
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      setError('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5001/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          content,
          image: image || 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create story');
      }

      // If publishing from a draft, delete the draft
      if (selectedDraft) {
        await fetch(`http://localhost:5001/stories/${selectedDraft._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      navigate('/stories');
    } catch (error) {
      console.error('Error publishing story:', error);
      setError(error.message || 'Failed to publish story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <PenTool className="h-6 w-6 text-amber-900" />
          <h1 className="text-3xl font-bold text-amber-900">Write Your Story</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowDrafts(!showDrafts)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            <FileText className="h-5 w-5" />
            <span>My Drafts ({drafts.length})</span>
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className={`flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-md hover:bg-amber-200 transition ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="h-5 w-5" />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>
        </div>
      </div>

      {showDrafts && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Drafts</h2>
          {drafts.length === 0 ? (
            <p className="text-gray-600">No drafts found</p>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div
                  key={draft._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => loadDraft(draft)}
                >
                  <div>
                    <h3 className="font-medium">{draft.title || 'Untitled'}</h3>
                    <p className="text-sm text-gray-600">
                      Last saved: {new Date(draft.lastSaved).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      loadDraft(draft);
                    }}
                    className="text-amber-900 hover:text-amber-700"
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handlePublish} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200"
              placeholder="Enter your story title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200"
              placeholder="Enter image URL (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200"
              placeholder="Start writing your story..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-6 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="h-5 w-5" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Story'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WriteStory;
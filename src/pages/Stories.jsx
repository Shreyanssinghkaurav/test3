import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Stories() {
  // ... existing state and functions remain the same ...

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif text-amber-900 mb-8 text-center ornate-border">
        Featured Stories
      </h1>
      
      <div className="space-y-8">
        {stories.map(story => (
          <article key={story._id} className="story-card animate-fade-in">
            <div className="md:flex">
              {story.image && (
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48 rounded-lg shadow-md"
                    src={story.image}
                    alt={story.title}
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="uppercase tracking-wider text-sm text-amber-700 font-serif">
                      By {story.author.username}
                    </div>
                    <h2 className="block mt-1 text-2xl font-serif text-gray-900 hover:text-amber-900 transition-colors">
                      {story.title}
                    </h2>
                  </div>
                  {user?._id === story.author._id && (
                    <button
                      onClick={() => handleDelete(story._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {story.content}
                </p>
                <div className="mt-6 flex items-center space-x-6 text-gray-500">
                  <button 
                    onClick={() => handleLike(story._id)}
                    className={`like-seal group flex items-center space-x-2 transition-all ${
                      story.likes.some(like => like.user._id === user?._id)
                        ? 'text-red-500'
                        : 'hover:text-amber-700'
                    }`}
                  >
                    <Heart className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                    <span>{story.likes.length}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(story._id)}
                    className="flex items-center space-x-2 hover:text-amber-700 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{story.comments?.length || 0}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-amber-700 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>

                {activeComments[story._id] && (
                  <div className="mt-6 space-y-4">
                    <div className="border-t border-amber-200 pt-4">
                      <h3 className="font-serif text-lg text-amber-900 mb-4">Comments</h3>
                      <div className="space-y-4">
                        {story.comments?.map((comment) => (
                          <div key={comment._id} className="flex justify-between items-start bg-amber-50/50 p-4 rounded-md border border-amber-100">
                            <div>
                              <p className="text-sm font-medium text-amber-900">
                                {comment.user.username}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                              <p className="text-xs text-amber-700/60 mt-1">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {user?._id === comment.user._id && (
                              <button
                                onClick={() => handleDeleteComment(story._id, comment._id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <input
                          type="text"
                          value={newComments[story._id]}
                          onChange={(e) => handleCommentChange(story._id, e.target.value)}
                          placeholder="Write a comment..."
                          className="vintage-input flex-1"
                        />
                        <button
                          onClick={() => handleAddComment(story._id)}
                          disabled={!newComments[story._id]?.trim()}
                          className="vintage-button disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Stories;
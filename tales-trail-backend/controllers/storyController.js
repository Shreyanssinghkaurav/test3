const Story = require('../models/Story');

const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ isDraft: false })
      .populate('author', 'username')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDrafts = async (req, res) => {
  try {
    const drafts = await Story.find({ 
      author: req.user._id,
      isDraft: true 
    })
    .populate('author', 'username')
    .sort({ lastSaved: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStory = async (req, res) => {
  const { title, content, image } = req.body;
  try {
    const story = await Story.create({
      title,
      content,
      image,
      author: req.user._id,
      isDraft: false
    });
    
    const populatedStory = await Story.findById(story._id)
      .populate('author', 'username');
    
    res.status(201).json(populatedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const saveDraft = async (req, res) => {
  const { title, content, image, draftId } = req.body;
  try {
    let draft;
    if (draftId) {
      // Update existing draft
      draft = await Story.findOneAndUpdate(
        { 
          _id: draftId, 
          author: req.user._id // Ensure the draft belongs to the user
        },
        { 
          title, 
          content, 
          image, 
          lastSaved: Date.now(),
          isDraft: true // Ensure it stays as a draft
        },
        { 
          new: true,
          runValidators: true
        }
      ).populate('author', 'username');

      if (!draft) {
        return res.status(404).json({ message: 'Draft not found or unauthorized' });
      }
    } else {
      // Create new draft
      draft = await Story.create({
        title,
        content,
        image,
        author: req.user._id,
        isDraft: true
      });
      
      draft = await Story.findById(draft._id)
        .populate('author', 'username');
    }
    
    res.status(201).json(draft);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateStory = async (req, res) => {
  const { id } = req.params;
  try {
    const story = await Story.findOne({
      _id: id,
      author: req.user._id
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found or unauthorized' });
    }
    
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { 
        ...req.body,
        lastSaved: Date.now(),
        author: req.user._id // Ensure author remains the same
      },
      { 
        new: true,
        runValidators: true
      }
    ).populate('author', 'username');
    
    res.json(updatedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStory = async (req, res) => {
  const { id } = req.params;
  try {
    const story = await Story.findOne({
      _id: id,
      author: req.user._id
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found or unauthorized' });
    }
    
    await story.deleteOne();
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    story.comments.push({
      user: req.user._id,
      text
    });

    await story.save();

    const updatedStory = await Story.findById(id)
      .populate('author', 'username')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username');

    res.json(updatedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  try {
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const comment = story.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await story.save();

    const updatedStory = await Story.findById(id)
      .populate('author', 'username')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username');

    res.json(updatedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const likeStory = async (req, res) => {
  const { id } = req.params;
  try {
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const alreadyLiked = story.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      story.likes = story.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      story.likes.push({ user: req.user._id });
    }

    await story.save();
    const updatedStory = await Story.findById(id)
      .populate('author', 'username')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username');
    
    res.json(updatedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { 
  getStories, 
  createStory, 
  updateStory, 
  deleteStory, 
  likeStory,
  getDrafts,
  saveDraft,
  addComment,
  deleteComment
};
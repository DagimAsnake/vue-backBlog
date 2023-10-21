const Blog = require("../model/blog")

module.exports.getBlog = async function (req, res) {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })

    return res.status(200).json({
      blogs: blogs
    });
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    return res.status(500).json({
      error: 'Server error',
    });
  }
};

module.exports.addBlog = async function (req, res) {

    const data = req.body;
    if (!(data.title && data.topic && data.content)) {
        return res.json({
            msg: "Inputs are required",
        });
    }

    const inputData = {
        title: data.title,
        topic: data.topic,
        content: data.content,
    }

    const newBlog = new Blog(inputData);

    await newBlog.save();
    return res.json({
        msg: "Blog sent successfully"
    }).status(200)
}

module.exports.getOneBlog = async function (req, res) {
    const { blogId } = req.params;
    const one_blog = await Blog.findById(blogId);
    if (!one_blog) {
      return res
        .json({
          msg: "Id dont exist",
        })
        .status(403);
    }
    return res
      .json({
        msg: one_blog,  
      })
      .status(200);
  };

  module.exports.deleteBlog = async function(req, res) {
    const { blogId } = req.params;
  
    try {
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ msg: 'Blog not found' });
      }

      await Blog.findByIdAndDelete(blogId);
      return res.status(200).json({ msg: 'Blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };

  module.exports.updateBlog = async function (req, res) {
  
    const { blogId } = req.params;
    const data = req.body;

    const updatedData = {
      title: data.title,
      topic: data.topic,
      content: data.content,
    };
  
    try {
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ msg: 'Blog not found' });
      }
  
      await Blog.findByIdAndUpdate(blogId, updatedData);
      return res.status(200).json({ msg: 'Blog updated successfully' });
    } catch (error) {
      console.error('Error updating blog:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
const blogRouter = require("express").Router()
const Blog = require("../models/blog")

const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post("/", async (request, response) => {
  const body = request.body
  
  //const token = getTokenFrom(request)
  //const decodedToken = jwt.verify(token, process.env.SECRET)
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  //console.log("blog user", blog.user.toString())
  //console.log("user user", user.id.toString())

  if (blog.user.toString() === user.id.toString()){
    await blog.remove()
  } else {
    return response.status(401).json({ error: 'wrong user token' })
  }
    
  //await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put("/:id", async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogRouter

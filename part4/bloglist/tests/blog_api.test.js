const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const testList = require("./testList")

const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = testList.blogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}, 10000)

test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
})

test('there are the right number of blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(testList.blogs.length)
})

test('blog _id name is named as "id"', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0]).toHaveProperty('id')
})

test('a valid blog can be added', async() => {
  const newBlog = {
          title: "Test Title",
          author: "Larry Page",
          url: "https://www.google.com/",
          likes: 1,
      }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await Blog.find({})
  const blogs = response.map(blog => blog.toJSON())

  expect(blogs).toHaveLength(testList.blogs.length + 1)
  expect(blogs[blogs.length -1]).toHaveProperty('author', 'Larry Page')

})

test('check that missing likes defaults to 0', async() => {
  const newBlog = {
          title: "No Likes Here",
          author: "Elon Musk",
          url: "https://www.spaceX.com/",
      }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await Blog.find({})
  const blogs = response.map(blog => blog.toJSON())

  expect(blogs).toHaveLength(testList.blogs.length + 1)
  expect(blogs[blogs.length -1]).toHaveProperty('likes', 0)
})

test('check missing fields causes 400', async() => {
  const newBlog = {
          author: "Anon",
          url: "https://www.wikipedia.com/",
      }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await Blog.find({})
  const blogs = response.map(blog => blog.toJSON())

  expect(blogs).toHaveLength(testList.blogs.length)
})

describe('deletion of a blog', () => {
  test('succeeds with a 204 code if id is valid', async () => {
    const blog = testList.blogs[0]
    console.log(blog._id)

    await api
      .delete(`/api/blogs/${blog._id}`)
      .expect(204)

      const response = await Blog.find({})
      const blogs = response.map(blog => blog.toJSON())

      expect(blogs).toHaveLength(testList.blogs.length-1)
  })
})

describe('update of a blog entry', () => {
  test('succeeds with a 204 code if id is valid', async () => {
    const id = testList.blogs[0]._id
    console.log(id)
    const newBlog = {
            title: "Switcheroo",
            author: "Don",
            url: "https://www.google.com/",
        }

    await api
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const response = await Blog.findById(id)
      //const blogs = response.map(blog => blog.toJSON())
      console.log(response);
      expect(response).toHaveProperty("title", "Switcheroo")
  })
})

afterAll(() => {
    mongoose.connection.close()
})

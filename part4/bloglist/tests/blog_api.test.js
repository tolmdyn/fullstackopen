const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const testList = require("./testList")

const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

const helper = require('./test_helper')

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

describe('testing user functions', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'Joe Bloggs', passwordHash })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Bart Simpson',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
  
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jimmy',
      name: 'Jim Jones',
      password: 'eureka',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username incorrect format', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'j',
      name: 'Jeff',
      password: 'lazyman',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(() => {
    mongoose.connection.close()
})

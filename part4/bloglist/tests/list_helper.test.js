const listHelper = require("../utils/list_helper")
const testList = require("./testList")

describe("total likes", () => {
    const listWithOneBlog = [{
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }]

    const listWithTwelveLikes = [{
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: null,
        title: null,
        author: null,
        url: null,
        likes: 4,
        __v: 0
    },
    {
        _id: null,
        title: null,
        author: null,
        url: null,
        likes: 3,
        __v: 0
    }
    ]
    test("empty list returns zero", () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test("when list has only one blog, equals the likes of that", () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test("list with 12 likes returns 12", () => {
        const result = listHelper.totalLikes(listWithTwelveLikes)
        expect(result).toBe(12)
    })

    test("full test list", () => {
        const result = listHelper.totalLikes(testList.blogs)
        expect(result).toBe(36)
    })
})

describe("most blogs", () => {
    test("test mostblogs", () => {
        const result = listHelper.mostBlogs(testList.blogs)
        expect(result).toMatchObject({
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe("most likes", () => {
    test("test mostlikes", () => {
        const result = listHelper.mostLikes(testList.blogs, "likes")
        expect(result).toMatchObject({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})

describe("most param", () => {
    test("test most likes", () => {
        const result = listHelper.mostParam(testList.blogs, "likes")
        expect(result).toMatchObject({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})

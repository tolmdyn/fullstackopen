const totalLikes = (blogs) => {
    return blogs.reduce(
        (prev, next) => prev + next.likes, 0
    )
}

const mostBlogs = (blogs) => {
    var dict = {}

    blogs.forEach(element => {
        dict[element.author] ? dict[element.author]++ : dict[element.author] = 1
    })

    const top = Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b)

    const top_author = {author:top, blogs:dict[top]}

    return top_author
}

const mostLikes = (blogs) => {
    var dict = {}

    blogs.forEach(element => {
        dict[element.author] ? dict[element.author] += element.likes : dict[element.author] = element.likes
    })

    const top = Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b)

    const top_author = {author:top, "likes":dict[top]}

    return top_author
}

const mostParam = (blogs, param) => {
    var dict = {}

    blogs.forEach(element => {
        dict[element.author] ? dict[element.author] += element[param] : dict[element.author] = element[param]
    })

    const top = Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b)

    const top_author = {}
    top_author["author"] = top
    top_author[param] = dict[top]

    return top_author
}

module.exports = {
    totalLikes,
    mostBlogs,
    mostLikes,
    mostParam
}

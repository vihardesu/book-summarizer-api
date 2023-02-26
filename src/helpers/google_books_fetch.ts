import { google } from 'googleapis'
import { cleanSummary } from './openai_fetch'

const client = google.books('v1')

// cleans the results from the google books api
// returns the first 5 results or less if there are less than 5 results
// gets everything we need from the results to POST TO OUR DATABASE
const cleanResults = (items) => {
    const processed_books = items.map((item) => {
        const { title = '', subtitle = '', authors = [], publisher = '', publishedDate = '', description = '', pageCount = '', categories = [], imageLinks, industryIdentifiers = [] } = item.volumeInfo
        const industryIdentifiersCleaned = industryIdentifiers.map((isbn) => {
            let cleanedType = ""
            if (isbn.type === "ISBN_13") {
                cleanedType = "isbn_thirteen"
            }

            else if (isbn.type === "ISBN_10") {
                cleanedType = "isbn_ten"
            }

            else {
                return {}
            }

            const isbnIdentifier = isbn.identifier
            return {
                [cleanedType]: isbnIdentifier
            }
        })
        const thumbnail = imageLinks.thumbnail ? imageLinks.thumbnail : ""
        const identifiers = industryIdentifiersCleaned.reduce(((r, c) => Object.assign(r, c)), {})
        const isbn_ten = identifiers.isbn_ten ? identifiers.isbn_ten : ""
        const isbn_thirteen = identifiers.isbn_thirteen ? identifiers.isbn_thirteen : ""
        return {
            title,
            subtitle,
            authors,
            publisher,
            publishedDate,
            description,
            pageCount,
            categories,
            thumbnail,
            isbn_ten,
            isbn_thirteen
        }
    })

    const returnCount = processed_books.length > 5 ? 5 : processed_books.length
    return processed_books.slice(0, returnCount)
}

export const fetchBookMetadata = async (query: string) => {
    const response = await client.volumes.list({
        auth: process.env.GOOGLE_BOOKS_API_KEY,
        q: query,
        printType: 'BOOKS'
    }).then((r) => r.data.items)
        .then((items) => cleanResults(items))
        .catch(e => new Error(e))
    return response
}

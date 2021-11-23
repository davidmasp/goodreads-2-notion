
// this captures env info from the .env file
require('dotenv').config()
// vars needed
// NOTION_TOKEN

// imports
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

// start the client
const { Client } = require("@notionhq/client");
const { runInThisContext } = require('vm');

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

function parseBookRow(row) {
  const bookObjRes = {}
  bookObjRes.id = row["Book Id"]
  bookObjRes.title = row["Title"]
  bookObjRes.author = row["Author"]
  bookObjRes.isbn = row["ISBN"]
  bookObjRes.publisher = row["Publisher"]
  bookObjRes.author2 = row["Author l-f"]
  bookObjRes.type = row["Exclusive Shelf"]
  bookObjRes.avgR = row["Average Rating"]
  bookObjRes.dateAdded = row["Date Added"]
  bookObjRes.dateRead = row["Date Read"]
  bookObjRes.publicationYear = row["Original Publication Year"]
  bookObjRes.numPages = row["Number of Pages"]
  bookObjRes.myRating = row["My Rating"]
  return bookObjRes
}

async function getCurrentBooks(dbid){
  (async () => {
    const databaseId = dbid;
    const response = await notion.databases.query({
      database_id: databaseId});
    console.log(response);
    title_list = [];
    response.results.forEach((page) => {
       //this closes the page fun
        title_list.push(page.properties.Name.title[0].text.content);
      })();
    // this closes main fun
    })();
    return title_list;
}

async function addPageToDb(dbid, bookObj) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const book_icons = ["📗", "📘", "📙", "📕", "📚", "📖"];
      const icon_chosen = book_icons[Math.floor(Math.random() * book_icons.length)];
      obj_to_create = {
        parent: {
          database_id: dbid,
        },
        icon: {
          type: "emoji",
          emoji: icon_chosen,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: bookObj.title,
                },
              },
            ],
          },
          Type: {
            select: {
              name: bookObj.type,
            },
          },
          Pages: {
            number: parseInt(bookObj.numPages, 10),
          },
          Author: {
            select: {
              name: bookObj.author,
            }
          },
          AvgR: {
            number: parseFloat(bookObj.avgR),
          },
          Year: {
            number: parseInt(bookObj.publicationYear, 10),
          },
        }
      }
      try {
        var response = await notion.pages.create(obj_to_create);
        resolve(response);
        //console.log(response);
      } catch (err) {
        console.log(err);
      }
    }, 500);
  });
}

const run = async () => {
  console.log('==> Reading csv ...');
  const existing_books = await getCurrentBooks(process.env.NOTION_DB_ID); 
  console.log(existing_books);
  const books_list = [];
  const readStream = fs.createReadStream(path.resolve(__dirname, 'data', 'goodreads_library_export.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error('stream error: ', error))
    .on('data', (row) => {
      const dat_book = parseBookRow(row);
      books_list.push(dat_book);
    })
    .on('end', async rowCount => {
      for (let i = 0; i < books_list.length; i++) {
        if (!existing_books.includes(books_list[i].title)) {
          console.log(`==> Adding ${books_list[i].title} to Notion...`);
          await addPageToDb(process.env.NOTION_DB_ID, books_list[i]);
        }
      }
      console.log('==> End of script')
    })
}

//run();
getCurrentBooks();

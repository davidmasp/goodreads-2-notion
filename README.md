# goodreads-2-notion

Api integration to move your exported goodreads library to notion

## Usage

Goodreads api is not open now apparently (see [here](https://help.goodreads.com/s/article/Does-Goodreads-support-the-use-of-APIs)).

The way to obtan your lists is to go to to > `My Books` and then
go to `Import/Export`, then press into `Export Library`.

After that place your `csv` file in a folder named `data` in the root
directory of this repo.

To install dependencies of the script you need to run `npm install`(?).

You should create an `.env` file with 2 variables, `NOTION_TOKEN` should
hold the notion api token and `DB_ID` the id of the dtabase you wanna use
to upload the entries to.

Note that the databse should be already created and the columns should
be with the same name and the same type than the expected by the script.
Also note that you would need to share your database with the runne or
application which is linked to the API token.

Then just run `node index.js`. Currently it takes 1 sec/book to not
overwhelm the API but this might change in the future.

## Dev

To use node in powershell run this first-> `$env:Path += ";C:\Program Files\nodejs\"`
. From [here](https://stackoverflow.com/questions/19569990).

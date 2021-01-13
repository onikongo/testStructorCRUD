import BookService from '../services/BookService';
import Util from '../utils/Utils';


var fs = require('fs');
var csvparse = require("csv-parse");
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:postgres@localhost:5432/postgres');

const util = new Util();

class BookController {
  static async getAllBooks(req, res) {
    let page = parseInt(req.query.start);
    let limit = req.query.length;
    try {
      const total = await BookService.getTotal();
      const allBooks = await BookService.getAllBooks(page,limit);
      console.log(allBooks);
      if (allBooks.length > 0) {
        util.setSuccess(200, 'Books retrieved', allBooks, total);
      } else {
        util.setSuccess(200, 'No book found');
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addBook(req, res) {
    if (!req.body.title || !req.body.price || !req.body.description) {
      util.setError(400, 'Please provide complete details');
      return util.send(res);
    }
    const newBook = req.body;
    try {
      const createdBook = await BookService.addBook(newBook);
      util.setSuccess(201, 'Book Added!', createdBook);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updatedBook(req, res) {
    const alteredBook = req.body;
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(res);
    }
    try {
      const updateBook = await BookService.updateBook(id, alteredBook);
      if (!updateBook) {
        util.setError(404, `Cannot find book with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Book updated', updateBook);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async getABook(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(res);
    }

    try {
      const theBook = await BookService.getABook(id);

      if (!theBook) {
        util.setError(404, `Cannot find book with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Book', theBook);
      }
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteBook(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(res);
    }

    try {
      const bookToDelete = await BookService.deleteBook(id);

      if (bookToDelete) {
        util.setSuccess(200, 'Book deleted');
      } else {
        util.setError(404, `Book with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async importBook(req, res) {
    
    var file = req.file;
    var csvfile = __dirname + '../../../../'+file.path;
    
    try {
      var sqlStatementInsert = 'INSERT INTO public."Books" (id, title, price, description, "createdAt", "updatedAt") VALUES($1,$2,$3,$4,$5,current_timestamp) ON CONFLICT (id) DO UPDATE SET id=EXCLUDED.id, title = EXCLUDED.title, price = EXCLUDED.price, description = EXCLUDED.description, "updatedAt" = current_timestamp ';
      const importBook = fs.createReadStream(csvfile).pipe(csvparse({ from_line: 2 })).on('data', function(data) {
        db.none(sqlStatementInsert, [ data[0],data[1], data[2], data[3], data[4]]);
      });
      if (importBook) {
        util.setSuccess(200, 'import && updated Success!!!');
      } else {
        util.setError(404, `import && updated Fail!!!`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
      
  }
}

export default BookController;

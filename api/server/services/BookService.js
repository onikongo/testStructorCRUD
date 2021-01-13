import database from '../src/models';
import { Sequelize } from 'sequelize';

class BookService {
  static async getTotal() {
    try {
      return await database.Book.findAll({
        attributes:[[Sequelize.fn('count',Sequelize.col('id')),'total']],
      }); 
    } catch (error) {
      throw error;
    }
  }

  static async getAllBooks(page,limit) {
    console.log(page);
    console.log(limit);
    try {
      return await database.Book.findAll({
        attributes: { include: [[Sequelize.fn('count',Sequelize.col('id')),'total']] },
        limit:limit,
        offset:page
      }); 
    } catch (error) {
      throw error;
    }
  }

  static async addBook(newBook) {
    try {
      return await database.Book.create(newBook);
    } catch (error) {
      throw error;
    }
  }

  static async updateBook(id, updateBook) {
    try {
      const bookToUpdate = await database.Book.findOne({
        where: { id: Number(id) }
      });

      if (bookToUpdate) {
        await database.Book.update(updateBook, { where: { id: Number(id) } });

        return updateBook;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getABook(id) {
    try {
      const theBook = await database.Book.findOne({
        where: { id: Number(id) }
      });

      return theBook;
    } catch (error) {
      throw error;
    }
  }

  static async deleteBook(id) {
    try {
      const bookToDelete = await database.Book.findOne({ where: { id: Number(id) } });

      if (bookToDelete) {
        const deletedBook = await database.Book.destroy({
          where: { id: Number(id) }
        });
        return deletedBook;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default BookService;

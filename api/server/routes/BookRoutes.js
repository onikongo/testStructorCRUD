import { Router } from 'express';
import BookController from '../controllers/BookController';
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });



const router = Router();
router.get('/', BookController.getAllBooks);
router.post('/', BookController.addBook);
router.get('/:id', BookController.getABook);
router.put('/:id', BookController.updatedBook);
router.delete('/:id', BookController.deleteBook);
router.post('/importBook',upload.single('importFile'), BookController.importBook);

export default router;

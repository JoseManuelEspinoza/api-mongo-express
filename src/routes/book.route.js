const express = require("express");
const Book = require('../model/book.model');

const router = express.Router();

// MIDDLEWARE
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid id" });
    }
    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.book = book;
    next();
}

// Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books);
        if (books.length === 0) {
            return res.status(204).json([]);
        }
        res.json(books);
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo libro
router.post('/', async (req, res) => {
    const { title, author, price, edition } = req.body;
    if (!title || !author || !price || !edition) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const book = new Book({ title, author, price, edition });
    try {
        const newBook = await book.save();
        res.status(201).json({ message: "Se creo exitosamente el libro", newBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//Hacer un unico get
router.get('/:id',getBook,async(req,res)=>{
    res.json(res.book);    
});
//Actualizar un libro
router.put('/:id',getBook,async(req,res)=>{
        try{
            const book=res.book;
            book.title=req.body.title||book.title;
            book.author=req.body.author||book.author;
            book.price=req.body.price||book.price;
            book.edition=req.body.edition||book.edition;
            const updateBook=await book.save();
            res.json(updateBook);
        }catch(err){
            res.status(400).json({message:err.message})
        }

})
//Patch
router.patch(
    '/:id',getBook,async(req,res)=>{
        if(!req.body.title && !req.body.author&& !req.body.genre&& !req.body.publication_data ){
            return res.status(400).json({message:'Al meno se debe de enviar alguno de los parametros'})
        }
        try{
            const book=res.book;
            book.title=req.body.title||book.title;
            book.author=req.body.author||book.author;
            book.price=req.body.price || book.price;
            book.edition=req.body.edition||book.edition;
            const updatedBook=await book.save();
            res.json(updatedBook);
    
        }catch(error){
            res.status(400).json({message:error.message})
        }
    }
    
)
//Eliminar
router.delete('/:id',getBook,async(req,res)=>{
    try{
        await res.book.deleteOne(
            {_id:res.book._id}       
        );
        res.json({message:'Se elimino el libro'})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

module.exports = router;

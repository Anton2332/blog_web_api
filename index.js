import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { AuthValidation, Postvalidation } from './validations/index.js';

import {checkAuth, handleValidationErrors} from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

mongoose.set("strictQuery", false);

mongoose
    .connect('mongodb://localhost:27017/blogdb?w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.error('DB error', err));

app.post('/auth/login', AuthValidation.loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register',AuthValidation.registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload',checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, Postvalidation.createValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(5000, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log('Server OK');
})
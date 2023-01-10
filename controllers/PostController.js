import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Failed to retrieve article',
        });
    }
};

export const getLastTags = async(req, res) => {
    try{
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 5);
        
        res.json(tags);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to get tags'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if(err) {
                    console.error(err);
                    return res.status(500).json({
                        message: 'Failed to retrieve article'
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Article not found'
                    })
                }
                
                res.json(doc);
            }
        ).populate('user');
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Failed to retrieve article',
        });
    }
};

export const create = async (req, res) => {
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags?.split(','),
            user: req.userId,
        });

        const post = await doc.save();
        
        res.json(post);
    }catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add post'
        })
    }
};

export const remove = async (req, res) => {
    try{
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: 'Failed to delete post',
                });
            }

            if(!doc) {
                return res.status(404).json({
                    message: 'Post not found',
                });
            }

            res.json({
                success: true,
            });
        });
    } catch (err) {
        console.err(err);
        res.status(500).json({
            message: 'Failed to delete post'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.body.userId,
                tags: req.body.tags?.splite(','),
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to update post',
        });
    }
}
var loginModel = require('../model/admin-login');
var recipeModel = require('../model/recipe');
var userInsertModel = require('../model/userRecipe');
var path = require('path');
var { check, validationResult } = require('express-validator');
var login_status = 0;


/**
 * GET/admin
 *admin login
 */

exports.adminLogin = async (req, res) => {
    try {
        if (login_status == 1) {

            var msg = "Check Your Email And password"

            // res.redirect('/admin')
        } else {
            var msg = "";
        }
        res.render('admin/admin-login', { showHeader: false, showFooter: false, msg, login_status })

    } catch (error) {
        console.log("eror:-" + error);
    }
}

/**
 * POST/admin
 *admin login
 */

exports.adminLoginVerify = async (req, res) => {
    try {
        var password = req.body.password;
        var email = req.body.email;
        var user = await loginModel.findOne({ email: email })

        if (password == user.password) {
            res.redirect('/admin-home');
        } else {
            login_status = 1;
            res.redirect("/admin")
        }

    } catch (error) {
        console.log("eror:-" + error);
    }
}

/**
 * GET/admin-home
 *show admin home page
 */

exports.adminHomeRender = async (req, res) => {

    var data = await recipeModel.find({}).sort({ _id: -1 })

    res.render('admin/admin-home', { showHeader: false, showFooter: false, data })
}



/**
 * GET/insert-recipe
 *show submit recipe page
 */

exports.submitRecipe = async (req, res) => {
    try {

        res.render('admin/submit-recipe', { showHeader: false, showFooter: false })

    } catch (error) {
        console.log("eror:-" + error);
    }
}


/**
 * POST/insert-recipe
 * submit recipe 
 */
exports.submitRecipeOnPost = async (req, res) => {
    try {



        let imageUploadFile;
        let uploadPath;
        let newImageName;

        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

        imageUploadFile.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err)
        })


        var newRecipe = new recipeModel({
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName,

        });
        await newRecipe.save();

        res.render('admin/submit-recipe', { showHeader: false, showFooter: false })

    } catch (error) {
        console.log("eror:-" + error);
    }
}






/**
 * GET/update-recipe
 *show update-recipe page
 */
exports.updateRecipeRender = async (req, res) => {
    try {
        var data = await recipeModel.findById(req.params.id);
        res.render('admin/update-recipe', { showHeader: false, showFooter: false, data })
    } catch (error) {
        console.log("Error:" + error);
    }
}



/**
 * POST/update-recipe
 * update a recipe 
 */

exports.updateRecipe = async (req, res) => {
    var id = req.params.id;
    //var name = req.body.description;


    await recipeModel.findByIdAndUpdate(id, req.body);

    res.redirect('/admin-home')

}


/**
 * POST/delete
 *delete a single recipe  
 */

exports.deleteData = async (req, res) => {

    await recipeModel.findByIdAndDelete(req.params.id)

    res.redirect('/admin-home')
}



/**
 * POST/user-recipe
 *show all users recipe  
 */

 exports.showUserRecipe = async (req, res) => {

    var data = await userInsertModel.find({});

    res.render('admin/user-recipe', { showHeader: false, showFooter: false , data })
}


// async function dummy() {
//     await loginModel.insertMany(
//         [
//             {
//                 "email": "admin@gmail.com",
//                 "password": "admin123"
//             }

//         ]);
// }

// dummy()





// express validator function that is called in routes

// exports.adminLoginVerify = async (req, res) => {
//     try {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             // return res.status(400).json({ errors: errors.array() });
//             var alert = errors.array()
//             res.render('admin/admin-login', { alert })
//         }

//         var password = req.body.password;
//         var email = req.body.email;
//         var user = await loginModel.findOne({ email: email })
//         var data = await recipeModel.find({}).sort({ _id: -1 })


//         if (password == user.password) {
//             res.redirect('/admin-home');
//         } else {
//             login_staus = 1;
//             res.redirect("/admin")
//         }

//     } catch (error) {
//         console.log("eror:-" + error);
//     }
// }

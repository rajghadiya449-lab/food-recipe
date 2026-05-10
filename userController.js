var userPanel = require('../model/user-login');
var login_status = 0;
var userInsertModel = require('../model/userRecipe');
var emlVerify = 0;



/**
 * GET/user-login
 *user login
 */
exports.userLogin = async (req, res) => {

   try {

      if (login_status == 1) {

         var msg = "Check Your Login Details"
         console.log(msg);

         // res.redirect('/admin')
      } else {
         var msg = "";
      }

      res.render('user-panel/user-login', { showHeader: false, showFooter: false, msg, login_status })

   } catch (error) {
      console.log('error' + error);
   }

}



/**
* POST/user-login
*Verify User Register
*/
exports.userLoginVerify = async (req, res) => {

   try {
      var { password, email } = req.body;



      var data = await userPanel.findOne({ email })

      if (password == data.password) {

         res.cookie('user', data.username);
         res.cookie('email', data.email); //here email is stores in cookie because i want to store a email with user email and username because i want to store a recipedata when user enter that dashboard
         res.redirect('/user-dash');


      } else {
         login_status = 1;

         res.redirect('/user-login')

      }

   } catch (error) {
      console.log('error' + error);
   }
}




/**
 * GET/user-register
 *admin login
 */
exports.userRegister = async (req, res) => {

   try {
      if (login_status == 1) {

         var msg = "Check Your Login Details"
         console.log(msg);

         // res.redirect('/admin')
      } else {
         var msg = "";
      }

      if (emlVerify == 1) {

         var emsg = "Email is already exist"
         console.log(emsg);

         // res.redirect('/admin')
      } else {
         var emsg = "";
      }


      res.render('user-panel/user-register', { showHeader: false, showFooter: false, msg, login_status, emsg, emlVerify })
   } catch (error) {
      console.log('error' + error);
   }
}


/**
* POST/user-register
*Verify User Register
*/
exports.userRegisterVerify = async (req, res) => {

   try {
      var { username, email, password, c_password } = req.body;

      var existingUser = await userPanel.findOne({ email });

      if (existingUser) {
         // Email already registered
         emlVerify = 1;
         return res.redirect('/user-register');
      }

      if (password == c_password) {
         await userPanel.create(req.body)
         res.redirect('/user-login')
      } else {
         login_status = 1;
         console.log(login_status);
         res.redirect('/user-register')
      }

   } catch (error) {
      console.log('error' + error);
   }
}



/**
 * GET/user-dash
 *user dashboard
 */
exports.userDash = async (req, res) => {

   try {

      var username = req.cookies.user;
      var email = req.cookies.email;

      var userRecipe = await userInsertModel.find({ email: email, username: username })
      res.render('user-panel/user-dash', { showHeader: false, showFooter: false, userRecipe , username })

   } catch (error) {
      console.log('error' + error);
   }

}


/**
* POST/user-insert-recipe
*Verify User Register
*/
exports.InsertRecipeByUser = async (req, res) => {

   try {

      res.render('user-panel/user-submit-recipe', { showHeader: false, showFooter: false })

   } catch (error) {
      console.log('error' + error);
   }
}



/**
 * POST/user-insert-recipe
 * submit recipe 
 */
exports.InsertRecipeByUserOnPost = async (req, res) => {
   try {

      const userName = req.cookies.user;
      const userEmail = req.cookies.email;
      console.log(userEmail);


      let imageUploadFile;
      let uploadPath;
      let newImageName;

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
         if (err) return res.status(500).send(err)
      })


      var newRecipe = new userInsertModel({
         name: req.body.name,
         description: req.body.description,
         ingredients: req.body.ingredients,
         category: req.body.category,
         image: newImageName,
         username: userName,
         email: userEmail
      });
      await newRecipe.save();


      res.redirect('/user-insert-recipe');

   } catch (error) {
      console.log("eror:-" + error);
   }
}






/**
* GET/user-update-recipe/:id/:status
*Display user update form 
*/
exports.updateRecipeByUser = async (req, res) => {

   try {
      var status = req.params.status; // i put a status  parameter in user-update-recipe/:id/:status this controller api because i want to show user recipe data and update n amin side so if i dont put parameter like status so in admin side i call a this update api and data will be update but isssue is where when im click on the submit so it can direct a that user recipe page which is open in admin side into a user side user dashboard so if i have to open a admin side, all user recipe page so i want to make a diffrent update recipe page and i have to direct a apge into a admin side, all user recipe page , so i have to solve this problem im just add a parameter /:status  so when im click on the submit button then it gives a :status parameter a one value which is i give in update form when a click update button on the user dashboard then the :status = 'user' and when im click on update button on user update form but from a admin side then it gives a :status='user-admin' because both user side  dashboard name is 'user-dash' and admin side dashboard name is 'user-admin-dash' so the parameter is solve my problem and i dont have to create a new page and api . 
      var data = await userInsertModel.findById(req.params.id);

      res.render('user-panel/user-update-recipe', { showHeader: false, showFooter: false, data, status })

   } catch (error) {
      console.log('error' + error);
   }
}




/**
* POST/user-update-recipe/:id
*Update the user recipe 
*/
exports.updateRecipeByUserOnPost = async (req, res) => {

   try {
      var status = req.params.status;

      await userInsertModel.findByIdAndUpdate(req.params.id, req.body);

      res.redirect(`/${status}-dash`);

   } catch (error) {
      console.log('error' + error);
   }
}


/**
* POST/user-update-recipe/:id
*Update the user recipe 
*/
exports.deleteRecipeByUser = async (req, res) => {

   await userInsertModel.findByIdAndDelete(req.params.id)
   res.redirect('/user-dash');


}


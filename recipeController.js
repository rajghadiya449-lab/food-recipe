var category = require('../model/category');
var recipeModel = require('../model/recipe');
var userRecipeModel = require('../model/userRecipe');
var reviewModel = require('../model/review');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { name } = require('ejs');
const secret = 'foodrecipeblogwithnodejs';


   /**
    * GET/
    * homepage
    */

   exports.homePage = async (req, res) => {

      try {
         let limitCategory = 5;
         const categories = await category.find({}).limit(limitCategory);

         limitAdmin = 5 ;
         const latestAdmin = await recipeModel.find({}).limit(2);
         // const latest = await recipeModel.find({}).limit(limitCategory);sort({ _id: -1 }).
         const thaiAdmin = await recipeModel.find({ 'category': 'Thai' }).sort({ _id: -1 }).limit(2);
         const americanAdmin = await recipeModel.find({ 'category': 'American' }).sort({ _id: -1 }).limit(2);
         const chinesAdmin = await recipeModel.find({ 'category': 'Chines' }).sort({ _id: -1 }).limit(2);



         const latestUser = await userRecipeModel.find({}).sort({ _id: -1 }).limit(3);
         // const latest = await recipeModel.find({}).limit(limitCategory);
         const thaiUser = await userRecipeModel.find({ 'category': 'Thai' }).sort({ _id: -1 }).limit(3);
         const americanUser = await userRecipeModel.find({ 'category': 'American' }).sort({ _id: -1 }).limit(3);
         const chinesUser = await userRecipeModel.find({ 'category': 'Chines' }).sort({ _id: -1 }).limit(3);



            var latest = [...latestAdmin , ...latestUser] ;
            var thai = [...thaiAdmin , ...thaiUser] ;
            var american = [...americanAdmin , ...americanUser] ;
            var chines = [...chinesAdmin , ...chinesUser] ;
            




         let food = { latest, thai, american, chines }

         res.render('user/home', { data: categories, food, showHeader: true, showFooter: true })

      } catch (error) {
         console.log('error' + error);
      }

   }

   /**
    * GET/categories
    * Category page
    */
   exports.exploreCategories = async (req, res) => {
      try {
         let limitCategory = 20;
         let categoryId = req.params.id;


         // pagination start
         let limit = 10;
         var total_recordAdmin = await recipeModel.countDocuments({ 'category': categoryId })
         var total_recordUser = await userRecipeModel.countDocuments({ 'category': categoryId })

         var total_record = total_recordAdmin + total_recordUser ;
         //  console.log(total_record)
         let page_no = req.query.page_no;
         // console.log(page_no)
         let page = Math.ceil(total_record / limit)


         const categories = await category.find({});
         //res.json(categories)
         res.render('user/categories', { data: categories, categoryId, showHeader: true, showFooter: true, page, page_no })
      } catch (error) {
         console.log('error' + error);
      }
   }



   /**
    * GET/recipe/:id
    * Single Recipe explore with name description and image 
    */

   exports.exploreRecipe = async (req, res) => {
      try { 

         let recipeId = req.params.id;
         // for find recipe by category 
         let recipeAdmin = await recipeModel.findById(recipeId);
         let recipeUser = await userRecipeModel.findById(recipeId);

         var combineRecipe = [] ;

         if(recipeAdmin){
            combineRecipe.push({
               _id: recipeAdmin._id,
               name:recipeAdmin.name,
               description: recipeAdmin.description,
               ingredients: recipeAdmin.ingredients,
               category: recipeAdmin.category,
               image: recipeAdmin.image,
               username: recipeAdmin.username
            })
         }

         
         if(recipeUser){
            combineRecipe.push({
               _id: recipeUser._id,
               name:recipeUser.name,
               description: recipeUser.description,
               ingredients: recipeUser.ingredients,
               category: recipeUser.category,
               image: recipeUser.image,
               username: recipeUser.username
            })
         }

console.log(combineRecipe)


         // get review by category 
         let review = await reviewModel.find({recipeId : recipeId});
         
         
         res.render('user/recipe', { recipe : combineRecipe , review ,showHeader: true, showFooter: true })

      } catch (error) {
         console.log('error' + error);
      }
   }

   /**
    * GET/categories/:id
    * explore perticular category's all recipe 
    */

   exports.exploreCategoriesById = async (req, res) => {
      try {

          
         let categoryName = req.params.name;

         const adminRecipe = await recipeModel.find({ 'category': categoryName });
         const userRecipe = await userRecipeModel.find({ 'category': categoryName });


         // recipe name , image, id ,username 
         var combinedRecipes = adminRecipe.map(data =>  ({
            _id:data._id,
            name : data.name ,
            image : data.image ,
            username : data.username 
         })).concat(userRecipe.map(data => ({
            _id:data._id,
            name : data.name ,
            image : data.image ,
            username : data.username 
         })))



         // pagination start
         let limit = 10;
         
         var total_record = combinedRecipes.length ;
         console.log(total_record)
         //  console.log(total_record)
         let page_no = req.query.page_no || 1 ;
         // console.log(page_no)
         let page = Math.ceil(total_record / limit)
         // console.log(page)
         var skip = (page_no - 1) * limit;


        

         var recipeByCategory = combinedRecipes.slice(skip , skip + limit);

        console.log(recipeByCategory) 
        res.render('user/categories', { categoryById : recipeByCategory , categoryId : categoryName , showHeader: true, showFooter: true, page, page_no })
      
      } catch (error) {
         console.log('error' + error);
      }
   }

   /**
    * POST/search
    *Search
   */

   exports.searchRecipe = async (req, res) => {
      let key = req.body.searchTerm
      var categoryId = req.params.cname;
      // console.log(categoryId);

      let searchData;
      if (categoryId) {
         searchData = await recipeModel.find({
            "$and": [
               {
                  "$or": [
                     { "name": { $regex: key, $options: "i" } },
                     { "category": { $regex: key, $options: "i" } }
                  ]
               },
               { "category": categoryId } // Filter by category name
            ]
         });
      } else {
         // If category name is not provided, search in all categories
         searchData = await recipeModel.find({
            "$or": [
               { "name": { $regex: key, $options: "i" } },
               { "category": { $regex: key, $options: "i" } }
            ]
         });
      }
         
      res.render('user/search', { showHeader: true, showFooter: true, searchData, error: "NO Records Found", searchTerm: req.body.searchTerm, categoryId: categoryId })
   }

   /**
    * GET/search
    *Search
   */

   exports.searchRecipeShow = async (req, res) => {

      res.render('user/search', { showHeader: true, showFooter: true, title: "Search Your Recipes" })
   }     


   /**
    * GET/explore-latest
    *explore a latest recipe
   */

   //  exports.suggetion = async (req, res) => {
   //    try {
   //        const partialName = req.params.partialName.toUpperCase(); // Convert partial name to uppercase
   //        const suggestions = await recipeModel.find({ name: { $regex: partialName, $options: 'i' } }, 'name'); // Find matching recipe names

   //        // Extract only the recipe names from the suggestions
   //        const recipeNames = suggestions.map(recipe => recipe.name);

   //        console.log(recipeNames); // Send the recipe names as JSON response
   //    } catch (error) {
   //        console.error(error);
   //        res.status(500).json({ message: 'Internal Server Error' });
   //    }
   // }


   /**
    * GET/explore-latest
    *explore a latest recipe
   */

   exports.exploreLatest = async (req, res) => {
      try {

         let limitRecipe = 20;

         let recipe = await recipeModel.find({}).limit(limitRecipe)

         res.render('user/explore-latest', { recipe, showHeader: true, showFooter: true })
      } catch (error) {
         console.log("eror:-" + error);
      }

   }

   /**
    * GET/explore-Random
    *explore a random recipe
   */

   exports.exploreRandom = async (req, res) => {
      try {


         let count = await recipeModel.find().countDocuments();
         let random = Math.floor(Math.random() * count);
         let recipe = await recipeModel.findOne().skip(random).exec();

         res.render('user/explore-random', { data: recipe, showHeader: true, showFooter: true })
      } catch (error) {
         console.log("eror:-" + error);
      }

   }



/**
    * POST/review
    *explore a random recipe
   */

    exports.submitReview = async (req, res) => {
      try {

        

         const {recipeId, username, email, rating, comment } = req.body;

         let otp = Math.floor(Math.random() * 1000000000000000) ;

         const token = jwt.sign({ email: email, otp: otp}, secret);
         

           const newReview = {
            recipeId,
            username,
            email,
            rating,
            comment,
            otp
         }
        
// c              
               
         const verificationUrl = `http://localhost:5001/verify-email?token=${token}`;

      //   console.log('otp  :- '+ data.otp)
         const transporter = nodemailer.createTransport({
            // Configure your email transport
            service: 'Gmail', // Use your desired email service provider
            auth: {
                user: 'priyank7494@gmail.com',
                pass: 'cybbhjswpixxttsd',
            },
        });
         
        const mailOptions = {
            from: 'priyank7494@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Hey ${username} ,  Verify Your Email By Click This Link :-   ${verificationUrl}`,
            // text: `Please verify your email by clicking the following link: ${verificationUrl}`,
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
         if (err) {
             console.error(err);
             res.status(500).send("Error sending email.");
         } else {
             console.log('Email sent: ' + info.response);
             res.send("Please check your email for the verification link.");
         }
     });



         await reviewModel.create(newReview);


      } catch (error) {
         console.log("eror:-" + error);
      }

   }
 

   exports.verifyEmail = async (req, res) => {
      try {
          const { token } = req.query;
  
          // Decode the token
          const decoded = jwt.verify(token, secret);

          //  decoded = ['eamil:priyank7494@gmail.com' , 'otp:78965414525896']     expected output of decoded

          const { email, otp } = decoded;
  
          // Find the review based on email and otp
          const review = await reviewModel.findOne({ email: email, otp: otp });
  
          if (review) {
           
              res.redirect(`/recipe/${review.recipeId}`);
          } else {
              res.status(400).send("Invalid verification link or expired.");
          }
      } catch (error) {
          console.log("Error:", error);
          res.status(500).send("Server error.");
      }
  };


   // exports.submitReview = async (req, res) => {
   //    try {

   //       res.redirect(`/recipe/${recipeId}`)  


   //    } catch (error) {
   //       console.log("eror:-" + error);
   //    }

   // }
   
   
   







































      // const verification = await Verification.findOne({ email });

      // if (!verification || !verification.emailVerified) {
      //     // If the email is not verified, send a verification email
      //     sendVerificationEmail(email);
      //     return res.status(400).send('A verification email has been sent. Please verify your email before submitting a review.');
      // } 
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   // exports.emailVerify = async (req, res) => {
   //    const { token } = req.query;
   //  // Find the verification record in your database using the token
   //  const verification = await Verification.findOne({ token });

   //  if (!verification) {
   //      return res.status(400).send('Invalid or expired token');
   //  }

   //  // Mark the email as verified
   //  verification.emailVerified = true;
   //  await verification.save();

   //  res.send('Email verified successfully');
   // }












   // exports.get_data = async (req, res) => {

   //    try {
   //       const categories = await category.find({}).limit(5);

   //       // Log categories to see if it contains data
   //       categories.forEach(category => {
   //          console.log(category.name);
   //       });

   //       if (categories.length === 0) {
   //          return res.status(404).json({ error: 'No categories found' });
   //       }

   //       // Extracting names from the categories array
   //       const categoryNames = categories.map(category => category.name);

   //       // Sending response with the names
   //       res.json({ categories: categoryNames });
   //    } catch (error) {
   //       // Handle any errors
   //       console.error(error);
   //    }
   // }


   // async function dummy() {
   //    await category.insertMany(
   //       [
   //          {
   //             "name": "Thai",
   //             "image": "thai-food.jpg"
   //          },
   //          {
   //             "name": "American",
   //             "image": "american-food.jpg"
   //          },
   //          {
   //             "name": "Chinese",
   //             "image": "chinese-food.jpg"
   //          },
   //          {
   //             "name": "Mexican",
   //             "image": "mexican-food.jpg"
   //          },
   //          {
   //             "name": "Indian",
   //             "image": "indian-food.jpg"
   //          },
   //          {
   //             "name": "Spanish",
   //             "image": "spanish-food.jpg"
   //          },
   //       ]);
   // }

   // dummy();

   // async function insertDummyRecipeData() {
   //    try {
   //       await recipeModel.insertMany([
   //          {
   //             "name": "Burger",
   //             "description": `its a besan based recipe e have to need a besan soda and salt .add some water in the mixure and fried in to oil`,
   //             "email": "recipeemail@raddy.co.uk",
   //             "ingredients": [
   //                "1 level teaspoon baking powder",
   //                "1 level teaspoon cayenne pepper",
   //                "1 level teaspoon hot smoked paprika",
   //             ],
   //             "category": "American",
   //             "image": "burger.jpg"
   //          },
   //          {
   //             "name": "Jalebi Fafada",
   //             "description": `its a besan based recipe e have to need a besan soda and salt .add some water in the mixure and fried in to`,
   //             "email": "recipeemail@raddy.co.uk",
   //             "ingredients": [
   //                "1 level teaspoon baking powder",
   //                "1 level teaspoon cayenne pepper",
   //                "1 level teaspoon hot smoked paprika",
   //             ],
   //             "category": "Indian",
   //             "image": "dhosa.jpg"
   //          },
   //          {
   //             "name": "Dhosa Indian southern",
   //             "description": `its a besan based recipe e have to need a besan soda and salt .add some water in the mixure and fried in to`,
   //             "email": "recipeemail@raddy.co.uk",
   //             "ingredients": [
   //                "1 level teaspoon baking powder",
   //                "1 level teaspoon cayenne pepper",
   //                "1 level teaspoon hot smoked paprika",
   //             ],
   //             "category": "Indian",
   //             "image": "burger.jpg"
   //          },
   //          {
   //             "name": "Dhosa Indian southern",
   //             "description": `its a besan based recipe e have to need a besan soda and salt .add some water in the mixure and fried in to`,
   //             "email": "recipeemail@raddy.co.uk",
   //             "ingredients": [
   //                "1 level teaspoon baking powder",
   //                "1 level teaspoon cayenne pepper",
   //                "1 level teaspoon hot smoked paprika",
   //             ],
   //             "category": "Indian",
   //             "image": "jalebi.jpeg"
   //          },
   //          {
   //             "name": "Dhosa Indian southern",
   //             "description": `its a besan based recipe e have to need a besan soda and salt .add some water in the mixure and fried in to`,
   //             "email": "recipeemail@raddy.co.uk",
   //             "ingredients": [
   //                "1 level teaspoon baking powder",
   //                "1 level teaspoon cayenne pepper",
   //                "1 level teaspoon hot smoked paprika",
   //             ],
   //             "category": "Indian",
   //             "image": "dhosa.jpg"
   //          },
   //          {
   //             "name": "Dhosa Indian southern",
   //             "description": `its a besan based recipe e have to need a besan soda and salt .add some water in the mixure and fried in to`,
   //             "email": "recipeemail@raddy.co.uk",
   //             "ingredients": [
   //                "1 level teaspoon baking powder",
   //                "1 level teaspoon cayenne pepper",
   //                "1 level teaspoon hot smoked paprika",
   //             ],
   //             "category": "Indian",
   //             "image": "jalebi.jpeg"
   //          }, 

   //       ])
   //    } catch (error) {

   //    }
   // }

   // insertDummyRecipeData() 
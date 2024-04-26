const express = require("express");
const path = require("path");
const cookiParser = require("cookie-parser")
const { restrictToLoggedinUserOnly} = require("./middlewares/auth")

const { connectToMongoDB } = require("./connect")

const URL = require("./models/model")
const app = express();
const PORT = 5000;

////ROUTES////
const staticRoute = require("./routes/staticRoutes")
const urlRoute = require("./routes/route")
const userRoute = require("./routes/user")

connectToMongoDB("mongodb://127.0.0.1:27017/short-url-2")
.then( () => console.log("mongo connected"))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


////MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

////ROUTES REGISTERED ////
app.use("/", checkAuth, staticRoute)
app.use("/url", restrictToLoggedinUserOnly, urlRoute)
app.use("/user", userRoute)

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("view")
})


app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
      shortId
    }, { $push: {
          visitHistory: {
            timestamp: Date.now()
          },
    }})
    res.redirect(entry.redirectURL)
})


app.listen(PORT, () => console.log(`Server started at port ${PORT}.`)) 
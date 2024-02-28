const express =  require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURL}= require('./keys')
const cors = require('cors')
const bodyParser = require("body-parser");

mongoose.connect(MONGOURL,{
    useNewUrlParser:true, useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log('Connected to mongo...')
})
mongoose.connection.on('error',(err)=>{
    console.log('error connecting...',err)
})

require('./models/user')
require('./models/post')

app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.status(200).send('welcome back')
})
app.use(require('./routes/auth'))
app.use(require('./routes/posts'))



const colorClassMapping = {
  "#B38BFA": "error",
  "#FF79F2": "error-content",
  "#43E6FC": "warning",
  "#F19576": "warning-content",
  "#0047FF": "success",
  "#6691FF": "success-content",
};

// Define MongoDB schemas and models
const groupSchema = new mongoose.Schema({
  name: String,
  color: String,
});

const noteSchema = new mongoose.Schema({
  groupId: mongoose.Schema.Types.ObjectId,
  text: String,
  date: String,
});

const Group = mongoose.model("Group", groupSchema);
const Note = mongoose.model("Note", noteSchema);

// REST API endpoints
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/groups", async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

app.post("/groups", async (req, res) => {
  try {
    const { name, color } = req.body;

    // Map color to its corresponding class name
    const mappedColor = colorClassMapping[color] || color;

    const newGroup = new Group({ name, color: mappedColor });
    await newGroup.save();
    res.json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/groups/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  const groupNotes = await Note.find({ groupId });
  res.json(groupNotes);
});

app.post("/groups/:groupId", async (req, res) => {
  const groupId = req.params.groupId;
  const { text, date } = req.body;
  const newNote = new Note({ groupId, text, date });
  await newNote.save();
  res.json(newNote);
});






app.listen(PORT,()=>{
    console.log("Spacebook is launching on", PORT)
})

const express = require("express")
const jwt = require("jsonwebtoken");
const { Village, Activity, collection, GC, Project, Technology, Challenge, Collaborator, ProjectComponent, Interest } = require("./mongo.cjs")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const check = await collection.findOne({ email: email, password: password });

        if (check) {
            const mail = { email };
            const accessToken = jwt.sign(mail, 'your-secret-key');
            console.log(accessToken);
            
            res.json({ status: "exist", accessToken: accessToken });
        } else {
            res.json({ status: "notexist" });
        }
    } catch (e) {
        res.json({ status: "fail" });
    }
});

app.post("/logout", (req, res) => {
  localStorage.removeItem("accessToken");
  
  res.redirect("/");
});


app.post('/api/challenges', async (req, res) => {
  const { email, sector, title, summary, details, impact, image } = req.body;

  try {
    const newChallenge = new Challenge({
      email,
      sector, 
      title,
      summary,
      details,
      impact,
      image,
    });

    const savedChallenge = await newChallenge.save();
    res.json({ status: 'success', challenge: savedChallenge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Failed to save challenge' });
  }
});

app.post('/api/interest', async (req, res) => {
  const { title, url, about } = req.body;

  try {
    const newInterest = new Interest({
      title,
      url,
      about
    });

    const savedInterest = await newInterest.save();
    res.json({ status: 'success', Interest: savedInterest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Failed to save Interest' });
  }
});



app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await collection.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (existingUser) {
            return res.json("exist");
        }

        const newUser = new collection({ username, email, password });

        const savedUser = await newUser.save();
        res.json("success");
    } catch (error) {
        console.error(error);
        res.status(500).json("error");
    }
});

app.get("/api/details", async (req, res) => {
    try {
      const details = await GC.find();
      res.json(details);
    } catch (error) {
      console.error(error);
      res.status(500).json("error");
    }
  });

  app.get("/api/research-project", async (req, res) => {
    try {
      const details = await Project.find({type:"Research"});
      res.json(details);
    } catch (error) {
      console.error(error);
      res.status(500).json("error");
    }
  });

  app.get("/api/university-projects", async (req, res) => {
    try {
      const details = await Project.find({type:"University"});
      res.json(details);
    } catch (error) {
      console.error(error);
      res.status(500).json("error");
    }
  });

  app.get("/api/research-project/:id", async (req, res) => {
    try {
      const det = await Project.find();
      const details = await ProjectComponent.find({ file: det.file })

      res.json(details);
    } catch (error) {
      console.error(error);
      res.status(500).json("error");
    }
  });

  app.get("/api/research-project/comp/:id", async (req, res) => {
    const challengeId = req.params.id;
    console.log(challengeId);
   
    try {
      const details = await ProjectComponent.findById(challengeId);
  
      if (!details) {
        return res.status(404).json({ error: "Technology not found" });
     }
   
     res.json(details);
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: "Internal server error" });
     }
   });



app.get("/api/technologies", async (req, res) => {
    try {
      const details = await Technology.find();
      res.json(details);
    } catch (error) {
      console.error(error);
      res.status(500).json("error");
    }
});

app.get("/api/village-projects", async (req, res) => {
  try {
    const details = await Village.find();
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json("error");
  }
});

app.get("/api/technologies/:id", async (req, res) => {
  const challengeId = req.params.id;
  console.log(challengeId);
 
  try {
    const details = await Technology.findById(challengeId);

    if (!details) {
      return res.status(404).json({ error: "Technology not found" });
   }
 
   res.json(details);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
   }
 });
  
 app.get("/api/village-project/:id", async (req, res) => {
  const challengeId = req.params.id;
 
  try {
    const details = await Village.findById(challengeId);

    if (!details) {
      return res.status(404).json({ error: "Village not found" });
   }
 
   res.json(details);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
   }
 });

 app.get("/village-project/:id", async (req, res) => {
  try {
    const challengeId = req.params.id;
    const det = await Village.findById(challengeId);
    const details = await Activity.find({ folder: det.folder })

    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json("error");
  }
});

 app.get("/api/village-project/comp/:id", async (req, res) => {
  const challengeId = req.params.id;
  try {
    const details = await Activity.findById(challengeId);

    if (!details) {
      return res.status(404).json({ error: "Technology not found" });
   }
 
   res.json(details);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
   }
 });



app.get("/api/details/:id", async (req, res) => {
   const challengeId = req.params.id;
  
   try {
     const details = await GC.findById(challengeId);
 
     if (!details) {
       return res.status(404).json({ error: "Challenge not found" });
    }
  
    res.json(details);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.get("/api/collab", async (req, res) => {
    try {
      const details = await Collaborator.find();
      res.json(details);
    } catch (error) {
      console.error(error);
      res.status(500).json("error");
    }
});

app.get("/api/collab/:id", async (req, res) => {
  const challengeId = req.params.id;
  console.log(challengeId);
 
  try {
    const details = await Collaborator.findById(challengeId);

    if (!details) {
      return res.status(404).json({ error: "Collaborator not found" });
   }
 
   res.json(details);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
   }
 });


app.listen(8000,()=>{
    console.log("port connected");
})

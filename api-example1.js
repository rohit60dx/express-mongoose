import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';

const dbName = "collage"
const url = "mongodb://localhost:27017"
const client = new MongoClient(url)


const app = express();
app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



client.connect().then((connection) => {
    const db = connection.db(dbName);

    app.get("/api", async (req, resp) => {
        const collection = db.collection("students");
        const students = await collection.find().toArray();

        resp.status(200).json({
            status: resp.statusCode,
            message: "Students fetched successfully",
            data: students,
        });
    });

    app.get("/", async (req, resp) => {
        const collection = db.collection("students")
        const students = await collection.find().toArray();
        resp.render("usersCard", { users: students });

    })

    app.get("/add-student", async (req, resp) => {
        resp.render("addStudent");
    })

    app.post("/add-student", async (req, resp) => {
        const { name, age, email } = req.body;

        if (!name || name.trim() === "") {
            resp.send({ status: resp.statusCode, message: "name is required" })
            return false;
        }
        if (!age || isNaN(age) || age < 1) {
            resp.send({ status: resp.statusCode, message: "age is required" })
            return false;
        }
        if (!email || !email.includes("@") || !email.includes(".")) {
            resp.send({ status: resp.statusCode, message: "email is required" })
            return false;
        }

        const collection = db.collection("students")
        await collection.insertOne({ name, age, email })
        // await collection.insertOne(req.body) //you can also use this for insert the record
        resp.redirect("/")
    })


    app.post("/add-studend-api", async (req, resp) => {
        const { name, age, email } = req.body;
        if (!name || name.trim() === "") {
            resp.send({ status: resp.statusCode, message: "name is required" })
            return false;
        }
        if (!age || isNaN(age) || age < 1) {
            resp.send({ status: resp.statusCode, message: "age is required" })
            return false;
        }
        if (!email || !email.includes("@") || !email.includes(".")) {
            resp.send({ status: resp.statusCode, message: "email is required" })
            return false;
        }
        const collection = db.collection("students")
        await collection.insertOne({ name, age, email })
        resp.send({ status: resp.statusCode, message: "Student added successfully" })
    })




    app.delete("/delete-student/:id", async (req, resp) => {
        const id = req.params.id;
        console.log("Deleting student with ID:", id);
        try {
            const collection = db.collection("students");
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 1) {
                return resp.status(200).json({ status: resp.statusCode, message: "Student successfully deleted" });
            } else {
                return resp.status(404).json({ status: resp.statusCode, message: "Student not found" });
            }
        } catch (err) {
            console.error("Delete error:", err);
            return resp.status(500).json({ status: resp.statusCode, message: "Internal Server error" });
        }
    });



    // PUT: Update student
    app.put("/update-student/:id", async (req, resp) => {

        const id = req.params.id;
        console.log("Update request ID:", id);
        const { name, age, email } = req.body;

        // Validation
        if (!name?.trim()) return resp.status(400).json({ status: resp.statusCode, message: "Name is required" });
        if (!age || isNaN(age) || age < 1) return resp.status(400).json({ status: resp.statusCode, message: "Age is required" });
        if (!email || !email.includes("@")) return resp.status(400).json({ status: resp.statusCode, message: "Email is required" });

        try {
            const collection = db.collection("students");
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { name: name.trim(), age: parseInt(age), email: email.trim().toLowerCase() } }
            );

            if (result.matchedCount === 1) {
                return resp.status(200).json({ status: resp.statusCode, message: "Student successfully updated" });

            } else {
                return resp.status(404).json({ status: resp.statusCode, message: "Student not found" });
            }
        } catch (err) {
            console.error("Update error:", err);
            return resp.status(500).json({ status: resp.statusCode, message: "Internal Server error" });
        }
    });



    app.get("/student-details/:id", async (req, resp) => {
        try {
            const id = req.params.id;
            console.log(" request ID:", id);
            const collection = db.collection("students");
            const student = await collection.findOne(
                { _id: new ObjectId(id) },
            );
            if (student) {
                return resp.status(200).json({ status: resp.statusCode, message: "Student Data Fetched successfully", data: student });
            } else {
                return resp.status(404).json({ status: resp.statusCode, message: "Student not found" });
            }
        } catch (err) {
            console.error("Fetch error:", err);
            return resp.status(500).json({ status: resp.statusCode, message: "Internal Server error" });
        }
    })
})



// app.set("view engine",'ejs')

app.listen(8080)





//proper api with pagination
//   app.get("/api", async (req, resp) => {
//         const collection = db.collection("students");

//         // Default values
//         const limit = parseInt(req.query.limit) || 10;
//         const offset = parseInt(req.query.offset) || 0;
//         try {
//             // Get total count
//             const totalCount = await collection.countDocuments();
//             // Fetch paginated data
//             const students = await collection
//                 .find()
//                 .skip(offset)
//                 .limit(limit)
//                 .toArray();

//             // Calculate total pages
//             const totalPages = Math.ceil(totalCount / limit);
//             // Build next/previous URLs
//             const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
//             const nextOffset = offset + limit;
//             const prevOffset = offset - limit;
//             const next = nextOffset < totalCount ? `${baseUrl}?limit=${limit}&offset=${nextOffset}` : null;
//             const previous = prevOffset >= 0 ? `${baseUrl}?limit=${limit}&offset=${prevOffset}` : null;
//             // Final Response
//             resp.status(200).json({
//                 status: resp.statusCode,
//                 message: "Students fetched successfully",
//                 data: students,
//                 pagination: {
//                     total_count: totalCount,
//                     limit,
//                     offset,
//                     total_pages: totalPages,
//                     next,
//                     previous
//                 }
//             });

//         } catch (err) {
//             console.error("API Error:", err);
//             resp.status(500).json({
//                 success: false,
//                 message: "Server error",
//                 pagination: null
//             });
//         }
//     });

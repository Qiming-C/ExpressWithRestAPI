
//this is a function
const express = require('express');
//this is a Joi CLASS for us to validing 
const Joi = require('joi');
//we create the express app
const app = express();

//middleware
app.use(express.json());

//use this as temporarily database table 
const courses = [
    { id: 1, name: 'crouse1' },
    { id: 2, name: 'crouse2' },
    { id: 3, name: 'crouse3' },
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

//return all the courses
app.get('/api/courses', (req, res) => {

    res.send(courses);

});

//single course query
// /api/courses/1  end point
app.get('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        //404 not found
        res.status(404).send('The course with given id was not found');
        res.end();
        return;
    }
    //else is found
    res.send(course);
    res.end();
});


//post end point
app.post('/api/courses', (req, res) => {

    //validate
    //object destructuring { error}
    const { error } = validateCourse(req.body);  //same as result.error
    //if invalid, return 400 -bad request
    if (error) {
        //400 bad request
        return res.status(400).send(result.error.details[0].message);

    }

    const course = {
        id: courses.length + 1,
        name: req.body.name

    };

    courses.push(course);

    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) { return res.status(404).send('The course with the given ID was not existed') };


    //validate
    //object destructuring { error}
    const { error } = validateCourse(req.body);  //same as result.error
    //if invalid, return 400 -bad request
    if (error) {
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    //update course
    course.name = req.body.name;
    //return the updated course
    res.send(course);
})


// PORT => enviorment variable
const port = process.env.PORT || 3000;
//we can set the port number in terminal 
//by typing export PORT=5000 FOR INSTANCE
app.listen(3000, () => { port, console.log(`Listening on port: ${port}`) });


//DELETE
app.delete('/api/courses/:id', (req, res) => {
    //look up the course
    // Look up the course
    // if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) { return res.status(404).send('The course with the given ID was not existed') };

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});


//validation 
function validateCourse(course) {
    const schema = Joi.object({ name: Joi.string().min(3).required() })
    const result = schema.validate(course);
    return result;
}
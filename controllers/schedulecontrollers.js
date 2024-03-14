
const e = require('express');
const conn = require('./../utils/dbconn');
const bcrypt = require('bcrypt');



//get controller --------------------------------------------------------------------------------------

exports.getSchedule = (req, res) => {

    var userinfo = {};
    const { isloggedin, userid } = req.session;
    console.log(`User data from session ${isloggedin}, User ID: ${userid}`);

    if (isloggedin) {

        const getUserSQL = `SELECT User.user_DisplayName, User.user_ID, User_Type.userRole
    FROM user 
    INNER JOIN User_Type ON user.user_TypeID = User_Type.user_TypeID
    WHERE user.user_ID =  '${userid}'`;


        conn.query(getUserSQL, (err, rows) => {
            if (err) throw err;
            console.error('Error fetching data from database:', err);

            console.log(rows);
            const username = rows[0].user_DisplayName;
            const userrole = rows[0].userRole;
            const userid = rows[0].user_ID;

            const session = req.session;
            session.name = username;
            session.userrole = userrole;
            session.userid = userid;
            console.log(session);

            userinfo = { name: username, type: userrole, id: userid };
            console.log(userinfo);
        });
    }
    const selectSQL = `
    SELECT s.*, t.trigger_type 
    FROM Snapshot s
    INNER JOIN Triggers t ON s.trigger_ID = t.trigger_ID
    WHERE s.user_ID = '${userid}'`;



    conn.query(selectSQL, (err, rows) => {
        if (err) {
            console.error('Error fetching Snapshot data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        } else {
            res.render('index', { Snapshot: rows, loggedin: isloggedin, user: userinfo });
        }
    });
};




//Add controller --------------------------------------------------------------------------------------



exports.getAddNewSnapshot = (req, res) => {
    const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    if (isloggedin) {
        res.render('addschedule');
    } else {
        res.redirect('/');
    }
};

//select controller --------------------------------------------------------------------------------------

exports.selectSnapshot = (req, res) => {

    const { isloggedin, userrole } = req.session;
    console.log(`User logged in: ${isloggedin}`);
    console.log(`User role: ${userrole}`);
    if (isloggedin) {
        const { id } = req.params;
        // query to show trigger name as well as id 
        const selectSQL = `SELECT * FROM  snapshot WHERE snapshot_ID = ${id}`;
        conn.query(selectSQL, (err, rows) => {
            if (err) {
                throw err;
            } else {
                console.log(rows);
                res.render('editschedule', { details: rows, userrole });
            }
        });

    } else {
        res.redirect('/');
    }
};

//post controller --------------------------------------------------------------------------------------

exports.postNewSnapshot = (req, res) => {
    const { isloggedin, userid } = req.session;
    if (!isloggedin || !userid) {
        res.redirect('/login');
        return;
    }

    const selectedDateTime = req.body.snapshot_date; // Concatenate date and time
    const selectedTriggerID = req.body.trigger_ID;
    const enjoyment = req.body.enjoyment;
    const surprise = req.body.surprise;
    const contempt = req.body.contempt;
    const sadness = req.body.sadness;
    const fear = req.body.fear;
    const disgust = req.body.disgust;
    const anger = req.body.anger;

    const userId = req.session.userid;
    if (!userId) {
        console.error('User ID not found in session');
        res.status(500).send('User ID not found in session');
        return;
    }

    const insertSQL = 'INSERT INTO Snapshot (user_ID, snapshot_date, enjoyment, surprise, contempt, sadness, fear, disgust, anger, trigger_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT trigger_ID FROM Triggers WHERE trigger_type = ?))';

    conn.query(insertSQL, [userId, selectedDateTime, enjoyment, surprise, contempt, sadness, fear, disgust, anger, selectedTriggerID], (err, result) => {
        if (err) {
            console.error('Error inserting record:', err);
            res.status(500).send('Error inserting record');
        } else {
            console.log('Record inserted successfully:', result.insertId);
            res.redirect('/');
        }
    });
};

//update controller --------------------------------------------------------------------------------------


exports.updateSnapshot = (req, res) => {
    const snapshot_id = req.params.id;
    const trigger_id = req.body.trigger_ID; // Only trigger can be edited
    const vals = [trigger_id, snapshot_id];

    const updateSQL = 'UPDATE snapshot SET trigger_ID = (SELECT trigger_ID FROM Triggers WHERE trigger_type = ?) WHERE snapshot_ID = ?';

    conn.query(updateSQL, vals, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
};


//delete controller - worked after changing single quotes to back ticks - thanks chatGPT----------


exports.deleteSnapshot = (req, res) => {
    const snapshotId = req.params.id;
    const deleteSQL = `DELETE FROM Snapshot WHERE snapshot_ID = ${snapshotId}`;
    conn.query(deleteSQL, (err, rows) => {
        if (err) {
            console.error('Error deleting record:', err);
            res.status(500).send('Error deleting record');
        } else {
            console.log(`Deleted snapshot with ID ${snapshotId}`);
            res.redirect('/'); // Redirect to home page or any other appropriate page
        }
    });
};


//login controller--------------------------------------------------------------------------------------


exports.getLogin = (req, res) => {
    res.render('login');
};


exports.postLogin = (req, res) => {
    const { username, userpass } = req.body;
    const vals = [username, userpass];
    console.log(vals);

    // Validate input
    if (!username || !userpass) {
        return res.status(400).send("Username and password are required");
    }

    const checkuserSQL = `SELECT user_ID, user_DisplayName FROM user WHERE user_DisplayName = ? AND user_Password = ?`;

    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).send("Internal server error");
        }

        if (rows.length > 0) {
            console.log("Passwords match");

            // Store user information in session
            const session = req.session;
            session.isloggedin = true;
            session.userid = rows[0].user_ID;
            session.loggedinuser = rows[0].user_DisplayName;
            console.log("User logged in", session);

            // Redirect to original route if available, otherwise to '/'
            const orig_route = session.route || '/';
            console.log("Original route =", orig_route);
            delete session.route; // Remove stored route from session
            return res.redirect(orig_route); // Return to prevent further execution
        } else {
            console.log("Passwords do not match");
            const message = "Invalid username or password";
            return res.status(404).render("login", { message: message });
        }
    });
};






//logout controller--------------------------------------------------------------------------------------

exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error destroying session');
        }
        else
            console.log('Session destroyed');
        res.redirect('/');
    });
};


//overview controller--------------------------------------------------------------------------------------


exports.getSnapshotOverview = (req, res) => {
    var userinfo = {};
    const { isloggedin, userid } = req.session;
    console.log(`User logged in: ${isloggedin}, User ID: ${userid}`);

    if (isloggedin) {
        const getSQL = `SELECT User.user_DisplayName, User.user_ID
                                                        FROM user 
                                                        WHERE user.user_ID =  '${userid}'`;

        conn.query(getSQL, (err, rows) => {
            if (err) {
                console.error('Error fetching data from database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log(rows);
            const username = rows[0].user_DisplayName;
            const session = req.session;
            session.name = username;
            session.userid = userid;
            console.log(session);

            userinfo = { name: username, id: userid };
            console.log(userinfo);

            // Modify the SQL query to join Snapshot with Triggers and select trigger_type
            const selectSQL = `SELECT s.*, t.trigger_type 
                                                               FROM Snapshot s
                                                               INNER JOIN Triggers t ON s.trigger_ID = t.trigger_ID
                                                               WHERE s.user_ID = '${userid}'`;

            conn.query(selectSQL, (err, rows) => {
                if (err) {
                    console.error('Error fetching data from database:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.render('overview', { Snapshot: rows, loggedin: isloggedin, user: userinfo });
            });
        });
    } else {
        res.redirect('/login'); // Redirect to login page if user is not logged in
    }
};

//terms controller--------------------------------------------------------------------------------------


exports.getTerms = (req, res) => {
    const { isloggedin } = req.session;
    res.render('terms', { loggedin: isloggedin });
};



//signup controller--------------------------------------------------------------------------------------



// Your other controller functions...

exports.getSignup = (req, res) => {
    res.render('signup');
};

exports.postSignup = (req, res) => {
    const { username, email, password, userType } = req.body;
    const vals = [username, email, password, userType];
    console.log('Data to be inserted:', vals);

    const checkuserSQL = `SELECT user_ID FROM user WHERE user_DisplayName =  '${username}' AND user_Password = '${password}'`;

    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) throw err;

        const numrows = rows.length;
        console.log(numrows);

        if (numrows > 0) {
            console.log(rows);
            const session = req.session;
            session.isloggedin = true;
            session.userid = rows[0].user_ID;
            console.log("User logged in", session);

            res.redirect('/');
        } else {
            res.redirect('/');
        }
    }

    );
};


   
    


//chart.js controller --------------------------------------------------------------------------------------

const { getChartData } = require('./../utils/chartDataModule');
const db = require('./../utils/dbconn');

exports.getDashboard = (req, res) => {
    const { isloggedin } = req.session;

    // Query to retrieve emotion counts
    const emotionQuery = `SELECT 
        SUM(enjoyment) AS enjoyment_count,
        SUM(sadness) AS sadness_count,
        SUM(anger) AS anger_count,
        SUM(fear) AS fear_count,
        SUM(disgust) AS disgust_count,
        SUM(surprise) AS surprise_count,
        SUM(contempt) AS contempt_count
    FROM Snapshot;`;

    // Query to retrieve trigger data
    const triggerQuery = `SELECT Triggers.trigger_type AS trigger_type, COUNT(*) AS count   
    FROM Triggers
    JOIN Snapshot ON Triggers.trigger_id = Snapshot.trigger_id
    GROUP BY Triggers.trigger_type;`;

    db.query(emotionQuery, (errEmotion, emotionResults) => {
        if (errEmotion) {
            console.error('Error retrieving emotion data:', errEmotion);
            return res.status(500).send('Error retrieving emotion data');
        } else {
            const emotionCounts = [
                emotionResults[0].enjoyment_count,
                emotionResults[0].sadness_count,
                emotionResults[0].anger_count,
                emotionResults[0].fear_count,
                emotionResults[0].disgust_count,
                emotionResults[0].surprise_count,
                emotionResults[0].contempt_count
            ];

            db.query(triggerQuery, (errTrigger, triggerResults) => {
                if (errTrigger) {
                    console.error('Error retrieving trigger data:', errTrigger);
                    return res.status(500).send('Error retrieving trigger data');
                } else {
                    const triggers = triggerResults.map((row) => row.trigger_type);
                    const triggerCounts = triggerResults.map((row) => row.count);

                    const chartData = {
                        emotions: ['enjoyment', 'sadness', 'anger', 'fear', 'disgust', 'surprise', 'contempt'],
                        emotionCounts: emotionCounts,
                        triggers: triggers,
                        triggerCounts: triggerCounts
                    };

                    // Render your dashboard view with chart data
                    res.render('dashboard', { chartData: chartData, loggedin: isloggedin});
                }
            });
        }
    });
};

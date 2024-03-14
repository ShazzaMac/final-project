// This module is responsible for fetching chart data from the database
const db = require('./dbconn');

// Define the function to fetch chart data
const getChartData = (callback) => {
    // Your database query to fetch emotion data
    const emotionQuery = `
    SELECT
        SUM(enjoyment) AS enjoyment_count,
        SUM(sadness) AS sadness_count,
        SUM(anger) AS anger_count,
        SUM(fear) AS fear_count,
        SUM(disgust) AS disgust_count,
        SUM(surprise) AS surprise_count,
        SUM(contempt) AS contempt_count
    FROM Snapshot;
    `;

    // Your database query to fetch trigger data
    const triggerQuery = `SELECT Triggers.trigger_type AS trigger_type, COUNT(*) AS count   
    FROM Triggers
    JOIN Snapshot ON Triggers.trigger_id = Snapshot.trigger_id
    GROUP BY Triggers.trigger_type;`  


    // Execute both queries
    db.query(emotionQuery, (errEmotion, emotionResults) => {
        if (errEmotion) {
            // Handle the error
            console.error('Error retrieving emotion data:', errEmotion);
            callback(errEmotion, null);
        } else {
            // Process the emotion results
            const emotionCounts = [
                emotionResults[0].enjoyment_count,
                emotionResults[0].sadness_count,
                emotionResults[0].anger_count,
                emotionResults[0].fear_count,
                emotionResults[0].disgust_count,
                emotionResults[0].surprise_count,
                emotionResults[0].contempt_count
            ];

            // Execute the trigger query
            db.query(triggerQuery, (errTrigger, triggerResults) => {
                if (errTrigger) {
                    // Handle the error
                    console.error('Error retrieving trigger data:', errTrigger);
                    callback(errTrigger, null);
                } else {
                    // Process the trigger results
                    const triggers = triggerResults.map((row) => row.trigger_type);
                    const triggerCounts = triggerResults.map((row) => row.count);

                    // Construct the chart data object
                    const chartData = {
                        emotions: ['enjoyment', 'sadness', 'anger', 'fear', 'disgust', 'surprise', 'contempt'],
                        emotionCounts: emotionCounts,
                        triggers: triggers,
                        triggerCounts: triggerCounts
                    };

                    // Pass the chart data to the callback function
                    callback(null, chartData);
                }
            });
        }
    });
};

module.exports = { getChartData };

const conn = require('./connection');

const maxBuddyDistance = 20; // 20 miles

/**
 * FUNCTIONS
 * 
 * @function getUnmatchedBeers
 * 
 * @function getDrinkingBuddies
 * @function setDrinkingBuddies
 * 
 * @function findUser
 * @function getAllUsers
 * @function updateUser
 * 
 * @function deleteUser
 * 
 * @function addMatch
 * @function getMatches
 * @function updateMatch
 * 
 * 
 */

const orm = {

    getUnmatchedBeers: (username) => {
        
    },


    getDrinkingBuddies: (username) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM drinking_buddies WHERE username1 = ? OR username2 = ?';

            conn.query(query, [username, username], (err, drinkingBuddies) => {
                if (err) {
                    return reject({
                        status: 500,
                        success: false,
                        error: err,
                        message: `SQL failed in 'getDrinkingBuddies'`
                    });
                }

                resolve({
                    success: true,
                    drinking_buddies: drinkingBuddies
                });
            });
        })
    },

    setDrinkingBuddies: (username) => {
        return new Promise((resolve, reject) => {
            // get drinking buddies for selected users
            const drinkingBuddiesPromise = getDrinkingBuddies(username)
                .catch(err => {
                    return reject(err);
                })

            // get all users
            const allUsersPromise = getAllUsers()
                .catch(err => {
                    return reject(err);
                })


            Promise.all([drinkingBuddiesPromise, allUsersPromise], values => {
                const currentDrinkingBuddies = values[0];
                const userArr = values[1];

                // get only users not already matched with the selected user
                const newBuddies = userArr.filter(user => {
                    // make sure its not the selected user
                    if (user.username === username) {
                        return false;
                    }

                    // only return it if it nots currently in the database
                    const found = currentDrinkingBuddies.filter(x => {
                        if (x.username1 === user.username || x.username2 === user.username) {
                            return true;
                        }
                        return false;
                    }).length;

                    if (found) {
                        return false; // if found, it is not a new buddy
                    }
                    return true;


                });

                newBuddies = newBuddies.filter(x => {
                    // find distance between buds
                    const distance = 0; // use geolocation here

                    if (distance < maxBuddyDistance) {
                        return true;
                    }

                    return false;
                })

                // put the new buddies into the database
                newBuddies.forEach(x => {
                    const query = 'INSERT INTO drinking_buddies (username1, username2) VALUES (?, ?)';

                    conn.query(query, [username, x.username], (err, data) => {
                        if (err) {
                            return reject({
                                status: 500,
                                error: err,
                                success: false,
                                message: `SQL failed in 'setDrinkingBuddies'`
                            })
                        }
                    });
                })

            })
        });

        resolve();
    },

    findUser: (username) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

            conn.query(query, (err, userArr) => {
                if (err) {
                    return reject({
                        status: 500,
                        success: false,
                        error: err,
                        message: `SQL failed in 'findUser'`
                    });
                }

                if (!userArr.length) {
                    return reject({
                        status: 404,
                        success: false,
                        message: `No user found with those credentials`
                    });
                }

                resolve({
                    success: true,
                    user: userArr[0]
                });
            })
        })
    },

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users';

            conn.query(query, (err, data) => {
                if (err) {
                    return reject({
                        status: 500,
                        error: err,
                        success: false,
                        message: `SQL failed in 'getAllUsers'`
                    });
                }

                resolve({
                    success: true,
                    data
                })
            })
        })
    },

    updateUser: (username, colName, colVal) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET ?? = ? WHERE username = ?';

            conn.query(query, [colName, colVal, username], (err, data) => {
                if (err) {
                    return reject({
                        status: 500,
                        success: false,
                        error: err,
                        message: `SQL failed in 'updateUser'`
                    });
                }

                if (!data.affectedRows) {
                    return reject({
                        status: 404,
                        success: false,
                        error: null,
                        message: `User not able to update`
                    });
                }

                resolve({
                    success: true,
                    data
                })
            })
        })
    },



    deleteUser: (username) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM users WHERE username = ?';

            conn.query(query, [username], (err, data) => {
                if (err) {
                    return reject({
                        status: 500,
                        error: err,
                        success: false,
                        message: `SQL failed in 'deleteUser'`
                    })
                }

                if (!data.affectedRows) {
                    return reject({
                        status: 404,
                        success: false,
                        message: `User to be deleted not found`
                    })
                }

                resolve({
                    success: true,
                    data
                })
            })
        })
    },

    addMatch: (username, beerId, match) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO beer_matches (beer_id, username, matched) ';
            query += 'VALUES (?, ?, ?)';

            conn.query(query, [beerId, username, match], (err, data) => {
                if (err) {
                    return reject({
                        status: 500,
                        success: false,
                        error: err,
                        message: `SQL failed in 'addMatch'`
                    });
                }

                if (!data.affectedRows) {
                    console.log(`No rows were entered in 'addMatch'`);
                }

                resolve({
                    success: true,
                    data
                })
            });
        })
    },

    getMatches: (username) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM beer_matches WHERE username = ?';

            conn.query(query, [username], (err, data) => {
                if (err) {
                    return reject({
                        status: 500,
                        error: err,
                        success: false,
                        message: `SQL failed in 'getMatches'`
                    });
                }

                resolve({
                    success: true,
                    data
                })
            })
        })
    },

    updateMatch: (username, beerId, match) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE beer_matches SET matched = ? WHERE username = ? AND beer_id = ?';

            conn.query(query, [match, username, beerId], (err, data) => {
                if (err) {
                    return reject({
                        status: 500,
                        success: false,
                        error: err,
                        message: `SQL failed in 'updateMatch'`
                    });
                }

                if (!data.affectedRows) {
                    return reject({
                        status: 404,
                        error: null,
                        success: false,
                        message: 'That record does not exist'
                    });
                }

                resolve({
                    success: true,
                    data
                })
            })
        })
    }

};


module.exports = orm;
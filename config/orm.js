const conn = require('./connection');

const maxBuddyDistance = 20; // 20 miles
const getBeerLimit = 10;

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
 * @function addBeerMatch
 * @function getBeerMatches
 * @function updateBeerMatch
 * 
 * 
 */

const orm = {

    getUnmatchedBeers: (username, allBeers) => {
        return new Promise((resolve, reject) => {
            // return once 10 unmatched beers are found
            let unmatchedBeerCount = 0;
            let unmatchedBeerArray = [];

            // get all beer matches
            orm.getBeerMatches(username)
                .then(data => {
                    const matches = data.data;
                    // see if a beer is in beer matches
                    for (let i = 0; i < allBeers.length; i++) {
                        const foundBeers = matches.filter(match => match.beer_id === allBeers[i].id);
                        if (!foundBeers.length) {
                            unmatchedBeerArray = unmatchedBeerArray.concat(allBeers[i]);
                            unmatchedBeerCount++;

                            if (unmatchedBeerCount === getBeerLimit) {
                                break;
                            }
                        }
                    }
                    resolve(unmatchedBeerArray);
                })
        })
    },


    getDrinkingBuddies: (username) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM drinking_buddies WHERE username1 = ? OR username2 = ?';

            conn.query(query, [username, username], (err, data) => {
                if (err) {
                    console.log(err);
                    return reject({
                        status: 500,
                        success: false,
                        error: err,
                        message: `SQL failed in 'getDrinkingBuddies'`
                    });
                }

                let buddyArr = data.map(bud => {
                    if (bud.username1 === username) {
                        return {
                            username: bud.username2
                        }
                    }
                    if (bud.username2 === username) {
                        return {
                            username: bud.username1
                        }
                    }
                });

                let buddiesFullInfo = [];
                let fullInfoPromiseArr = [];
                for (let i = 0; i < buddyArr.length; i++) {
                    console.log(`i: ${i}`)
                    fullInfoPromiseArr = fullInfoPromiseArr.concat(orm.getUserInfo(buddyArr[i].username))
                }

                console.log(buddiesFullInfo);
                Promise.all(fullInfoPromiseArr).then(values => {
                    values.forEach(val => {
                        console.log(`for each`)
                        buddiesFullInfo = buddiesFullInfo.concat(val);
                    })
                    resolve({
                        success: true,
                        data: buddiesFullInfo
                    });
                })


            });
        })
    },

    getUserInfo: username => {
        return new Promise((resolve, reject) => {
            // get potential buddy's drink match list
            orm.findUser(username)
                .then(buddyInfo => {
                    const info = buddyInfo.user;
                    return resolve({
                        username: info.username,
                        first_name: info.first_name,
                        last_name: info.last_name,
                        age: info.age,
                        email_address: info.email_address
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        })

    },

    setDrinkingBuddies: (username) => {
        // get user's 'beer_matches' where 'matched' === true
        // join that result with the entire 'beer_matches' table on the 'beer_id' column
        // limit to where 'matched' === true
        // limit to where 'username' is different
        // find unique usernames
        // add usernames to array
        // add all usernames in that array to the user's 'drinking_buddies' table

        return new Promise((resolve, reject) => {
            // get drinking buddies for selected user
            const drinkingBuddiesPromise = orm.getDrinkingBuddies(username)
                .catch(err => {
                    console.log(err);
                    return reject(err);
                })

            // get all users
            const allUsersPromise = orm.getAllUsers()
                .catch(err => {
                    return reject(err);
                })

            // const get user's matched drinks
            const beerMatchesPromise = orm.getBeerMatches(username)
                .catch(err => {
                    return reject(err);
                })


            // wait for the above promises to finish
            Promise.all([drinkingBuddiesPromise, allUsersPromise, beerMatchesPromise]).then(values => {
                const currentDrinkingBuddies = values[0].data; // get all drinking buddies already in the database
                const userArr = values[1].data; // holds all users in the database
                const beerMatches = values[2].data;

                let userMatchesPromiseArr = [];
                userArr.forEach(user => {
                    userMatchesPromiseArr = userMatchesPromiseArr.concat(orm.getBeerMatches(user.username))
                })

                Promise.all(userMatchesPromiseArr).then(values => {
                    let newBuddies = userArr.filter((user, idx) => {
                        if (user.username === username) {
                            return false;   // filter the user out so he's not compared to itself
                        }

                        let found = false;
                        const buddyMatchesArr = values[idx].data;
                        for (let i = 0; i < buddyMatchesArr.length; i++) { // iterate through buddy's matches
                            for (let j = 0; j < beerMatches.length; j++) { // iterate through this user's matches
                                if (buddyMatchesArr[i].beer_id === beerMatches[j].beer_id) {
                                    console.log('----------------------------')
                                    console.log(`buddy: ${user.username} ${buddyMatchesArr[i].beer_id}`)
                                    console.log(`me: ${username} ${beerMatches[j].beer_id}`)
                                    console.log('----------------------------')
                                    return true; // return true so this user stays a potential new buddy
                                }
                            }
                        }
                        return false;
                    })

                    if (!newBuddies || !newBuddies.length) {
                        console.log('no new buddies found');
                        return reject('no new buddies found');
                    }

                    // get only users not already matched with the selected user
                    // newBuddies = userArr.filter(user => {
                    newBuddies = newBuddies.filter(user => {
                        // make sure its not the selected user
                        // if (user.username === username) {
                        //     return false;
                        // }

                        // only return it if it nots currently in the database
                        const found = currentDrinkingBuddies.filter(x => {
                            if (x.username1 === user.username || x.username2 === user.username) {
                                return true; // return true so 'found' is true
                            }
                            return false;
                        }).length;

                        if (found) {
                            return false; // if found, it is not a new buddy so do not return it
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

                    console.log(`New buds:`);
                    console.log(newBuddies);

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

                    resolve({
                        success: true
                    });

                })

                // // make sure users have at least one common drink with the user
                // let newBuddies = userArr.filter(async user => {
                //     // get potential buddy's drink match list
                //     await orm.getBeerMatches(user.username)
                //         .then(matches => {
                //             let found = false;
                //             for (let i = 0; i < matches.length; i++) {
                //                 for (let j = 0; j < beerMatches.length; j++) {
                //                     if (matches[i].beer_id === beerMatches[j].beer_id) {
                //                         return true; // return true so this use stays a potential new buddy
                //                     }
                //                 }
                //             }
                //             return false;
                //         })
                // })



            })
        });
    },

    findUser: (username) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE username = ?';

            conn.query(query, [username], (err, userArr) => {
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

    addBeerMatch: (username, beerId, match) => {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO beer_matches (beer_id, username, matched) ';
            query += 'VALUES (?, ?, ' + match + ')';

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

    getBeerMatches: (username) => {
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

    updateBeerMatch: (username, beerId, match) => {
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
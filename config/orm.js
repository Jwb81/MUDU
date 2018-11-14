const conn = require('./connection');

const orm = {
    getAllDrinkingBuddies: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM drinking_buddies';

            conn.query(query, (err, drinkingBuddies) => {
                if (err) {
                    return reject({
                        status: 500,
                        success: false,
                        error: err,
                        message: `SQL failed in 'getAllDrinkingBuddies'`
                    });
                }

                resolve({
                    success: true,
                    drinking_buddies: drinkingBuddies
                });
            });
        })
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

};


module.exports = orm;
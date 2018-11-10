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
    }
};


module.exports = orm;
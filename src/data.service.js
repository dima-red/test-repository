const dataServiceObj = {

    loginsObj: {},

    parentEl: null,

    set: function (param, data) {
        localStorage.setItem(param, JSON.stringify(data));
    },

    remove: function (param) {
        localStorage.removeItem(param);
    },

    get: function(storage, param) {
       return storage.getItem(param);
    },

    getSignedUpUsers: function (storage) {
        if (storage.usersLogins) {
            const mapFromLocalStorage = this.get(storage, "usersLogins");
            const objFromLocalStorage = JSON.parse(mapFromLocalStorage);
            
            return objFromLocalStorage;
        } else {
            return {};
        }
    }, 

    getLoggedInUser: function (storage) {
        if (storage.loggedInUser) {
            return JSON.parse(storage.getItem("loggedInUser"));
        } else {
            return null;
        }
    }
};
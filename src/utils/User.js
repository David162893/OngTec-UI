const user = JSON.parse(localStorage.getItem("user"))

export const User = {
    getUserId: () => {
        return user ? user.id : null
    },

    getUserRegionId: () => {
        return user ? user.idRegion : null
    },

    getUserLocationId: () => {
        return user ? user.idLocation : null
    }
}
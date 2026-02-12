export const User = {
    getUserId: () => {
        const user = JSON.parse(localStorage.getItem("user"))
        return user ? user.id : null
    }
}
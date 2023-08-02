

const dateMaker = (completionDate) => {
    const date = new Date(completionDate)
    const month = () => {
        if (date.getMonth() === 0) {
            return 'January'
        } else if (date.getMonth() === 1) {
            return 'February'
        } else if (date.getMonth() === 2) {
            return 'March'
        } else if (date.getMonth() === 3) {
            return 'April'
        } else if (date.getMonth() === 4) {
            return 'May'
        } else if (date.getMonth() === 5) {
            return 'June'
        } else if (date.getMonth() === 6) {
            console.log()
            return 'July'
        } else if (date.getMonth() === 7) {
            return 'August'
        } else if (date.getMonth() === 8) {
            return 'September'
        } else if (date.getMonth() === 9) {
            return 'October'
        } else if (date.getMonth() === 10) {
            return 'November'
        } else if (date.getMonth() === 11) {
            return 'December'
        }
    }

    return date.getDate().toString() + ' ' + month() + ', ' + date.getFullYear().toString()
}

export default dateMaker

const firstLetterUpperCase = (word) => {
    let updatedWord = word[0].toUpperCase()+ word.substr(1).toLowerCase();
    return updatedWord;
}
const trimBothSideSpaces = (word) => {
    return word.trim();
}
module.exports = {
    firstLetterUpperCase,
    trimBothSideSpaces
}
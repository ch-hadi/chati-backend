export const paginationFun = (page, size, record) => {
    //Size
    const resultsPerPage = size;
    const numOfResults = record.length;
    const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
    const startingLimit = (page - 1) * resultsPerPage;
    let iterator = (page - 3) < 1 ? 1 : page - 3;
    let results = record.splice(startingLimit, resultsPerPage)
    let endingLink = (iterator + 4) <= numberOfPages ? (iterator + 4) : page + (numberOfPages - page);
    return { success: true, results, page, iterator, endingLink, numberOfPages }
}
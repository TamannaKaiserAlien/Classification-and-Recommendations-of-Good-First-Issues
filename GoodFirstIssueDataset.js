const url = "https://api.github.com/rate_limit";
async function fetchRemainingLimit() {
  const response = await fetch(url, {
    headers: {
      "Authorization": "Bearer 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"
    }
  });
  const data = await response.json();
  return data?.resources?.core?.remaining;
}
async function fetchRepoName(repoUrl){
    const response = await fetch(repoUrl, {
        headers: {
          "Authorization": "Bearer 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"
        }
      });
      const data = await response.json();
      return data?.resources?.core?.remaining;
}

async function fetchGoodFirstIssueData(gitApiUrl) {
  const response = await fetch(gitApiUrl, {
    headers: {
      "Authorization": "Bearer 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"
    }
  });
  return await response.json();
}

fetchRemainingLimit().then(limit => {
  let list = [];
const loopLimit=limit >= 100?0:limit
    const fetchPromises = [];
    for (let i = 0; i < loopLimit; ++i) {
      fetchPromises.push(
        fetchGoodFirstIssueData("https://api.github.com/repos/bitwarden/mobile/issues?labels=good%20first%20issue")
      );
    }

    // Wait for all promises to resolve
    Promise.all(fetchPromises)
      .then(dataArray => {
        dataArray.map(item=>{
            list.push(...item.map((data)=>( {
                id:data?.id,
                issueNumber:data?.number,
                title:data?.title,
                userId:data?.user?.id,
                body:data?.body
            })))
        });
        console.log(list);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
});

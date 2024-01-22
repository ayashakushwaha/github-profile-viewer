let username = "ayashakushwaha";
let pageNumber = 1;
let pageSize = 10;
let repoCount = 0;

const getUserInfo = async () => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const result = await response.json();
  const { login, avatar_url, bio, html_url, public_repos, location } = result;
  document.getElementById("profilePhoto").setAttribute("src", avatar_url);
  document.getElementById("profileUrl").setAttribute("href", html_url);
  document.getElementById("profileUrl").innerText = html_url;
  document.getElementById("username").innerText = login;
  document.getElementById("bio").innerText = bio;
  document.getElementById("location").innerText = location;
  repoCount = public_repos;
  await getRepoInfo();
  createPagination();
  document.getElementById("loading-screen").setAttribute("class", "d-none");
  document.getElementById("profile").classList.remove("d-none");
};

const getRepoInfo = async () => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=${pageSize}&page=${pageNumber}`
  );
  const result = await response.json();
  var repoDiv = document.getElementById("repoRow");
  repoDiv.innerHTML = "";
  for (var repo of result) {
    const { name, html_url, description, topics, language } = repo;

    const topicsBadges = topics.map(
      (t) => `<span class="badge rounded-pill bg-primary me-1">${t}</span>`
    );

    if (language) {
      topicsBadges.unshift(
        `<span class="badge rounded-pill bg-warning me-1">${language}</span>`
      );
    }

    console.log(topicsBadges);
    var repoCol = document
      .getElementById("repoCol")
      .innerHTML.replace("{repoName}", `<a href="${html_url}">${name}</a>`)
      .replace("{repoDescription}", description)
      .replace("{repoTopics}", topicsBadges.join(""));
    var div = document.createElement("div");
    div.setAttribute("class", "col-6 p-2 d-flex align-items-stretch");
    var temp = (div.innerHTML = repoCol);
    repoDiv.appendChild(div);
  }
};

const createPagination = () => {
  const paginationUl = document.getElementById("pagination");
  paginationUl.innerHTML = "";

  let previousBtn = document.createElement("li");
  previousBtn.setAttribute("class", "page-item");
  previousBtn.innerHTML =
    '<a class="page-link" href="#" aria-label="Previous" onclick="updatePageNumber(pageNumber-1)" ><span aria-hidden="true">&laquo;</span>';
  paginationUl.appendChild(previousBtn);

  const pages = Math.ceil(repoCount / pageSize);

  for (let i = 1; i <= pages; i++) {
    let li = document.createElement("li");
    li.setAttribute("class", "page-item");
    li.innerHTML = `<a class="page-link" href="#" onclick="updatePageNumber(${i})">${i}</a>`;
    paginationUl.appendChild(li);
  }

  let nextBtn = document.createElement("li");
  nextBtn.setAttribute("class", "page-item");
  nextBtn.innerHTML =
    '<a class="page-link" href="#" onclick="updatePageNumber(pageNumber+1)" ><span aria-hidden="true">&raquo;</span>';
  paginationUl.appendChild(nextBtn);
};

const updatePageSize = async () => {
  pageSize = document.getElementById("pageSize").value;
  await getRepoInfo();
  createPagination();
};

const updatePageNumber = async (pageCount) => {
  if (pageCount < 1 || pageCount > Math.ceil(repoCount / pageSize)) {
    return;
  }
  pageNumber = pageCount;
  await getRepoInfo();
};

window.onload = async (event) => {
  await getUserInfo();
};

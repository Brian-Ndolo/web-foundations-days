const loadUsersButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const status = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let users = [];


async function loadUsers() {
    loadUsersButton.disabled = true;
    status.textContent = "Loading users...";

    try {
        const response = await fetch(
"https://jsonplaceholder.typicode.com/users"        );

        if (!response.ok) {
            throw new Error("Failed to load users.");
        }

        users = await response.json();

        status.textContent = "Users loaded successfully.";
        renderUsers(users);

    } catch (error) {
        status.textContent =
            "Sorry, we could not load the users.";

        usersList.textContent = "";

    } finally {
        loadUsersButton.disabled = false;
    }
}


function renderUsers(list) {
    usersList.textContent = "";

    if (list.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No users match your filter.";
        usersList.appendChild(message);
        return;
    }

    list.forEach((user) => {
        const listItem = document.createElement("li");

        const name = document.createElement("h3");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;

        listItem.appendChild(name);
        listItem.appendChild(email);
        listItem.appendChild(city);
        listItem.appendChild(company);

        usersList.appendChild(listItem);
    });
}


loadUsersButton.addEventListener("click", loadUsers);


filterInput.addEventListener("input", () => {
    const filterText = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(filterText)
    );

    renderUsers(filteredUsers);
});
const userForm = document.querySelector(".user-form")
let isProcessing = false
let processedUser = null

const requestScheduler = new JobScheduler()

const displayUser = (user = {
    id: "unknown",
    first_name: "unknown",
    last_name: "unknown",
    email: "unknown"
}) => {
    const usersContainer = document.querySelector(".users-container")
    usersContainer.innerHTML += `
        <div class="user-card">
            <p>ID: ${user.id}</p>
            <p>Name: ${user.first_name} ${user.last_name}</p>
            <p>Email: ${user.email}</p>
        </div>
    `
}

const updateStatus = () => {
    const statusWrapper = document.querySelector(".status-wrapper")
    statusWrapper.innerHTML = `
        <p>Processing user number: ${processedUser}</p>
        <p>Pending users: ${requestScheduler.getItems().join(", ")}</p>
    `
}

const processApiRequestsInQueue = async () => {
    if (requestScheduler.size() > 0 && !isProcessing) {
        isProcessing = true
        processedUser = requestScheduler.dequeue()
        updateStatus()

        const response = await fetch(`https://reqres.in/api/users/${processedUser}?delay=10`)
        const jsonRes = await response.json()
        const userDetails = jsonRes.data
        isProcessing = false

        processApiRequestsInQueue()
        displayUser(userDetails)
        updateStatus()
    } else if (requestScheduler.size() === 0 && !isProcessing) {
        processedUser = "<b>no current tasks</b>"
    }
}

userForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const userIdInput = document.querySelector(".user-id-input")

    if (userIdInput.value.trim() === "") {
        alert("User ID is required")
        return
    }

    requestScheduler.enqueue(userIdInput.value)
    processApiRequestsInQueue()
    updateStatus()

    userIdInput.value = ""
})
